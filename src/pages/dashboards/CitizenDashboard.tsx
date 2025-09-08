import { WelcomeSection, QuickActionsGrid, HealthStatusCard, RecentAlertsCard, FabReportButton, SymptomsSection, WaterSection, ChatSection } from '@/components/CitizenComponent';

const CitizenDashboard = () => {

  return (
    <div className="space-y-6 animate-fade-in">
      <WelcomeSection />
      <QuickActionsGrid />
      <SymptomsSection />
      <WaterSection />
      <ChatSection />
      <HealthStatusCard />
      <RecentAlertsCard />
      <FabReportButton />
    </div>
  );
};

export default CitizenDashboard;
