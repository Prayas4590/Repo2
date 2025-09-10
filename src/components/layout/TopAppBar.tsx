import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import MdIcon from '@/components/ui/md3-icon';
import logo from '@/assests/Logo.jpg';

const TopAppBar = () => {
  const { user, logout, switchRole } = useAuth();
  const { currentRole, getRolePath } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleTitle = () => {
    switch (currentRole) {
      case 'citizen': return 'Citizen Dashboard';
      case 'asha': return 'ASHA Dashboard';
      case 'coordinator': return 'Coordinator Dashboard';
      case 'doctor': return 'Doctor Dashboard';
      default: return 'JeevanDhara';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className={`app-bar`}>
      <div className="h-full flex items-center justify-between px-4">
        {/* Left: Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ripple rounded-full hover:bg-primary/10">
              <MdIcon name="menu" size={28} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 bg-card border border-border rounded-xl p-0 overflow-hidden">
            <div className="flex items-center gap-3 p-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="label-medium text-text-primary truncate">{user?.name}</p>
                <p className="body-small text-text-secondary truncate">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3 p-3 ripple">
              <MdIcon name="person" size={18} />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 p-3 ripple cursor-pointer"
            >
              <MdIcon name="settings" size={18} />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 p-3 ripple">
              <MdIcon name="help" size={18} />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-3 p-3 ripple text-error"
            >
              <MdIcon name="logout" size={18} />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Center: Title */}
        <div className="flex-1 text-center">
          <div className="inline-flex items-center gap-2 justify-center">
            <img src={logo} alt="JeevanDhara" className="h-7 w-7 rounded-full object-cover" />
            <h1 className="title-large text-text-primary truncate">{getRoleTitle()}</h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="ripple relative rounded-full hover:bg-primary/10">
            <MdIcon name="notifications" size={24} className="text-text-primary" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full text-[10px] flex items-center justify-center text-white">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopAppBar;
