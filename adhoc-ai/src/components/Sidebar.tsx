import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Bot, BookOpen, FileText, Briefcase, Settings, LogOut, 
  Users, Kanban, CreditCard, Layers, Activity, FileCheck, 
  Calendar, X, Sparkles
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export default function Sidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isMobileSidebarOpen, closeMobileSidebar } = useUIStore();

  const activeView = searchParams.get('view') || 'home';

  if (!user) return null;

  // Define navigation items based on user role
  const getNavItems = () => {
    switch (user.role) {
      case 'student':
        return [
          { view: 'home', label: 'Dashboard', icon: <Home size={20} /> },
          { view: 'havoc', label: 'AI Havoc', icon: <Bot size={20} />, highlight: true },
          { view: 'courses', label: 'Courses & Academics', icon: <BookOpen size={20} /> },
          { view: 'documents', label: 'Documents', icon: <FileText size={20} /> },
          { view: 'placements', label: 'Placements', icon: <Briefcase size={20} /> },
        ];
      case 'admin':
        return [
          { view: 'home', label: 'System Overview', icon: <Layers size={20} /> },
          { view: 'prompts', label: 'AI Prompt Settings', icon: <Sparkles size={20} />, highlight: true },
          { view: 'users', label: 'User Accounts', icon: <Users size={20} /> },
          { view: 'audits', label: 'System Audit Logs', icon: <Activity size={20} /> },
        ];
      case 'faculty':
        return [
          { view: 'home', label: 'Faculty Dashboard', icon: <Home size={20} /> },
          { view: 'attendance', label: 'Mark Attendance', icon: <FileCheck size={20} />, highlight: true },
          { view: 'marks', label: 'Marks Manager', icon: <BookOpen size={20} /> },
        ];
      case 'counsellor':
        return [
          { view: 'home', label: 'Dashboard', icon: <Home size={20} /> },
          { view: 'leads', label: 'Leads Pipeline', icon: <Kanban size={20} />, highlight: true },
          { view: 'chat-logs', label: 'Chat Assistant Log', icon: <Bot size={20} /> },
        ];
      case 'parent':
        return [
          { view: 'home', label: 'Guardianship Portal', icon: <Home size={20} /> },
          { view: 'grades', label: 'Student Grades', icon: <BookOpen size={20} /> },
          { view: 'fees', label: 'Fees & Invoices', icon: <CreditCard size={20} />, highlight: true },
        ];
      case 'placement':
        return [
          { view: 'home', label: 'Placement Dashboard', icon: <Home size={20} /> },
          { view: 'drives', label: 'Placement Drives', icon: <Calendar size={20} />, highlight: true },
          { view: 'resumes', label: 'ATS Resume Reviews', icon: <FileText size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (view: string) => {
    setSearchParams({ view });
    closeMobileSidebar();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMobileSidebar();
  };

  const sidebarContent = (
    <div className="w-[280px] bg-surface border-r border-white/5 h-full flex flex-col z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-primary to-orange-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(255,122,24,0.3)]">
            AD
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            ADhoc.ai
          </h1>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={closeMobileSidebar}
          className="lg:hidden p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] relative group ${
                isActive 
                  ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3 z-10">
                <span className={isActive ? 'text-accent-primary' : 'text-gray-400 group-hover:text-white transition-colors'}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              
              {item.highlight && !isActive && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Settings & Logout */}
      <div className="p-4 border-t border-white/5 space-y-2 shrink-0 bg-black/20">
        <button
          onClick={() => handleNavClick('settings')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
            activeView === 'settings' 
              ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
              : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
          }`}
        >
          <Settings size={20} />
          <span className="font-medium text-sm">Settings</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:scale-[1.02] border border-transparent"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>

      {/* Custom scrollbar styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 122, 24, 0.3);
        }
      `}</style>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside className="hidden lg:flex shrink-0 w-[280px] h-screen sticky top-0 flex-col bg-surface">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileSidebar}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Sidebar Slide Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 z-50 lg:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
