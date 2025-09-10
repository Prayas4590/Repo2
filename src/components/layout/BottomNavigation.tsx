import { useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import MdIcon from '@/components/ui/md3-icon';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole } = useRole();

  type NavItem = { id: string; label: string; icon: string; path?: string; anchor?: string };

  const getNavigationItems = (): NavItem[] => {
    switch (currentRole) {
      case 'citizen':
        return [
          { id: 'training', label: 'Training', icon: 'menu_book', path: '/resources' },
          { id: 'symptoms', label: 'Symptoms', icon: 'description', path: '/reports?type=symptoms' },
          { id: 'water', label: 'Water', icon: 'water_drop', path: '/reports?type=water' },
          { id: 'chat', label: 'Chat', icon: 'chat', path: '/communication' },
          { id: 'alerts', label: 'Alerts', icon: 'warning', path: '/alerts' }
        ];
      case 'asha':
        return [
          { id: 'home', label: 'Home', icon: 'home', path: '/asha' },
          { id: 'testing', label: 'Testing', icon: 'science', path: '/testing' },
          { id: 'alerts', label: 'Alerts', icon: 'warning', path: '/alerts' },
          { id: 'education', label: 'Education', icon: 'menu_book', path: '/resources' },
          { id: 'inventory', label: 'Inventory', icon: 'inventory_2', path: '/inventory' }
        ];
      case 'coordinator':
        return [
          { id: 'alerts', label: 'Alerts', icon: 'warning', path: '/coordinator' },
          { id: 'patients', label: 'Patients', icon: 'group', path: '/patients' },
          { id: 'water', label: 'Water', icon: 'insights', path: '/coordinator/water' },
          { id: 'inventory', label: 'Inventory', icon: 'inventory_2', path: '/inventory' },
          { id: 'hub', label: 'Hub', icon: 'chat', path: '/communication' }
        ];
      case 'doctor':
        return [
          { id: 'reports', label: 'Reports', icon: 'description', anchor: 'reports' },
          { id: 'alerts', label: 'Alerts', icon: 'warning', path: '/doctor/alerts' },
          { id: 'communication', label: 'Communication', icon: 'chat', path: '/doctor/communication' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const isActive = (item: NavItem) => {
    const pathname = location.pathname;
    const search = location.search;
    if (item.id === 'symptoms' && pathname === '/reports') {
      const params = new URLSearchParams(search);
      return params.get('type') !== 'water';
    }
    if (item.id === 'water' && pathname === '/reports') {
      const params = new URLSearchParams(search);
      return params.get('type') === 'water';
    }
    if (item.anchor) {
      return location.hash === `#${item.anchor}` && pathname === '/doctor';
    }
    const itemPath = (item.path || '').split('?')[0];
    return pathname === itemPath;
  };

  const handleClick = (item: NavItem) => {
    if (item.anchor) {
      if (location.pathname !== '/doctor') {
        navigate(`/doctor#${item.anchor}`);
        return;
      }
      const el = document.getElementById(item.anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      try { window.history.replaceState(null, '', `#${item.anchor}`); } catch {}
      return;
    }
    if (item.path) navigate(item.path);
  };

  return (
    <nav className="bottom-nav">
      <div className="h-full flex items-center justify-around px-2">
        {navigationItems.map((item) => {
          const active = isActive(item);

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => handleClick(item)}
              className={`nav-item ripple ${active ? 'active' : ''}`}
            >
              <div className={`flex flex-col items-center px-3 py-1 rounded-full ${active ? 'bg-primary/10' : ''}`}>
                <MdIcon name={item.icon as string} size={20} className={`${active ? 'text-primary' : 'text-text-secondary'}`} />
                <span className={`text-xs mt-1 font-medium ${active ? 'text-primary' : 'text-text-secondary'}`}>
                  {item.label}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
