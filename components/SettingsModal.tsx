import React, { useState, useEffect } from 'react';
import { X, Save, Link } from 'lucide-react';
import { getStoredConfig, saveConfig } from '../services/dataService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      const config = getStoredConfig();
      if (config) {
        setSpreadsheetId(config.spreadsheetId);
        setApiKey(config.apiKey);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig({ spreadsheetId, apiKey });
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-primary">
                <Link size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Kết nối Google Sheet</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
            Nhập thông tin từ Google Cloud Console để kết nối dữ liệu thực. Nếu để trống, ứng dụng sẽ dùng dữ liệu mẫu.
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Sheet ID</label>
            <input 
              type="text" 
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:outline-none text-sm font-mono" 
              placeholder="1BxiMVs0XRA5nFMdKvBdBZj..."
            />
            <p className="text-xs text-gray-400 mt-1">ID nằm trong URL của file Google Sheet.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input 
              type="text" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:outline-none text-sm font-mono" 
              placeholder="AIzaSyD..."
            />
            <p className="text-xs text-gray-400 mt-1">Cần kích hoạt Google Sheets API trong Google Cloud Console.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Lưu & Kết Nối
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
