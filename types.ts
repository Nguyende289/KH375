export enum Status {
  APPROVED = 'Duyệt',
  PENDING = 'Chờ duyệt',
  REVIEWING = 'Đang duyệt',
}

export enum Role {
  COLLECTOR = 'Thu thập',
  REVIEWER = 'Duyệt',
  ADMIN = 'Admin',
}

export interface User {
  id: string;
  username: string;
  name: string;
  location: string;
  phone: string;
  role: Role;
}

// Sheet 1: Thông tin chính (CCCD)
export interface CCCDProfile {
  id: string; // Mã hồ sơ (Primary Key)
  phone: string;
  imgFront: string;
  imgBack: string;
  dateAdded: string;
  userAdded: string; // Tên người nhập
  location: string;
  status: Status;
  reviewer?: string;
}

// Sheet 2: Giấy Đăng Ký Xe (Linked via parentId)
export interface VehicleRegistration {
  id: string;
  parentId: string; // Link to CCCDProfile.id
  imgFront: string;
  imgBack: string;
  dateAdded: string;
  userAdded: string;
  location: string;
  status: Status;
  reviewer?: string;
  plateNumber?: string; // Extra field for visual
}

// Sheet 3: Giấy Phép Lái Xe (Linked via parentId)
export interface DriverLicense {
  id: string;
  parentId: string; // Link to CCCDProfile.id
  imgFront: string;
  imgBack: string;
  dateAdded: string;
  userAdded: string;
  location: string;
  status: Status;
  reviewer?: string;
  licenseClass?: string; // Extra field for visual
}

export interface FullProfile extends CCCDProfile {
  vehicles: VehicleRegistration[];
  licenses: DriverLicense[];
}

export interface AppConfig {
  spreadsheetId: string;
  apiKey: string;
}
