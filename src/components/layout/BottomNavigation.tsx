import { useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import {
  Home,
  FileText,
  AlertTriangle,
  MessageCircle,
  BookOpen,
  Activity,
  Package,
  Users,
  Brain,
  TestTube,
  Droplets
} from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole } = useRole();

  const getNavigationItems = () => {
    switch (currentRole) {
      case 'citizen':
        return [
          { id: 'training', label: 'Training', icon: BookOpen, path: '/resources' },
          { id: 'symptoms', label: 'Symptoms', icon: FileText, path: '/reports?type=symptoms' },
          { id: 'water', label: 'Water', icon: Droplets, path: '/reports?type=water' },
          { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/communication' },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle, path: '/alerts' }
        ];
      case 'asha':
        return [
          { id: 'home', label: 'Home', icon: Home, path: '/asha' },
          { id: 'testing', label: 'Testing', icon: TestTube, path: '/testing' },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle, path: '/alerts' },
          { id: 'education', label: 'Education', icon: BookOpen, path: '/resources' },
          { id: 'inventory', label: 'Inventory', icon: Package, path: '/inventory' }
        ];
      case 'coordinator':
        return [
          { id: 'home', label: 'Dashboard', icon: Home, path: '/coordinator' },
          { id: 'patients', label: 'Patients', icon: Users, path: '/patients' },
          { id: 'water', label: 'Water', icon: Activity, path: '/alerts' },
          { id: 'inventory', label: 'Inventory', icon: Package, path: '/inventory' },
          { id: 'hub', label: 'Hub', icon: MessageCircle, path: '/communication' }
        ];
      case 'doctor':
        return [
          { id: 'home', label: 'Dashboard', icon: Home, path: '/doctor' },
          { id: 'patients', label: 'Patients', icon: Users, path: '/patients' },
          { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/communication' },
          { id: 'ai', label: 'AI Insights', icon: Brain, path: '/alerts' },
          { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const isActive = (item: { id: string; path: string }) => {
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
    const itemPath = item.path.split('?')[0];
    return pathname === itemPath;
  };

  return (
    <nav className="bottom-nav">
      <div className="h-full flex items-center justify-around px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`nav-item ripple ${active ? 'active' : ''}`}
            >
              <div className={`flex flex-col items-center px-3 py-1 rounded-full ${active ? 'bg-primary/10' : ''}`}>
                <Icon className={`h-5 w-5 ${active ? 'text-primary' : 'text-text-secondary'}`} />
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
