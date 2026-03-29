import React from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Edit2, 
  Bell, 
  Lock, 
  Globe, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface ProfileViewProps {
  user: any;
  userProfile: any;
}

export default function ProfileView({ user, userProfile }: ProfileViewProps) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { label: 'Thông tin cá nhân', icon: User, desc: 'Tên, Email, Số điện thoại' },
    { label: 'Bảo mật & Mật khẩu', icon: Lock, desc: 'Đổi mật khẩu, 2FA' },
    { label: 'Thông báo', icon: Bell, desc: 'Cài đặt thông báo đẩy & Email' },
    { label: 'Ngôn ngữ', icon: Globe, desc: 'Tiếng Việt (Mặc định)' },
    { label: 'Thiết bị', icon: Smartphone, desc: 'Quản lý các thiết bị đã đăng nhập' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Profile Header */}
      <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-surface-container-low relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <img 
              src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/200/200`} 
              className="w-32 h-32 rounded-[2.5rem] object-cover shadow-xl border-4 border-white"
              alt={user?.displayName}
              referrerPolicy="no-referrer"
            />
            <button className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-lg hover:scale-110 active:scale-90 transition-all">
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-3xl font-black tracking-tight">{userProfile?.displayName || user?.displayName || 'Người dùng'}</h1>
              <CheckCircle2 className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-on-surface-variant font-medium flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {user?.email}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                {userProfile?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
              </span>
              <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                {userProfile?.status === 'active' ? 'Đang hoạt động' : 'Tạm khóa'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Menu */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-on-surface-variant ml-4">Cài đặt tài khoản</h2>
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-4 shadow-sm border border-surface-container-low space-y-1">
            {menuItems.map((item) => (
              <button 
                key={item.label}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-all group"
              >
                <div className="bg-surface-container-high text-primary p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm leading-none mb-1">{item.label}</p>
                  <p className="text-xs text-on-surface-variant/60 font-medium">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto opacity-20 group-hover:opacity-100 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-error ml-4">Vùng nguy hiểm</h2>
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-6 shadow-sm border border-error/10 space-y-6">
            <div className="space-y-2">
              <h4 className="font-bold text-on-surface leading-none">Đăng xuất</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">Kết thúc phiên làm việc hiện tại trên thiết bị này.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full bg-error/10 text-error px-6 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-error hover:text-white transition-all active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              Đăng xuất ngay
            </button>
          </div>

          <div className="bg-surface-container-low p-6 rounded-[2.5rem] border border-surface-container-high">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <Shield className="w-4 h-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Bảo mật</p>
            </div>
            <p className="text-xs text-on-surface-variant/60 leading-relaxed">Tài khoản của bạn được bảo vệ bởi xác thực 2 lớp của Google.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
