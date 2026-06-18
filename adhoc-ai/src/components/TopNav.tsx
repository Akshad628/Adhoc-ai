import { Search, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export default function TopNav() {
  const { user } = useAuthStore();
  const { toggleMobileSidebar } = useUIStore();

  if (!user) return null;

  // Derive initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Derive role title sub-description
  const getRoleDescription = () => {
    switch (user.role) {
      case 'student':
        return 'B.Tech CSE - 3rd Year';
      case 'admin':
        return 'System Administrator';
      case 'faculty':
        return 'Professor of CSE';
      case 'counsellor':
        return 'Senior Admissions Counsellor';
      case 'parent':
        return 'Guardian Portal';
      case 'placement':
        return 'Placement & Training Officer';
      default:
        return 'ADhoc Member';
    }
  };

  return (
    <header className="h-[72px] shrink-0 sticky top-0 z-30 bg-glass backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 md:px-8">
      {/* Mobile Hamburger & Logo Prefix */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 focus:outline-none"
        >
          <Menu size={22} />
        </button>

        {/* Brand visual (only visible on mobile layout) */}
        <div className="flex items-center space-x-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-primary to-orange-600 flex items-center justify-center font-bold text-white text-sm">
            AD
          </div>
          <span className="font-semibold text-lg bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            ADhoc.ai
          </span>
        </div>

        {/* Search Bar - hidden on very small screens, responsive width */}
        <div className="hidden sm:flex items-center bg-white/5 rounded-full px-4 py-2 w-64 md:w-96 border border-white/10 transition-colors focus-within:border-accent-primary/50">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, documents, or hit Ctrl+K..."
            className="bg-transparent border-none outline-none text-xs md:text-sm ml-2 w-full text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Right Controls (Notifications & User Profile) */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Search Icon for Mobile */}
        <button className="sm:hidden text-gray-400 hover:text-white p-2 hover:bg-white/5 hover:scale-[1.02] rounded-full transition-all duration-300">
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button className="text-gray-400 hover:text-white p-2 hover:bg-white/5 hover:scale-[1.02] rounded-full transition-all duration-300 relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent-primary rounded-full border border-background shadow-[0_0_10px_rgba(255,122,24,0.8)]"></span>
        </button>

        <div className="h-6 w-[1px] bg-white/10"></div>

        {/* Profile Card */}
        <div className="flex items-center space-x-3 cursor-pointer group transition-all duration-300 hover:scale-[1.02]">
          <div className="text-right hidden md:block select-none">
            <p className="text-sm font-semibold text-white group-hover:text-accent-primary transition-colors">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500">
              {getRoleDescription()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-orange-800 border border-white/10 flex items-center justify-center font-bold text-white shadow-md select-none">
            {getInitials(user.fullName)}
          </div>
        </div>
      </div>
    </header>
  );
}
