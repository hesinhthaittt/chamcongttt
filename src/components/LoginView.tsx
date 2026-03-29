import { 
  QrCode, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { useState } from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function LoginView() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-[2.5rem] overflow-hidden shadow-[0px_12px_32px_rgba(20,86,193,0.08)]">
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-primary-container relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display font-black text-white text-2xl tracking-tight uppercase">SmartCheck</span>
            </div>
            <h1 className="font-display font-extrabold text-5xl text-white leading-tight mb-6">
              Quản trị nhân sự <br/> theo phong cách <br/> <span className="text-secondary-container">Hiện đại.</span>
            </h1>
            <p className="text-white/80 font-medium text-lg max-w-md">
              Hệ thống chấm công và quản lý nhân sự tối ưu, giúp doanh nghiệp vận hành trơn tru và minh bạch.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl flex items-center gap-4 border border-white/20 shadow-xl">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`} 
                    alt="User" 
                    className="w-10 h-10 rounded-full border-2 border-primary"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <p className="text-white text-sm font-semibold">
                Gia nhập cùng hơn <span className="text-white font-bold">5,000+</span> doanh nghiệp đang tin dùng.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-20 flex flex-col justify-center">
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-black text-primary text-xl tracking-tight uppercase">SmartCheck</span>
          </div>

          <div className="max-w-md mx-auto w-full">
            <header className="mb-10">
              <h2 className="font-display font-bold text-3xl mb-2">Chào mừng trở lại</h2>
              <p className="text-on-surface-variant font-medium">Vui lòng chọn phương thức đăng nhập.</p>
            </header>

            <div className="space-y-4">
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-surface-container-high py-4 rounded-2xl font-bold text-on-surface hover:bg-surface-container-low transition-all active:scale-95 shadow-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-surface-container-high"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-on-surface-variant/40">
                  <span className="bg-surface-container-lowest px-4">Hoặc đăng nhập với Email</span>
                </div>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Email công việc</label>
                  <div className="relative group">
                    <Mail className="w-5 h-5 absolute left-4 top-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                    <input 
                      className="block w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-on-surface-variant/40 transition-all outline-none" 
                      placeholder="name@company.com" 
                      type="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="block text-sm font-semibold text-on-surface-variant">Mật khẩu</label>
                    <button type="button" className="text-sm font-bold text-primary hover:underline transition-all">Quên mật khẩu?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="w-5 h-5 absolute left-4 top-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                    <input 
                      className="block w-full pl-12 pr-12 py-4 bg-surface-container-highest border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-on-surface-variant/40 transition-all outline-none" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-on-surface-variant/40 hover:text-on-surface transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-bold py-4 rounded-2xl shadow-[0px_8px_24px_rgba(20,86,193,0.2)] active:scale-95 transition-all duration-200 text-lg">
                  Đăng nhập
                </button>
              </form>
            </div>

            <div className="mt-12 text-center">
              <p className="text-on-surface-variant font-medium">
                Chưa có tài khoản? 
                <button className="text-primary font-bold hover:underline ml-1">Liên hệ quản trị viên</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
