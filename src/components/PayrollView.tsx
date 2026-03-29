import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Search, 
  Filter, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  MoreHorizontal,
  FileText,
  AlertCircle
} from 'lucide-react';
import { subscribeToPayroll } from '../services/firebaseService';
import { auth } from '../firebase';

export default function PayrollView() {
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin (this should be handled more robustly in a real app)
    // For now, we'll assume if they can see this view they might be admin or we filter by UID
    const checkAdmin = async () => {
      // In a real app, you'd check the user's role from their profile
      setIsAdmin(auth.currentUser?.email === 'hesinhthaittt@gmail.com');
    };
    checkAdmin();

    const unsubscribe = subscribeToPayroll((data) => {
      setPayrollData(data);
      setLoading(false);
    }, auth.currentUser?.uid, auth.currentUser?.email === 'hesinhthaittt@gmail.com');

    return () => unsubscribe();
  }, []);

  const stats = [
    { label: 'Tổng quỹ lương', value: '1.2B', trend: '+12%', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Nhân viên', value: payrollData.length.toString(), trend: '+2', icon: Users, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Thuế & BHXH', value: '156M', trend: '+5%', icon: FileText, color: 'text-on-surface-variant', bg: 'bg-surface-container-high' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Bảng lương</h1>
          <p className="text-on-surface-variant">Quản lý thu nhập và chi trả nhân viên tháng 10/2023</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface-container-low text-on-surface font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-surface-container-high transition-all">
            <Calendar className="w-5 h-5" />
            Tháng 10
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/10">
            <Download className="w-5 h-5" />
            Xuất báo cáo
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

      {/* Payroll Table */}
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
          ) : payrollData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
              <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">Chưa có dữ liệu lương tháng này</p>
              <p className="text-sm opacity-60">Dữ liệu sẽ xuất hiện sau khi chốt công.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nhân viên</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Lương cơ bản</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Phụ cấp</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Khấu trừ</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Thực nhận</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Trạng thái</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {payrollData.map((row) => (
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
                    <td className="px-6 py-4 font-bold text-sm">{row.baseSalary?.toLocaleString() || 0}đ</td>
                    <td className="px-6 py-4 font-bold text-sm text-secondary">+{row.allowances?.toLocaleString() || 0}đ</td>
                    <td className="px-6 py-4 font-bold text-sm text-error">-{row.deductions?.toLocaleString() || 0}đ</td>
                    <td className="px-6 py-4">
                      <span className="text-base font-black text-primary">{(row.netSalary || 0).toLocaleString()}đ</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        row.status === 'paid' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                      }`}>
                        {row.status === 'paid' ? 'Đã chi trả' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-28 right-6 md:hidden">
        <button className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 active:scale-90 transition-transform">
          <Download className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
