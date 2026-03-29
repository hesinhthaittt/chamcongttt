import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Hourglass, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ChevronDown, 
  Inbox
} from 'lucide-react';
import { subscribeToRequests, createRequest } from '../services/firebaseService';
import { User } from 'firebase/auth';

export default function RequestsView({ user, profile }: { user: User | null, profile: any }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: 'Nghỉ phép năm',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    if (user && profile) {
      const unsubscribe = subscribeToRequests(
        (data) => {
          setRequests(data);
          setLoading(false);
        }, 
        user.uid, 
        profile.role === 'admin'
      );
      return () => unsubscribe();
    }
  }, [user, profile]);

  const handleCreateRequest = async () => {
    if (!user || !profile) return;
    await createRequest({
      userId: user.uid,
      userName: profile.displayName,
      type: newRequest.type,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      reason: newRequest.reason,
      status: 'pending'
    });
    setShowModal(false);
  };

  const stats = [
    { label: 'CHỜ DUYỆT', value: requests.filter(r => r.status === 'pending').length.toString(), icon: Hourglass, color: 'border-amber-400', iconColor: 'text-amber-500' },
    { label: 'ĐÃ DUYỆT', value: requests.filter(r => r.status === 'approved').length.toString(), icon: CheckCircle2, color: 'border-secondary', iconColor: 'text-secondary' },
    { label: 'TỪ CHỐI', value: requests.filter(r => r.status === 'rejected').length.toString(), icon: XCircle, color: 'border-error', iconColor: 'text-error' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Đơn từ & Giải trình</h1>
          <p className="text-on-surface-variant">Quản lý đơn nghỉ phép và giải trình nhân viên</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/10"
        >
          <Plus className="w-5 h-5" />
          Tạo đơn mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(20,86,193,0.04)] border-l-4 ${stat.color}`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div className="text-4xl font-extrabold font-display">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface-container-low rounded-3xl p-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
          {['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Từ chối'].map((tab, i) => (
            <button 
              key={tab}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                i === 0 ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Tháng', value: 'Tháng 05' },
            { label: 'Năm', value: '2024' },
            { label: 'Loại đơn', value: 'Tất cả loại đơn' },
          ].map((filter) => (
            <div key={filter.label} className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider ml-1">{filter.label}</label>
              <div className="relative">
                <div className="w-full bg-surface-container-highest rounded-xl py-3 pl-4 pr-10 text-sm font-medium flex items-center justify-between cursor-pointer">
                  {filter.value}
                  <ChevronDown className="w-4 h-4 text-on-surface-variant/40" />
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider ml-1">Nhân viên</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-highest border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 outline-none" 
                placeholder="Tìm tên nhân viên..." 
                type="text"
              />
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-on-surface-variant/40" />
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      {requests.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="p-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Nhân viên</th>
                <th className="p-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Loại đơn</th>
                <th className="p-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Thời gian</th>
                <th className="p-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t border-surface-container-low hover:bg-surface-container-lowest transition-colors">
                  <td className="p-6 font-bold">{req.userName}</td>
                  <td className="p-6 text-on-surface-variant">{req.type}</td>
                  <td className="p-6 text-on-surface-variant text-sm">
                    {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      req.status === 'approved' ? 'bg-secondary/10 text-secondary' :
                      req.status === 'rejected' ? 'bg-error/10 text-error' :
                      'bg-amber-400/10 text-amber-600'
                    }`}>
                      {req.status === 'approved' ? 'Đã duyệt' : req.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-surface-container-lowest rounded-[2rem] shadow-[0px_24px_48px_rgba(20,86,193,0.02)]">
          <div className="relative mb-8">
            <div className="w-48 h-48 rounded-full bg-primary/5 flex items-center justify-center">
              <Inbox className="w-24 h-24 text-primary/20" strokeWidth={1} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-xl">
              <Search className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mb-2">Chưa có đơn nào</h3>
          <p className="text-on-surface-variant text-center max-w-xs mb-8">Hệ thống không tìm thấy đơn từ nào phù hợp với bộ lọc hiện tại của bạn.</p>
          <button className="text-primary font-bold flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">
            Xoá tất cả bộ lọc
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black mb-6">Tạo đơn mới</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Loại đơn</label>
                <select 
                  className="w-full bg-surface-container-low rounded-xl py-3 px-4 font-bold outline-none border-none"
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                >
                  <option>Nghỉ phép năm</option>
                  <option>Nghỉ ốm</option>
                  <option>Giải trình đi muộn</option>
                  <option>Giải trình về sớm</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Từ ngày</label>
                  <input 
                    type="date" 
                    className="w-full bg-surface-container-low rounded-xl py-3 px-4 font-bold outline-none border-none"
                    onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Đến ngày</label>
                  <input 
                    type="date" 
                    className="w-full bg-surface-container-low rounded-xl py-3 px-4 font-bold outline-none border-none"
                    onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Lý do</label>
                <textarea 
                  className="w-full bg-surface-container-low rounded-xl py-3 px-4 font-bold outline-none border-none h-24 resize-none"
                  placeholder="Nhập lý do chi tiết..."
                  onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 rounded-2xl font-bold bg-surface-container-highest text-on-surface hover:bg-surface-container-high transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleCreateRequest}
                className="flex-1 py-4 rounded-2xl font-bold bg-primary text-white shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Gửi đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
