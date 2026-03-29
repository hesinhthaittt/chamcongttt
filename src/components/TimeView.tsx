import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  ArrowRight,
  ClipboardList,
  Search,
  Filter
} from 'lucide-react';
import { subscribeToAttendance } from '../services/firebaseService';
import { auth } from '../firebase';

export default function TimeView() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAttendance((data) => {
      setAttendanceData(data);
      setLoading(false);
    }, auth.currentUser?.uid, auth.currentUser?.email === 'hesinhthaittt@gmail.com');

    return () => unsubscribe();
  }, []);

  const stats = [
    { label: 'Đúng giờ', value: attendanceData.filter(a => a.status === 'on-time').length.toString(), trend: '+5%', icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Đi muộn', value: attendanceData.filter(a => a.status === 'late').length.toString(), trend: '-2%', icon: AlertCircle, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Nghỉ phép', value: attendanceData.filter(a => a.status === 'leave').length.toString(), trend: '+1', icon: Calendar, color: 'text-on-surface-variant', bg: 'bg-surface-container-high' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Chấm công & Ca làm</h1>
          <p className="text-on-surface-variant">Theo dõi thời gian làm việc và lịch trình hôm nay</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface-container-low text-on-surface font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-surface-container-high transition-all">
            <Calendar className="w-5 h-5" />
            29 Tháng 03
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/10">
            <Plus className="w-5 h-5" />
            Tạo ca mới
          </button>
        </div>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-surface-container-low group hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-secondary text-xs font-bold bg-secondary/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-surface-container-low overflow-hidden">
        <div className="p-6 border-b border-surface-container-low flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên..."
              className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-on-surface-variant/40" />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-surface-container-low text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors">
              <Filter className="w-4 h-4" />
              Bộ lọc
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
              <ClipboardList className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">Chưa có dữ liệu chấm công hôm nay</p>
              <p className="text-sm opacity-60">Nhân viên sẽ xuất hiện sau khi check-in.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nhân viên</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Giờ vào</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Giờ ra</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Tổng giờ</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Trạng thái</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {attendanceData.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {row.employeeName?.split(' ').map((n: string) => n[0]).join('') || 'NV'}
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-none mb-1">{row.employeeName || 'Ẩn danh'}</p>
                          <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{row.employeeId || 'ID-000'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-on-surface-variant/40" />
                        {row.checkInTime || '--:--'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-on-surface-variant/40" />
                        {row.checkOutTime || '--:--'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-primary">{row.totalHours || '0'}h</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        row.status === 'on-time' ? 'bg-secondary/10 text-secondary' : 
                        row.status === 'late' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {row.status === 'on-time' ? 'Đúng giờ' : row.status === 'late' ? 'Đi muộn' : 'Nghỉ phép'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-secondary to-secondary-container p-8 rounded-[2.5rem] text-white relative overflow-hidden group cursor-pointer">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <h4 className="text-2xl font-black mb-2">Tự động hóa lịch trình</h4>
            <p className="text-white/70 mb-6 max-w-xs">Hệ thống AI sẽ tự động phân ca dựa trên hiệu suất và mong muốn của nhân viên.</p>
            <button className="bg-white text-secondary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl transition-all">
              Bắt đầu ngay
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-surface-container-high group hover:border-primary/20 transition-all">
          <h4 className="text-2xl font-black mb-2">Quản lý nghỉ phép</h4>
          <p className="text-on-surface-variant mb-6 max-w-xs">Xem và duyệt các yêu cầu nghỉ phép đang chờ xử lý.</p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img key={i} src={`https://picsum.photos/seed/u${i}/100/100`} className="w-10 h-10 rounded-full border-4 border-surface-container-low" alt="User" />
              ))}
            </div>
            <p className="text-sm font-bold text-primary">+5 yêu cầu mới</p>
          </div>
        </div>
      </div>
    </div>
  );
}
