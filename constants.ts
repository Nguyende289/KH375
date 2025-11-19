import { CCCDProfile, VehicleRegistration, DriverLicense, User, Status, Role } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', username: 'admin', name: 'Nguyễn Văn Quản Trị', location: 'Hà Nội', phone: '0901234567', role: Role.ADMIN },
  { id: 'u2', username: 'collector1', name: 'Lê Thu Thập', location: 'Đà Nẵng', phone: '0909876543', role: Role.COLLECTOR },
  { id: 'u3', username: 'reviewer1', name: 'Trần Kiểm Duyệt', location: 'TP.HCM', phone: '0901112223', role: Role.REVIEWER },
];

export const MOCK_CCCD: CCCDProfile[] = [
  {
    id: 'HS001',
    phone: '0912345678',
    imgFront: 'https://picsum.photos/300/200?random=1',
    imgBack: 'https://picsum.photos/300/200?random=2',
    dateAdded: '2023-10-25',
    userAdded: 'Lê Thu Thập',
    location: 'Đà Nẵng',
    status: Status.APPROVED,
    reviewer: 'Trần Kiểm Duyệt'
  },
  {
    id: 'HS002',
    phone: '0987654321',
    imgFront: 'https://picsum.photos/300/200?random=3',
    imgBack: 'https://picsum.photos/300/200?random=4',
    dateAdded: '2023-10-26',
    userAdded: 'Lê Thu Thập',
    location: 'Hà Nội',
    status: Status.PENDING,
  },
  {
    id: 'HS003',
    phone: '0999888777',
    imgFront: 'https://picsum.photos/300/200?random=5',
    imgBack: 'https://picsum.photos/300/200?random=6',
    dateAdded: '2023-10-26',
    userAdded: 'Nguyễn Văn A',
    location: 'TP.HCM',
    status: Status.REVIEWING,
    reviewer: 'Trần Kiểm Duyệt'
  },
  {
    id: 'HS004',
    phone: '0911223344',
    imgFront: 'https://picsum.photos/300/200?random=7',
    imgBack: 'https://picsum.photos/300/200?random=8',
    dateAdded: '2023-10-27',
    userAdded: 'Lê Thu Thập',
    location: 'Đà Nẵng',
    status: Status.APPROVED,
    reviewer: 'Trần Kiểm Duyệt'
  }
];

export const MOCK_VEHICLES: VehicleRegistration[] = [
  {
    id: 'VX001',
    parentId: 'HS001',
    imgFront: 'https://picsum.photos/300/200?random=9',
    imgBack: 'https://picsum.photos/300/200?random=10',
    dateAdded: '2023-10-25',
    userAdded: 'Lê Thu Thập',
    location: 'Đà Nẵng',
    status: Status.APPROVED,
    reviewer: 'Trần Kiểm Duyệt',
    plateNumber: '43A-123.45'
  },
  {
    id: 'VX002',
    parentId: 'HS001',
    imgFront: 'https://picsum.photos/300/200?random=11',
    imgBack: 'https://picsum.photos/300/200?random=12',
    dateAdded: '2023-10-25',
    userAdded: 'Lê Thu Thập',
    location: 'Đà Nẵng',
    status: Status.APPROVED,
    reviewer: 'Trần Kiểm Duyệt',
    plateNumber: '43C-999.99'
  },
  {
    id: 'VX003',
    parentId: 'HS003',
    imgFront: 'https://picsum.photos/300/200?random=13',
    imgBack: 'https://picsum.photos/300/200?random=14',
    dateAdded: '2023-10-26',
    userAdded: 'Nguyễn Văn A',
    location: 'TP.HCM',
    status: Status.PENDING,
    plateNumber: '51F-555.55'
  }
];

export const MOCK_LICENSES: DriverLicense[] = [
  {
    id: 'DL001',
    parentId: 'HS001',
    imgFront: 'https://picsum.photos/300/200?random=15',
    imgBack: 'https://picsum.photos/300/200?random=16',
    dateAdded: '2023-10-25',
    userAdded: 'Lê Thu Thập',
    location: 'Đà Nẵng',
    status: Status.APPROVED,
    reviewer: 'Trần Kiểm Duyệt',
    licenseClass: 'B2'
  },
  {
    id: 'DL002',
    parentId: 'HS002',
    imgFront: 'https://picsum.photos/300/200?random=17',
    imgBack: 'https://picsum.photos/300/200?random=18',
    dateAdded: '2023-10-26',
    userAdded: 'Lê Thu Thập',
    location: 'Hà Nội',
    status: Status.PENDING,
    licenseClass: 'A1'
  }
];
