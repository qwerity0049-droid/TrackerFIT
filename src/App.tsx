import React, { useState, useEffect } from 'react';
import { Activity, LayoutDashboard, History, User, PlusCircle, Sprout } from 'lucide-react';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import WorkoutHistory from './components/WorkoutHistory';
import Profile from './components/Profile';
import Growth from './components/Growth';
import { Workout, UserProfile, Habit, Goal } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'history' | 'growth' | 'profile'>('dashboard');
  
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('workouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : { name: 'Спортсмен', goal: 'Стать сильнее и выносливее', weeklyGoalMinutes: 150 };
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('workouts', JSON.stringify(workouts)); }, [workouts]);
  useEffect(() => { localStorage.setItem('profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('goals', JSON.stringify(goals)); }, [goals]);

  const addWorkout = (workout: Workout, redirect: boolean = true) => {
    setWorkouts([workout, ...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    if (redirect) setActiveTab('dashboard');
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col md:flex-row">
      {/* Sidebar / Bottom Nav */}
      <nav className="bg-white border-t md:border-t-0 md:border-r border-gray-200 md:w-64 flex-shrink-0 fixed md:relative bottom-0 w-full md:h-screen z-50">
        <div className="p-4 hidden md:flex items-center space-x-2 border-b border-gray-100">
          <Activity className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-800">FitTrack</span>
        </div>
        <div className="flex md:flex-col justify-between md:justify-start p-2 md:p-4 space-x-1 md:space-x-0 md:space-y-2 overflow-x-auto no-scrollbar">
          <NavItem icon={<LayoutDashboard />} label="Дашборд" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<PlusCircle />} label="Запись" active={activeTab === 'log'} onClick={() => setActiveTab('log')} />
          <NavItem icon={<History />} label="История" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <NavItem icon={<Sprout />} label="Развитие" active={activeTab === 'growth'} onClick={() => setActiveTab('growth')} />
          <NavItem icon={<User />} label="Профиль" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard workouts={workouts} profile={profile} />}
          {activeTab === 'log' && <WorkoutLogger onSave={addWorkout} onGoToGrowth={() => setActiveTab('growth')} />}
          {activeTab === 'history' && <WorkoutHistory workouts={workouts} onDelete={deleteWorkout} />}
          {activeTab === 'growth' && <Growth habits={habits} setHabits={setHabits} goals={goals} setGoals={setGoals} />}
          {activeTab === 'profile' && <Profile profile={profile} workouts={workouts} onSave={setProfile} />}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center md:justify-start md:space-x-3 p-2 md:p-3 rounded-xl transition-colors min-w-[64px] md:min-w-0 ${
        active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className={`${active ? 'text-indigo-600' : 'text-gray-400'} mb-1 md:mb-0`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6 md:w-5 md:h-5' })}
      </div>
      <span className={`text-[10px] md:text-sm font-medium truncate ${active ? 'text-indigo-700' : ''}`}>{label}</span>
    </button>
  );
}

export default App;
