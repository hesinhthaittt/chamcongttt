import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  Plus, 
  Save, 
  CheckCircle2, 
  Info,
  Calendar,
  Clock,
  Settings as SettingsIcon
} from 'lucide-react';
import { subscribeToSettings, updateSetting } from '../services/firebaseService';

interface SettingsViewProps {
  onViewChange?: (view: string) => void;
}

export default function SettingsView({ onViewChange }: SettingsViewProps) {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => {
    const unsubscribe = subscribeToSettings((data) => {
      setSettings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateSetting = async (key: string, value: any) => {
    await updateSetting(key, value);
  };

  const tabs = [
    { id: 'company', label: 'Công ty', icon: Building2 },
    { id: 'permissions', label: 'Phân quyền', icon: ShieldCheck },
    { id: 'penalties', label: 'Chính sách phạt', icon: AlertTriangle, view: 'penalty' },
    { id: 'events', label: 'Sự kiện', icon: Calendar, view: 'events' },
  ];

  const permissions = [
    { role: 'Admin', access: 'Toàn quyền hệ thống', color: 'text-primary', bg: 'bg-primary/10' },
    { role: 'Manager', access: 'Quản lý phòng ban, Duyệt đơn', color: 'text-secondary', bg: 'bg-secondary/10' },
    { role: 'Employee', access: 'Xem lịch, Chấm công, Gửi đơn', color: 'text-on-surface-variant', bg: 'bg-surface-container-high' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Cài đặt hệ thống</h1>
          <p className="text-on-surface-variant">Cấu hình doanh nghiệp và quản lý quyền truy cập</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/10">
          <Save className="w-5 h-5" />
          Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-container-low rounded-3xl p-4 space-y-1">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => {
                  if (tab.view && onViewChange) {
                    onViewChange(tab.view);
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                  activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-white' : 'text-primary/60 group-hover:text-primary'}`} />
                <div className="text-left">
                  <p className="font-bold text-sm leading-none">{tab.label}</p>
                </div>
                <ChevronRight className={`w-4 h-4 ml-auto opacity-40 ${activeTab === tab.id ? 'opacity-100' : ''}`} />
              </button>
            ))}
          </div>

          <div className="bg-surface-container-low p-6 rounded-3xl border border-surface-container-high">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Info className="w-4 h-4" />
              <p className="text-xs font-bold uppercase tracking-widest">Trợ giúp</p>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">Cần hỗ trợ cấu hình? Liên hệ đội ngũ kỹ thuật của SmartCheck.</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'company' && (
            <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-surface-container-low space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Tên công ty</label>
                  <input 
                    type="text" 
                    defaultValue="Precision & Flow Corp"
                    className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Mã số thuế</label>
                  <input 
                    type="text" 
                    defaultValue="0102030405"
                    className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Địa chỉ</label>
                  <input 
                    type="text" 
                    defaultValue="Tòa nhà Smart, Cầu Giấy, Hà Nội"
                    className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Email liên hệ</label>
                  <input 
                    type="email" 
                    defaultValue="hr@precisionflow.com"
                    className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-surface-container-low">
                <h4 className="text-lg font-black mb-4">Giờ làm việc mặc định</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-4">
                    <Clock className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Bắt đầu</p>
                      <p className="font-bold">08:00 AM</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-4">
                    <Clock className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Kết thúc</p>
                      <p className="font-bold">05:30 PM</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-4">
                    <Calendar className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ngày làm việc</p>
                      <p className="font-bold">Thứ 2 - Thứ 6</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-surface-container-low space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-black">Ma trận phân quyền</h4>
                <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                  <Plus className="w-4 h-4" />
                  Thêm vai trò
                </button>
              </div>
              
              <div className="space-y-4">
                {permissions.map((perm) => (
                  <div key={perm.role} className="flex items-center justify-between p-6 rounded-3xl bg-surface-container-low group hover:bg-surface-container-high transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`${perm.bg} ${perm.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-lg leading-none mb-1">{perm.role}</p>
                        <p className="text-xs text-on-surface-variant font-medium">{perm.access}</p>
                      </div>
                    </div>
                    <button className="p-2 rounded-xl hover:bg-white text-on-surface-variant transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
