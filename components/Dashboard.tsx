
import React, { useMemo, useState } from 'react';
import { FullProfile, Status } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Users, FileCheck, MapPin, Calendar, Filter, RefreshCw, CreditCard, Car, FileText, Search, Calculator } from 'lucide-react';

interface DashboardProps {
  data: FullProfile[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Global Date Filter State
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Section 3: Specific Location Filter State
  const [selectedDetailLocation, setSelectedDetailLocation] = useState<string>('');

  // 1. Filter Data by Date Range ONLY
  const dateFilteredData = useMemo(() => {
    return data.filter(item => {
      let matchDate = true;
      if (startDate || endDate) {
        const itemDate = new Date(item.dateAdded);
        if (!isNaN(itemDate.getTime())) {
           // Reset time to compare dates only
           const compareDate = new Date(itemDate.toDateString());
           
           if (startDate) {
             const start = new Date(startDate);
             matchDate = matchDate && compareDate >= new Date(start.toDateString());
           }
           if (endDate) {
             const end = new Date(endDate);
             matchDate = matchDate && compareDate <= new Date(end.toDateString());
           }
        }
      }
      return matchDate;
    });
  }, [data, startDate, endDate]);

  // 2. Calculate General Totals (Section 1)
  const generalStats = useMemo(() => {
    return {
      cccd: dateFilteredData.length,
      vehicles: dateFilteredData.reduce((acc, curr) => acc + curr.vehicles.length, 0),
      licenses: dateFilteredData.reduce((acc, curr) => acc + curr.licenses.length, 0),
      users: new Set(dateFilteredData.map(i => i.userAdded)).size,
    };
  }, [dateFilteredData]);

  // 3. Aggregate Data by Location for Table 1 (Section 2)
  const locationStats = useMemo(() => {
    const stats: Record<string, { 
      name: string; 
      cccd: number; 
      vehicles: number; 
      licenses: number; 
      subTotalDocs: number; // vehicles + licenses
      grandTotal: number;   // cccd + vehicles + licenses (used for sorting only)
    }> = {};

    dateFilteredData.forEach(item => {
      const loc = item.location || 'Chưa xác định';
      if (!stats[loc]) {
        stats[loc] = { name: loc, cccd: 0, vehicles: 0, licenses: 0, subTotalDocs: 0, grandTotal: 0 };
      }
      
      const vCount = item.vehicles.length;
      const lCount = item.licenses.length;
      
      stats[loc].cccd += 1;
      stats[loc].vehicles += vCount;
      stats[loc].licenses += lCount;
      stats[loc].subTotalDocs += (vCount + lCount);
      stats[loc].grandTotal = stats[loc].cccd + stats[loc].subTotalDocs;
    });

    return Object.values(stats).sort((a, b) => b.grandTotal - a.grandTotal);
  }, [dateFilteredData]);

  // Calculate Grand Totals Row for Table 1
  const tableGrandTotal = useMemo(() => {
    return locationStats.reduce((acc, curr) => ({
      cccd: acc.cccd + curr.cccd,
      vehicles: acc.vehicles + curr.vehicles,
      licenses: acc.licenses + curr.licenses,
      subTotalDocs: acc.subTotalDocs + curr.subTotalDocs,
      grandTotal: acc.grandTotal + curr.grandTotal
    }), { cccd: 0, vehicles: 0, licenses: 0, subTotalDocs: 0, grandTotal: 0 });
  }, [locationStats]);

  // 4. Calculate Detail Data for Specific Location (Section 3)
  const detailLocationStats = useMemo(() => {
    if (!selectedDetailLocation) return null;

    const locationData = dateFilteredData.filter(item => item.location === selectedDetailLocation);
    
    // Group by User in that location
    const userStats: Record<string, { name: string; cccd: number; vehicles: number; licenses: number; approved: number; pending: number }> = {};

    locationData.forEach(item => {
      const user = item.userAdded;
      if (!userStats[user]) {
        userStats[user] = { name: user, cccd: 0, vehicles: 0, licenses: 0, approved: 0, pending: 0 };
      }
      userStats[user].cccd += 1;
      userStats[user].vehicles += item.vehicles.length;
      userStats[user].licenses += item.licenses.length;
      
      if (item.status === Status.APPROVED) userStats[user].approved += 1;
      else userStats[user].pending += 1;
    });

    return Object.values(userStats);
  }, [dateFilteredData, selectedDetailLocation]);

  // Handle auto-select first location if none selected and data exists
  React.useEffect(() => {
    if (!selectedDetailLocation && locationStats.length > 0) {
      setSelectedDetailLocation(locationStats[0].name);
    }
  }, [locationStats]);

  const handleResetDate = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* === Global Date Filter === */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
             <Calendar size={20} className="text-primary"/>
             <h3>Chọn Khoảng Thời Gian Báo Cáo</h3>
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={handleResetDate}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
            >
              <RefreshCw size={14} /> Đặt lại
            </button>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Từ ngày</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Đến ngày</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* === Section 1: General Report Cards === */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText size={20} /> Báo Cáo Tổng Hợp
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg shadow-blue-200 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm font-medium">Tổng Hồ Sơ (CCCD)</span>
              <div className="p-2 bg-white/20 rounded-lg"><Users size={20} /></div>
            </div>
            <h3 className="text-3xl font-bold">{generalStats.cccd}</h3>
            <p className="text-xs text-blue-100 mt-1">Hồ sơ gốc đã nhập</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-lg shadow-indigo-200 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-indigo-100 text-sm font-medium">Tổng Giấy Đăng Ký Xe</span>
              <div className="p-2 bg-white/20 rounded-lg"><Car size={20} /></div>
            </div>
            <h3 className="text-3xl font-bold">{generalStats.vehicles}</h3>
            <p className="text-xs text-indigo-100 mt-1">Tổng số xe đã nhập</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg shadow-purple-200 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 text-sm font-medium">Tổng Giấy Phép Lái Xe</span>
              <div className="p-2 bg-white/20 rounded-lg"><CreditCard size={20} /></div>
            </div>
            <h3 className="text-3xl font-bold">{generalStats.licenses}</h3>
            <p className="text-xs text-purple-100 mt-1">Tổng số GPLX đã nhập</p>
          </div>
        </div>
      </div>

      {/* === Section 2: Table 1 - Aggregation by Location === */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MapPin size={20} className="text-primary" /> 
            Bảng Tổng Hợp Theo Địa Bàn
          </h2>
          <p className="text-sm text-gray-500 mt-1">Thống kê chi tiết hồ sơ và giấy tờ thu thập được theo từng khu vực.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs">Địa Bàn</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right uppercase text-xs bg-blue-50/50">Số Hồ Sơ</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right uppercase text-xs">SL ĐKX</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right uppercase text-xs">SL GPLX</th>
                <th className="px-6 py-4 font-semibold text-indigo-600 text-right uppercase text-xs bg-indigo-50/50">Tổng Giấy Tờ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {locationStats.map((loc) => (
                <tr key={loc.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{loc.name}</td>
                  <td className="px-6 py-4 text-right text-blue-600 font-bold bg-blue-50/30">{loc.cccd}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{loc.vehicles}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{loc.licenses}</td>
                  <td className="px-6 py-4 text-right text-indigo-600 font-bold bg-indigo-50/30">{loc.subTotalDocs}</td>
                </tr>
              ))}
              {locationStats.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">
                    Không có dữ liệu trong khoảng thời gian này.
                  </td>
                </tr>
              )}
            </tbody>
            {/* TOTAL ROW */}
            <tfoot className="bg-gray-100 border-t-2 border-gray-200">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">TỔNG HỢP</td>
                <td className="px-6 py-4 text-right font-bold text-blue-700">{tableGrandTotal.cccd}</td>
                <td className="px-6 py-4 text-right font-bold text-gray-700">{tableGrandTotal.vehicles}</td>
                <td className="px-6 py-4 text-right font-bold text-gray-700">{tableGrandTotal.licenses}</td>
                <td className="px-6 py-4 text-right font-bold text-indigo-700">{tableGrandTotal.subTotalDocs}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* === Section 3: Table 2 - Detailed View by Location === */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Search size={20} className="text-primary" /> 
              Chi Tiết Theo Nhân Viên
            </h2>
            <p className="text-sm text-gray-500 mt-1">Xem hiệu suất thu thập của nhân viên tại địa bàn cụ thể.</p>
          </div>
          
          {/* Specific Location Filter */}
          <div className="flex items-center gap-2 min-w-[250px]">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Chọn địa bàn:</label>
            <select 
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
              value={selectedDetailLocation}
              onChange={(e) => setSelectedDetailLocation(e.target.value)}
            >
              {locationStats.length === 0 && <option value="">Không có dữ liệu</option>}
              {locationStats.map(loc => (
                <option key={loc.name} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>

        {detailLocationStats && detailLocationStats.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* Chart Column */}
            <div className="p-6 col-span-1">
               <h4 className="font-semibold text-gray-700 mb-4 text-center">Biểu đồ cơ cấu</h4>
               <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailLocationStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="cccd" fill="#3b82f6" name="Số Hồ Sơ" stackId="a" />
                    <Bar dataKey="vehicles" fill="#6366f1" name="ĐKX" stackId="a" />
                    <Bar dataKey="licenses" fill="#a855f7" name="GPLX" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
               </div>
            </div>

            {/* Table Column */}
            <div className="col-span-2 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-600">Nhân Viên</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 text-center">Số Hồ Sơ</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 text-center">ĐKX</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 text-center">GPLX</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 text-center">Đã Duyệt</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 text-center">Chờ Xử Lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {detailLocationStats.map((user) => (
                    <tr key={user.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-center text-blue-600 font-medium">{user.cccd}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{user.vehicles}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{user.licenses}</td>
                      <td className="px-6 py-4 text-center text-green-600 font-medium">{user.approved}</td>
                      <td className="px-6 py-4 text-center text-yellow-600 font-medium">{user.pending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 italic">
            Vui lòng chọn địa bàn có dữ liệu để xem chi tiết.
          </div>
        )}
      </div>
    </div>
  );
};
