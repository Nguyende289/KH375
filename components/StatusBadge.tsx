import React, { useState } from 'react';
import { FullProfile, Status } from '../types';
import { StatusBadge } from './StatusBadge';
import { Search, Filter, ChevronRight, Car, CreditCard, User } from 'lucide-react';

interface RecordListProps {
  data: FullProfile[];
  onSelectProfile: (profile: FullProfile) => void;
}

export const RecordList: React.FC<RecordListProps> = ({ data, onSelectProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredData = data.filter(profile => {
    const matchesSearch = 
      profile.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.phone.includes(searchTerm) ||
      profile.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.userAdded.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || profile.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo ID, SĐT, người nhập..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value={Status.APPROVED}>Đã duyệt</option>
            <option value={Status.REVIEWING}>Đang duyệt</option>
            <option value={Status.PENDING}>Chờ duyệt</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Mã Hồ Sơ</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Người Nhập</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Địa Bàn</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Ngày Nhập</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Hồ Sơ Con</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Trạng Thái</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  onClick={() => onSelectProfile(item)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                    <User size={16} className="text-blue-500" />
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.userAdded}</td>
                  <td className="px-6 py-4 text-gray-600">{item.location}</td>
                  <td className="px-6 py-4 text-gray-600">{item.dateAdded}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {item.vehicles.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">
                          <Car size={12} /> {item.vehicles.length} Xe
                        </span>
                      )}
                      {item.licenses.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium">
                          <CreditCard size={12} /> {item.licenses.length} GPLX
                        </span>
                      )}
                      {item.vehicles.length === 0 && item.licenses.length === 0 && (
                        <span className="text-gray-400 italic text-xs">Không có</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 group-hover:text-primary transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    Không tìm thấy hồ sơ nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
