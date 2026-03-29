import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Mail, 
  Edit2, 
  Lock, 
  Trash2, 
  ClipboardList, 
  CreditCard, 
  Clock, 
  Users, 
  Settings as SettingsIcon, 
  UserCircle,
  TrendingUp,
  FileText,
  Menu
} from 'lucide-react';
import { subscribeToPersonnel } from '../services/firebaseService';

export default function PersonnelView() {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPersonnel((data) => {
      setPersonnel(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const tools = [
    { label: 'Bảng công', desc: 'Theo dõi giờ làm', icon: ClipboardList },
    { label: 'Bảng lương', desc: 'Chi trả & Thuế', icon: CreditCard },
    { label: 'Ca làm việc', desc: 'Lịch trình & Phân ca', icon: Clock },
    { label: 'Nhân sự', desc: 'Đang hoạt động', icon: Users, active: true },
    { label: 'Cài đặt', desc: 'Hệ thống & Bảo mật', icon: SettingsIcon },
    { label: 'Tài khoản', desc: 'Thông tin cá nhân', icon: UserCircle },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Quản lý nhân sự</h1>
          <p className="text-on-surface-variant">Danh sách nhân viên và công cụ quản lý</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/10">
          <Plus className="w-5 h-5" />
          Thêm nhân viên
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tools */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-container-low rounded-3xl p-4 space-y-1">
            {tools.map((tool) => (
              <button 
                key={tool.label}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                  tool.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                <tool.icon className={`w-6 h-6 ${tool.active ? 'text-white' : 'text-primary/60 group-hover:text-primary'}`} />
                <div className="text-left">
                  <p className="font-bold text-sm leading-none mb-1">{tool.label}</p>
                  <p className={`text-[10px] ${tool.active ? 'text-white/70' : 'text-on-surface-variant/60'}`}>{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-br from-secondary to-secondary-container p-6 rounded-3xl text-white relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            <TrendingUp className="w-10 h-10 mb-4 opacity-80" />
            <h4 className="text-lg font-bold mb-1">Báo cáo nhân sự</h4>
            <p className="text-xs text-white/70 mb-4">Xem phân tích chi tiết về biến động nhân sự tháng này.</p>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              Xem ngay
              <Menu className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Personnel List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Tìm kiếm nhân viên..."
                className="w-full bg-surface-container-lowest border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <Users className="w-4 h-4 absolute left-3 top-3.5 text-on-surface-variant/40" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-surface-container-lowest text-sm font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors">
                <FileText className="w-4 h-4" />
                Xuất Excel
              </button>
              <button className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-surface-container-lowest text-sm font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors">
                <Lock className="w-4 h-4" />
                Bảo mật
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personnel.map((person) => (
                <div key={person.id} className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-[0px_12px_32px_rgba(20,86,193,0.04)] group hover:shadow-xl transition-all duration-500">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={person.photoURL || `https://picsum.photos/seed/${person.uid}/100/100`} 
                          className="w-16 h-16 rounded-2xl object-cover shadow-md"
                          alt={person.displayName}
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${person.status === 'active' ? 'bg-secondary' : 'bg-on-surface-variant/40'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black tracking-tight">{person.displayName || person.email}</h3>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest">{person.position || 'Nhân viên'}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-surface-container-low p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">Phòng ban</p>
                      <p className="text-sm font-bold">{person.department || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">Ngày vào làm</p>
                      <p className="text-sm font-bold">{person.createdAt?.toDate ? person.createdAt.toDate().toLocaleDateString() : 'Chưa cập nhật'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-surface-container-low">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary">ID</div>
                      <div className="w-8 h-8 rounded-full bg-secondary/10 border-2 border-white flex items-center justify-center text-[10px] font-bold text-secondary">HR</div>
                    </div>
                    <button className="text-error p-2 rounded-lg hover:bg-error/5 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
