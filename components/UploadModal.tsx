import React, { useState } from 'react';
import { X, Upload, Camera, Image as ImageIcon, Check } from 'lucide-react';
import { saveLocalCCCD, saveLocalVehicle, saveLocalLicense } from '../services/dataService';
import { Status, Role } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'CCCD' | 'VEHICLE' | 'LICENSE'>('CCCD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    parentId: '',
    phone: '',
    location: 'Hà Nội',
    userAdded: 'Admin Mobile', // Default for demo
    imgFront: '',
    imgBack: '',
    plateNumber: '',
    licenseClass: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'imgFront' | 'imgBack') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const today = new Date().toISOString().split('T')[0];
    const commonData = {
      imgFront: formData.imgFront || 'https://via.placeholder.com/300x200?text=No+Image',
      imgBack: formData.imgBack || 'https://via.placeholder.com/300x200?text=No+Image',
      dateAdded: today,
      userAdded: formData.userAdded,
      location: formData.location,
      status: Status.PENDING,
    };

    try {
      if (activeTab === 'CCCD') {
        saveLocalCCCD({
          id: formData.id,
          phone: formData.phone,
          ...commonData
        });
      } else if (activeTab === 'VEHICLE') {
        saveLocalVehicle({
          id: formData.id,
          parentId: formData.parentId,
          plateNumber: formData.plateNumber,
          ...commonData
        });
      } else if (activeTab === 'LICENSE') {
        saveLocalLicense({
          id: formData.id,
          parentId: formData.parentId,
          licenseClass: formData.licenseClass,
          ...commonData
        });
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSuccess(); // Refresh data in App
          onClose();
          // Reset form
          setFormData({
            id: '',
            parentId: '',
            phone: '',
            location: 'Hà Nội',
            userAdded: 'Admin Mobile',
            imgFront: '',
            imgBack: '',
            plateNumber: '',
            licenseClass: ''
          });
        }, 1500);
      }, 800);

    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert("Có lỗi xảy ra khi lưu dữ liệu");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Tải lên hồ sơ mới</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
            {(['CCCD', 'VEHICLE', 'LICENSE'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'CCCD' ? 'Hồ Sơ Chính' : tab === 'VEHICLE' ? 'Đăng Ký Xe' : 'GPLX'}
              </button>
            ))}
          </div>

          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-green-600 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check size={32} />
              </div>
              <h3 className="text-xl font-bold">Đã lưu thành công!</h3>
              <p className="text-gray-500">Dữ liệu đã được lưu vào bộ nhớ ứng dụng.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common Fields for Child Records */}
              {activeTab !== 'CCCD' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã Hồ Sơ Gốc (CCCD ID)</label>
                  <input 
                    type="text" 
                    name="parentId"
                    value={formData.parentId}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:outline-none" 
                    placeholder="Nhập ID của hồ sơ chính..." 
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {activeTab === 'CCCD' ? 'Mã Hồ Sơ (ID)' : activeTab === 'VEHICLE' ? 'Mã Đăng Ký Xe' : 'Mã GPLX'}
                  </label>
                  <input 
                    type="text" 
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:outline-none" 
                    placeholder="Nhập mã định danh..." 
                  />
                </div>
                
                {activeTab === 'CCCD' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:outline-none" 
                      placeholder="09xxxx..." 
                    />
                  </div>
                )}

                {activeTab === 'VEHICLE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biển Số Xe</label>
                    <input 
                      type="text" 
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:outline-none" 
                      placeholder="30A-xxxxx..." 
                    />
                  </div>
                )}

                {activeTab === 'LICENSE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hạng Bằng</label>
                    <input 
                      type="text" 
                      name="licenseClass"
                      value={formData.licenseClass}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:outline-none" 
                      placeholder="A1, B2..." 
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa Bàn</label>
                  <select 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP.HCM">TP.HCM</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Người Nhập</label>
                   <input 
                      type="text" 
                      name="userAdded"
                      value={formData.userAdded}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:outline-none" 
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front Image Upload */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh mặt trước</label>
                    <div className={`border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden h-32 ${formData.imgFront ? 'border-primary' : ''}`}>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" onChange={(e) => handleFileChange(e, 'imgFront')} />
                        {formData.imgFront ? (
                          <img src={formData.imgFront} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
                                <ImageIcon size={20} />
                            </div>
                            <p className="text-xs text-gray-500">Chạm để tải ảnh</p>
                          </>
                        )}
                    </div>
                </div>

                {/* Back Image Upload */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh mặt sau</label>
                    <div className={`border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden h-32 ${formData.imgBack ? 'border-primary' : ''}`}>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" onChange={(e) => handleFileChange(e, 'imgBack')} />
                         {formData.imgBack ? (
                          <img src={formData.imgBack} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
                                <ImageIcon size={20} />
                            </div>
                            <p className="text-xs text-gray-500">Chạm để tải ảnh</p>
                          </>
                        )}
                    </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg text-xs md:text-sm">
                <Camera size={16} />
                <span>Sử dụng camera điện thoại: Nhấn vào khung ảnh &gt; Chụp ảnh.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>Đang lưu...</>
                ) : (
                  <>
                    <Upload size={20} />
                    Lưu Vào App
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
