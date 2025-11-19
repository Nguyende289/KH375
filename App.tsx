import React, { useState, useEffect } from 'react';
import { getProfiles } from './services/dataService';
import { FullProfile } from './types';
import { Dashboard } from './components/Dashboard';
import { RecordList } from './components/RecordList';
import { ProfileDetail } from './components/ProfileDetail';
import { UploadModal } from './components/UploadModal';
import { SettingsModal } from './components/SettingsModal';
import { LayoutDashboard, List, Upload, LogOut, Menu, X, Settings } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'LIST'>('LIST');
  const [selectedProfile, setSelectedProfile] = useState<FullProfile | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [data, setData] = useState<FullProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getProfiles();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProfileSelect = (profile: FullProfile) => {
    setSelectedProfile(profile);
    setSidebarOpen(false); // Close mobile sidebar if open
  };

  const handleBackToList = () => {
    setSelectedProfile(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
          </div>
        </div>
      );
    }

    if (selectedProfile) {
      return <ProfileDetail profile={selectedProfile} onBack={handleBackToList} />;
    }

    if (currentView === 'DASHBOARD') {
      return <Dashboard data={data} />;
    }

    return <RecordList data={data} onSelectProfile={handleProfileSelect} />;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="font-bold text-xl text-primary flex items-center gap-2">
           <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">QL</div>
           Hồ Sơ Số
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="hidden md:flex items-center gap-3 mb-10">
             <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 font-bold text-lg">QL</div>
             <div>
               <h1 className="font-bold text-gray-900 leading-tight">Quản Lý<br/>Hồ Sơ Số</h1>
             </div>
          </div>

          <nav className="space-y-2 flex-1">
            <button 
              onClick={() => { setCurrentView('LIST'); setSelectedProfile(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                currentView === 'LIST' && !selectedProfile
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List size={20} />
              Danh Sách Hồ Sơ
            </button>
            
            <button 
              onClick={() => { setCurrentView('DASHBOARD'); setSelectedProfile(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                currentView === 'DASHBOARD' 
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard size={20} />
              Theo Dõi & Báo Cáo
            </button>

            <button 
              onClick={() => { setIsUploadOpen(true); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors"
            >
              <Upload size={20} />
              Tải Ảnh / Nhập Liệu
            </button>

            <button 
              onClick={() => { setIsSettingsOpen(true); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors mt-8 border-t border-gray-100 pt-4"
            >
              <Settings size={20} />
              Cấu Hình Kết Nối
            </button>
          </nav>

          <div className="pt-6 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-3 px-4 mb-4">
              <img src="https://picsum.photos/40/40?random=100" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">Nguyễn Quản Trị</p>
                <p className="text-xs text-gray-500 truncate">Admin - Hà Nội</p>
              </div>
            </div>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={16} />
              Đăng Xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen no-scrollbar">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb / Title */}
          {!selectedProfile && (
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentView === 'LIST' ? 'Danh Sách Hồ Sơ' : 'Tổng Quan Hệ Thống'}
                </h2>
                <p className="text-gray-500 mt-1">
                  {currentView === 'LIST' 
                    ? 'Quản lý và tra cứu thông tin chi tiết các hồ sơ số.' 
                    : 'Thống kê hoạt động và tình trạng xử lý hồ sơ.'}
                </p>
              </div>
              {currentView === 'LIST' && (
                <button 
                  onClick={() => setIsUploadOpen(true)}
                  className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 font-medium flex items-center gap-2 transition-all active:scale-95"
                >
                  <Upload size={18} />
                  Thêm Mới
                </button>
              )}
            </div>
          )}

          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSuccess={fetchData}
      />
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={fetchData}
      />
    </div>
  );
}

export default App;
