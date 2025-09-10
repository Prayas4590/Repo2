import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Settings,
  User,
  Bell,
  Shield,
  Moon,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';

const SettingsPage = () => {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Edit Profile', icon: User, action: true },
        { id: 'notifications', label: 'Notifications', icon: Bell, toggle: true, value: true },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield, action: true },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { id: 'dark-mode', label: 'Dark Mode', icon: Moon, toggle: true, value: false },
        { id: 'language', label: 'Language', icon: Globe, action: true, value: 'English' },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help & Support', icon: HelpCircle, action: true },
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="headline-medium text-text-primary mb-2">Settings</h1>
        <p className="body-medium text-text-secondary">
          Manage your account and preferences
        </p>
      </div>

      {/* User Profile Card */}
      <Card className="material-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="title-medium text-text-primary">{user?.name}</h2>
              <p className="body-medium text-text-secondary">{user?.email}</p>
              <p className="body-small text-text-disabled">{user?.phone}</p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Settings Groups */}
      {settingsGroups.map((group) => (
        <Card key={group.title} className="material-card">
          <CardHeader className="pb-3">
            <CardTitle className="title-small text-text-primary">{group.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-text-secondary" />
                    <div>
                      <p className="label-medium text-text-primary">{item.label}</p>
                      {item.value && typeof item.value === 'string' && (
                        <p className="body-small text-text-secondary">{item.value}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.toggle ? (
                      <Switch checked={item.value as boolean} />
                    ) : item.action ? (
                      <ChevronRight className="h-5 w-5 text-text-secondary" />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {/* App Information */}
      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-small text-text-primary">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Settings className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="title-medium text-text-primary mb-1">HealthHub</h3>
            <p className="body-small text-text-secondary mb-1">Version 1.0.0</p>
            <p className="body-small text-text-disabled">
              Smart Community Health Monitoring System
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card className="material-card">
        <CardContent className="p-4">
          <Button
            variant="outline"
            onClick={logout}
            className="w-full text-error border-error hover:bg-error/5 ripple"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Safe area for bottom navigation */}
      <div className="h-4"></div>
    </div>
  );
};

export default SettingsPage;
