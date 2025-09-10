import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import HCAlertsNav, { AlertItem } from '@/components/healthcoordinatorcomponents/HCAlertsNav';

const Alerts = () => {
  const alerts: AlertItem[] = [
    {
      id: 1,
      title: 'Contaminated water reported',
      area: 'Block B',
      severity: 'high',
      time: '1 hour ago',
      status: 'open',
      category: 'water'
    },
    {
      id: 2,
      title: 'Spike in fever cases',
      area: 'Block A',
      severity: 'medium',
      time: '3 hours ago',
      status: 'investigating',
      category: 'outbreak'
    },
    {
      id: 3,
      title: 'Request: urgent medical assistance',
      area: 'Village Center',
      severity: 'high',
      time: '30 minutes ago',
      status: 'open',
      category: 'emergency'
    },
    {
      id: 4,
      title: 'Inventory low - Paracetamol',
      area: 'Central Store',
      severity: 'low',
      time: '6 hours ago',
      status: 'acknowledged',
      category: 'supply'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="headline-medium text-text-primary mb-1">Health Coordinator Alerts</h1>
          <p className="body-medium text-text-secondary">Recent alerts and incidents requiring coordination</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/coordinator/dashboard">
            <Button variant="ghost" size="sm">Open Dashboard</Button>
          </Link>
          <Link to="/alerts">
            <Button size="sm">All Alerts</Button>
          </Link>
        </div>
      </div>

      <HCAlertsNav alerts={alerts} />

      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
          Notify Team
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
          Assign
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
          Supply Request
        </Button>
      </div>

      <Button className="fab bg-coordinator text-white hover:bg-coordinator/90">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Alerts;
