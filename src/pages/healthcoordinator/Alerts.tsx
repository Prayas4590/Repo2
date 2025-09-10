import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import HCAlertsNav, { AlertItem } from '@/components/healthcoordinatorcomponents/HCAlertsNav';

const Alerts = () => {
  const alerts: AlertItem[] = [
    // Water contamination examples
    {
      id: 1,
      title: 'E. coli detected in well',
      area: 'Block B - Community Well',
      severity: 'high',
      time: '1 hour ago',
      status: 'open',
      category: 'water',
      contaminant: 'E. coli',
      source: 'Community well'
    },
    {
      id: 2,
      title: 'High turbidity - river intake',
      area: 'Block C - River Intake',
      severity: 'medium',
      time: '2 hours ago',
      status: 'investigating',
      category: 'water',
      contaminant: 'Suspended solids',
      source: 'River intake'
    },

    // Outbreak examples
    {
      id: 3,
      title: 'Spike in fever cases',
      area: 'Block A - Market Area',
      severity: 'high',
      time: '3 hours ago',
      status: 'investigating',
      category: 'outbreak',
      cases: 27,
      symptoms: 'Fever, vomiting, diarrhea'
    },
    {
      id: 4,
      title: 'Cluster of stomach illness',
      area: 'Block D - School',
      severity: 'medium',
      time: '5 hours ago',
      status: 'open',
      category: 'outbreak',
      cases: 12,
      symptoms: 'Stomach pain, nausea'
    },

    // Emergency examples
    {
      id: 5,
      title: 'Request: urgent medical assistance',
      area: 'Village Center',
      severity: 'high',
      time: '30 minutes ago',
      status: 'open',
      category: 'emergency',
      assistanceType: 'Ambulance required'
    },
    {
      id: 6,
      title: 'Inspection needed - suspected poisoning',
      area: 'Block F',
      severity: 'high',
      time: '45 minutes ago',
      status: 'open',
      category: 'emergency',
      assistanceType: 'Hazmat team'
    },

    // Supply shortage examples
    {
      id: 7,
      title: 'Paracetamol stock low',
      area: 'Central Store',
      severity: 'low',
      time: '6 hours ago',
      status: 'acknowledged',
      category: 'supply',
      remaining: 14
    },
    {
      id: 8,
      title: 'Rapid test kits depleted',
      area: 'Block E - Clinic',
      severity: 'medium',
      time: '8 hours ago',
      status: 'open',
      category: 'supply',
      remaining: 0
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="py-4">
        <h1 className="headline-medium text-text-primary mb-1">Health Coordinator Alerts</h1>
        <p className="body-medium text-text-secondary">Recent alerts and incidents requiring coordination</p>
      </div>

      <HCAlertsNav alerts={alerts} />

      <div className="h-12" />
    </div>
  );
};

export default Alerts;
