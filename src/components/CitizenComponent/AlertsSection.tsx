import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AlertsRealtimeFeed from './AlertsRealtimeFeed';
import PreventiveStepsCard from './PreventiveStepsCard';
import NotificationPreferencesCard from './NotificationPreferencesCard';
import AlertsArchiveCard from './AlertsArchiveCard';
import NearbyOutbreaksCard from './NearbyOutbreaksCard';
import DailyWeatherCard from './DailyWeatherCard';
import { AlertTriangle } from 'lucide-react';

export default function AlertsSection() {
  return (
    <section className="space-y-4">
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-error" />
            Health Alerts & Warnings
          </CardTitle>
        </CardHeader>
        <CardContent className="body-medium text-text-secondary">
          Real-time outbreak alerts, water contamination warnings, seasonal advisories, and preferences.
        </CardContent>
      </Card>

      <DailyWeatherCard />
      <AlertsRealtimeFeed />
      <NearbyOutbreaksCard />
      <PreventiveStepsCard />
      <NotificationPreferencesCard />
      <AlertsArchiveCard />
    </section>
  );
}
