import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { getUserProfile, createUserProfile } from './services/firebaseService';
import Layout, { View } from './components/Layout';
import RequestsView from './components/RequestsView';
import TimeView from './components/TimeView';
import PayrollView from './components/PayrollView';
import SettingsView from './components/SettingsView';
import PersonnelView from './components/PersonnelView';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
import PenaltyView from './components/PenaltyView';
import EventsView from './components/EventsView';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('requests');
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          // Create profile if it doesn't exist
          await createUserProfile(
            firebaseUser.uid, 
            firebaseUser.email || '', 
            firebaseUser.displayName || '', 
            firebaseUser.photoURL || ''
          );
          profile = await getUserProfile(firebaseUser.uid);
        }
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-surface">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!user) {
      return <LoginView />;
    }

    switch (currentView) {
      case 'dashboard':
      case 'requests':
        return <RequestsView user={user} profile={userProfile} />;
      case 'time':
        return <TimeView />;
      case 'payroll':
        return <PayrollView />;
      case 'settings':
        return <SettingsView onViewChange={setCurrentView} />;
      case 'personnel':
        return <PersonnelView />;
      case 'profile':
        return <ProfileView user={user} userProfile={userProfile} />;
      case 'penalty':
        return <PenaltyView />;
      case 'events':
        return <EventsView />;
      default:
        return <RequestsView user={user} profile={userProfile} />;
    }
  };

  if (!user && !loading) {
    return <LoginView />;
  }

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView}
      user={{
        name: userProfile?.displayName || user?.displayName || 'Người dùng',
        email: user?.email || '',
        avatar: user?.photoURL || 'https://picsum.photos/seed/user/100/100',
        role: userProfile?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'
      }}
    >
      {renderView()}
    </Layout>
  );
}
