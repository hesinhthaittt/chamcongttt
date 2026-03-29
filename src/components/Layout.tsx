import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  FileText, 
  CreditCard, 
  Settings, 
  Bell,
  Plus,
  Users,
  Calendar,
  LogOut,
  Lock,
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  MoreHorizontal,
  Mail,
  ShieldCheck,
  MapPin,
  History,
  Gavel,
  Building2,
  UserCheck,
  QrCode,
  Key,
  HelpCircle,
  Camera,
  Download,
  CheckCircle2,
  Hourglass,
  XCircle,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type View = 'dashboard' | 'time' | 'requests' | 'payroll' | 'settings' | 'personnel' | 'profile' | 'login' | 'events' | 'penalty';

interface LayoutProps {
  children: ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
  user?: {
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
}

export default function Layout({ children, currentView, onViewChange, user }: LayoutProps) {
  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'time' as View, label: 'Time', icon: Clock },
    { id: 'requests' as View, label: 'Requests', icon: FileText },
    { id: 'payroll' as View, label: 'Payroll', icon: CreditCard },
    { id: 'settings' as View, label: 'Settings', icon: Settings },
  ];

  if (currentView === 'login') return <>{children}</>;

  return (
    <div className="min-h-screen pb-32">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 glass shadow-sm shadow-primary/5 h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high">
            <img 
              src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuA421eyCN_HlQ9yLupMHz2gYWOD1t-bZMVUwFI3E7TjKr5eACBWT59GPg5U3oBeV9AVBWrATalKVk8_TLbpcB1p2kh_wNDGbi7USAXOk14I_NT70KC4hvgzzAlAeL_iChFOJ5bsnqiQAwYWIhFQevDsiCK95Q93iB12E_k4PpT0DM2C_ytR28QtyRGljEN4XBWAjDVH-a2NydAewaRn4XyI4RjztjwBAB7gzGhmNM2jelmtnC4WISEQa29-5I12aVUm3lYO-BT6fPw"} 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-lg font-extrabold text-primary tracking-tighter font-display">Precision & Flow</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:scale-95">
          <Bell className="w-5 h-5 text-on-surface-variant" />
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4 md:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full glass z-50 rounded-t-3xl shadow-[0px_-12px_32px_rgba(20,86,193,0.08)] px-4 pb-6 pt-3 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl transition-all duration-300 ease-out active:scale-90 ${
                isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant/60 hover:text-primary'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1 font-sans">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
