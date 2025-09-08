import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertsSection } from '@/components/CitizenComponent';

const AlertsPage = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="headline-medium text-text-primary mb-2">Health Alerts</h1>
        <p className="body-medium text-text-secondary">Stay updated with important health information</p>
      </div>
      <AlertsSection />
    </div>
  );
};

export default AlertsPage;
