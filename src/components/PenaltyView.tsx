import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Save,
  Info
} from 'lucide-react';
import { subscribeToSettings, updateSetting } from '../services/firebaseService';

export default function PenaltyView() {
  const [penalties, setPenalties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToSettings((data) => {
      const penaltySettings = data.filter(s => s.key.startsWith('penalty_'));
      if (penaltySettings.length === 0) {
        // Default penalties if none in DB
        setPenalties([
          { id: 'penalty_late_15', title: 'Đi muộn (Dưới 15p)', penalty: '50.000 VND', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { id: 'penalty_late_30', title: 'Đi muộn (15p - 30p)', penalty: '100.000 VND', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
          { id: 'penalty_late_over', title: 'Đi muộn (Trên 30p)', penalty: '1/2 Công', icon: AlertCircle, color: 'text-error', bg: 'bg-error-container/20' },
          { id: 'penalty_early_leave', title: 'Về sớm không lý do', penalty: '100.000 VND', icon: Gavel, color: 'text-primary', bg: 'bg-primary/5' },
        ]);
      } else {
        setPenalties(penaltySettings.map(s => ({
          ...s,
          id: s.key,
          icon: s.key.includes('late') ? Clock : Gavel,
          color: s.key.includes('over') ? 'text-error' : s.key.includes('30') ? 'text-orange-500' : 'text-amber-500',
          bg: s.key.includes('over') ? 'bg-error-container/20' : s.key.includes('30') ? 'bg-orange-50' : 'bg-amber-50'
        })));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (id: string, value: string) => {
    await updateSetting(id, value);
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Cấu hình xử phạt</h1>
          <p className="text-on-surface-variant">Thiết lập các mức phạt cho vi phạm chuyên cần</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 rounded-xl font-bold bg-surface-container-highest text-on-surface hover:bg-surface-container-high transition-all">
            Hủy bỏ
          </button>
          <button className="px-6 py-3 rounded-xl font-bold bg-primary text-white flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all">
            <Save className="w-5 h-5" />
            Lưu thay đổi
          </button>
        </div>
      </header>

      <div className="bg-amber-50 border border-amber-200/50 p-6 rounded-3xl flex gap-4 items-start">
        <div className="p-2 bg-amber-200/50 rounded-xl text-amber-700">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 mb-1">Lưu ý quan trọng</h4>
          <p className="text-amber-800/80 text-sm leading-relaxed">
            Các thay đổi về mức phạt sẽ được áp dụng từ chu kỳ lương tiếp theo. Vui lòng thông báo cho nhân viên trước khi thực hiện thay đổi chính sách.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {penalties.map((item) => (
            <div key={item.id} className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(20,86,193,0.04)] group hover:shadow-xl transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Mức phạt hiện tại</p>
                  <p className={`text-2xl font-black ${item.color}`}>{item.value || item.penalty}</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-6">{item.title}</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider ml-1">Điều chỉnh mức phạt</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      defaultValue={item.value || item.penalty}
                      onBlur={(e) => handleSave(item.id, e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                  Xem chi tiết lịch sử
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
