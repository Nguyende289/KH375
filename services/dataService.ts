import { MOCK_CCCD, MOCK_VEHICLES, MOCK_LICENSES } from '../constants';
import { FullProfile, CCCDProfile, VehicleRegistration, DriverLicense, AppConfig, Status } from '../types';

const CONFIG_KEY = 'app_sheet_config';
const LOCAL_DATA_KEY = 'app_local_data';

export const getStoredConfig = (): AppConfig | null => {
  const stored = localStorage.getItem(CONFIG_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveConfig = (config: AppConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

// --- Local Data Management ---

interface LocalData {
  cccds: CCCDProfile[];
  vehicles: VehicleRegistration[];
  licenses: DriverLicense[];
}

const getLocalData = (): LocalData => {
  const stored = localStorage.getItem(LOCAL_DATA_KEY);
  return stored ? JSON.parse(stored) : { cccds: [], vehicles: [], licenses: [] };
};

const saveLocalData = (data: LocalData) => {
  localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(data));
};

export const saveLocalCCCD = (profile: CCCDProfile) => {
  const data = getLocalData();
  data.cccds.push(profile);
  saveLocalData(data);
};

export const saveLocalVehicle = (vehicle: VehicleRegistration) => {
  const data = getLocalData();
  data.vehicles.push(vehicle);
  saveLocalData(data);
};

export const saveLocalLicense = (license: DriverLicense) => {
  const data = getLocalData();
  data.licenses.push(license);
  saveLocalData(data);
};

// --- Google Sheets Parsing ---

// Vietnamese Column Mappings
const COLUMN_MAP = {
  id: ['id', 'mã', 'stt'],
  parentId: ['id_ho_so', 'id_cha', 'mã hồ sơ', 'id_goc'],
  phone: ['số đt', 'sdt', 'số điện thoại', 'điện thoại'],
  imgFront: ['ảnh trước', 'ảnh cccd trước', 'mặt trước'],
  imgBack: ['ảnh sau', 'ảnh cccd sau', 'mặt sau'],
  dateAdded: ['ngày nhập', 'ngày tạo'],
  userAdded: ['người nhập', 'nhân viên'],
  location: ['địa bàn', 'khu vực', 'tỉnh thành'],
  status: ['tình trạng', 'trạng thái'],
  reviewer: ['người duyệt', 'cán bộ duyệt'],
  plateNumber: ['biển số', 'biển ks'],
  licenseClass: ['hạng', 'loại bằng']
};

const normalizeHeader = (header: string) => header.toLowerCase().trim();

const mapRowToObject = (headers: string[], row: any[], mapKeys: string[]) => {
  const obj: any = {};
  
  const keyToIndex: Record<string, number> = {};
  
  headers.forEach((h, index) => {
    const normalizedH = normalizeHeader(h);
    for (const [internalKey, variations] of Object.entries(COLUMN_MAP)) {
      if (variations.some(v => normalizedH.includes(v))) {
        if (!keyToIndex[internalKey]) {
          keyToIndex[internalKey] = index;
        }
      }
    }
  });

  mapKeys.forEach(key => {
    const index = keyToIndex[key];
    if (index !== undefined && row[index]) {
      obj[key] = row[index];
    } else {
      obj[key] = ''; 
    }
  });

  // Helper to convert status string to Enum
  if (obj.status) {
    const s = obj.status.toLowerCase();
    if (s.includes('đang')) obj.status = Status.REVIEWING;
    else if (s.includes('duyệt') && !s.includes('chờ')) obj.status = Status.APPROVED;
    else obj.status = Status.PENDING;
  } else {
    obj.status = Status.PENDING;
  }

  return obj;
};

const fetchSheetData = async (spreadsheetId: string, apiKey: string, range: string) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || 'Failed to fetch sheet data');
  }
  return response.json();
};

export const getProfiles = async (): Promise<FullProfile[]> => {
  const config = getStoredConfig();
  const localData = getLocalData(); // Load local data
  
  let cccds: CCCDProfile[] = [];
  let vehicles: VehicleRegistration[] = [];
  let licenses: DriverLicense[] = [];

  // 1. Load Remote Data (Mock or Sheet)
  if (!config || !config.apiKey || !config.spreadsheetId) {
    // Use Mock Data
    cccds = [...MOCK_CCCD];
    vehicles = [...MOCK_VEHICLES];
    licenses = [...MOCK_LICENSES];
  } else {
    try {
      const [sheet1Data, sheet2Data, sheet3Data] = await Promise.all([
        fetchSheetData(config.spreadsheetId, config.apiKey, 'Sheet1!A:Z'),
        fetchSheetData(config.spreadsheetId, config.apiKey, 'Giấy ĐKX!A:Z'),
        fetchSheetData(config.spreadsheetId, config.apiKey, 'Giấy phép lai xe!A:Z'),
      ]);

      const cccdHeaders = sheet1Data.values[0];
      const cccdRows = sheet1Data.values.slice(1);
      const fetchedCCCDs = cccdRows.map((row: any[]) => 
        mapRowToObject(cccdHeaders, row, ['id', 'phone', 'imgFront', 'imgBack', 'dateAdded', 'userAdded', 'location', 'status', 'reviewer'])
      ) as CCCDProfile[];

      const vehicleHeaders = sheet2Data.values[0];
      const vehicleRows = sheet2Data.values.slice(1);
      const fetchedVehicles = vehicleRows.map((row: any[]) => 
        mapRowToObject(vehicleHeaders, row, ['id', 'parentId', 'imgFront', 'imgBack', 'dateAdded', 'userAdded', 'location', 'status', 'reviewer', 'plateNumber'])
      ) as VehicleRegistration[];

      const licenseHeaders = sheet3Data.values[0];
      const licenseRows = sheet3Data.values.slice(1);
      const fetchedLicenses = licenseRows.map((row: any[]) => 
        mapRowToObject(licenseHeaders, row, ['id', 'parentId', 'imgFront', 'imgBack', 'dateAdded', 'userAdded', 'location', 'status', 'reviewer', 'licenseClass'])
      ) as DriverLicense[];

      cccds = fetchedCCCDs;
      vehicles = fetchedVehicles;
      licenses = fetchedLicenses;

    } catch (error) {
      console.error("Error fetching from Google Sheets, falling back to mock:", error);
      // Fallback to mock on error
      cccds = [...MOCK_CCCD];
      vehicles = [...MOCK_VEHICLES];
      licenses = [...MOCK_LICENSES];
    }
  }

  // 2. Merge Local Data
  // We combine arrays. ID collision might happen but for this app we assume unique IDs
  cccds = [...cccds, ...localData.cccds];
  vehicles = [...vehicles, ...localData.vehicles];
  licenses = [...licenses, ...localData.licenses];

  // 3. Structure as FullProfile
  return cccds.map(profile => {
    const profileVehicles = vehicles.filter(v => v.parentId === profile.id);
    const profileLicenses = licenses.filter(l => l.parentId === profile.id);
    
    return {
      ...profile,
      vehicles: profileVehicles,
      licenses: profileLicenses
    };
  });
};
