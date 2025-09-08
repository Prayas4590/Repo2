import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  Activity, 
  Heart,
  Check
} from 'lucide-react';

const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const { currentRole } = useRole();

  if (!user || !user.availableRoles || user.availableRoles.length <= 1) {
    return null;
  }

  const roleConfig = {
    citizen: {
      name: 'Citizen',
      description: 'Health monitoring & reporting',
      icon: Users,
      color: 'bg-citizen-light text-citizen'
    },
    asha: {
      name: 'ASHA Worker',
      description: 'Community health support',
      icon: Shield,
      color: 'bg-asha-light text-asha'
    },
    coordinator: {
      name: 'Health Coordinator',
      description: 'Facility management',
      icon: Activity,
      color: 'bg-coordinator-light text-coordinator'
    },
    doctor: {
      name: 'Doctor',
      description: 'Clinical care & diagnosis',
      icon: Heart,
      color: 'bg-doctor-light text-doctor'
    }
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-3">
        <CardTitle className="title-medium flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Switch Role
        </CardTitle>
        <p className="body-small text-text-secondary">
          You have access to multiple roles. Switch between them without logging out.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {user.availableRoles.map((role) => {
          const config = roleConfig[role];
          const Icon = config.icon;
          const isActive = currentRole === role;
          
          return (
            <div
              key={role}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:bg-muted/50 cursor-pointer'
              }`}
              onClick={() => !isActive && switchRole(role)}
            >
              <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center`}>
                <Icon className="h-6 w-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="label-medium text-text-primary">{config.name}</h3>
                  {isActive && (
                    <Badge className="bg-primary text-primary-foreground">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="body-small text-text-secondary">{config.description}</p>
              </div>

              {isActive && (
                <Check className="h-6 w-6 text-primary flex-shrink-0" />
              )}
            </div>
          );
        })}
        
        <div className="pt-3 border-t border-divider">
          <p className="body-small text-text-disabled text-center">
            Current role determines your dashboard and available features
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleSwitcher;