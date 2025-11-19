import React from 'react';
import { FullProfile, VehicleRegistration, DriverLicense } from '../types';
import { StatusBadge } from './StatusBadge';
import { ArrowLeft, User, Car, CreditCard, MapPin, Calendar, UserCheck, Phone } from 'lucide-react';

interface ProfileDetailProps {
  profile: FullProfile;
  onBack: () => void;
}

const ImageCard = ({ title, front, back }: { title: string, front: string, back: string }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
    <h4 className="font-medium text-sm text-gray-700 mb-3">{title}</h4>
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">
        <span className="text-xs text-gray-500">Mặt trước</span>
        <img src={front} alt="Front" className="w-full h-32 object-cover rounded-md border border-gray-200 hover:opacity-90 transition-opacity cursor-zoom-in bg-white" />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-gray-500">Mặt sau</span>
        <img src={back} alt="Back" className="w-full h-32 object-cover rounded-md border border-gray-200 hover:opacity-90 transition-opacity cursor-zoom-in bg-white" />
      </div>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-2 text-sm">
    <Icon size={16} className="text-gray-400" />
    <span className="text-gray-500 w-24">{label}:</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

export const ProfileDetail: React.FC<ProfileDetailProps> = ({ profile, onBack }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white rounded-full text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ {profile.id}</h1>
          <p className="text-gray-500 text-sm">Chi tiết thông tin và các giấy tờ liên quan</p>
        </div>
        <div className="ml-auto">
           <StatusBadge status={profile.status} />
        </div>
      </div>

      {/* Main CCCD Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <User className="text-blue-600" size={24} />
          <h2 className="text-lg font-semibold text-gray-900">Thông tin CCCD (Gốc)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <InfoRow icon={Phone} label="Số ĐT" value={profile.phone} />
            <InfoRow icon={MapPin} label="Địa bàn" value={profile.location} />
            <InfoRow icon={User} label="Người nhập" value={profile.userAdded} />
            <InfoRow icon={Calendar} label="Ngày nhập" value={profile.dateAdded} />
            <InfoRow icon={UserCheck} label="Người duyệt" value={profile.reviewer || 'Chưa có'} />
          </div>
          <ImageCard title="Ảnh CCCD" front={profile.imgFront} back={profile.imgBack} />
        </div>
      </div>

      {/* Linked Vehicles */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Car className="text-indigo-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Giấy Đăng Ký Xe ({profile.vehicles.length})</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {profile.vehicles.map((vehicle: VehicleRegistration) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="font-bold text-gray-800">{vehicle.plateNumber || vehicle.id}</h3>
                    <p className="text-xs text-gray-500">Mã ĐKX: {vehicle.id}</p>
                 </div>
                 <StatusBadge status={vehicle.status} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 text-sm">
                    <InfoRow icon={User} label="Người nhập" value={vehicle.userAdded} />
                    <InfoRow icon={Calendar} label="Ngày nhập" value={vehicle.dateAdded} />
                  </div>
                  <ImageCard title="Ảnh Đăng Ký Xe" front={vehicle.imgFront} back={vehicle.imgBack} />
               </div>
            </div>
          ))}
          {profile.vehicles.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
              Không có thông tin xe đăng ký
            </div>
          )}
        </div>
      </div>

       {/* Linked Licenses */}
       <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <CreditCard className="text-purple-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Giấy Phép Lái Xe ({profile.licenses.length})</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {profile.licenses.map((license: DriverLicense) => (
            <div key={license.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="font-bold text-gray-800">Hạng {license.licenseClass || 'N/A'}</h3>
                    <p className="text-xs text-gray-500">Mã GPLX: {license.id}</p>
                 </div>
                 <StatusBadge status={license.status} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 text-sm">
                    <InfoRow icon={User} label="Người nhập" value={license.userAdded} />
                    <InfoRow icon={Calendar} label="Ngày nhập" value={license.dateAdded} />
                  </div>
                  <ImageCard title="Ảnh GPLX" front={license.imgFront} back={license.imgBack} />
               </div>
            </div>
          ))}
          {profile.licenses.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
              Không có thông tin bằng lái
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
