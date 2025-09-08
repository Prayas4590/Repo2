type WelcomeSectionProps = {
  title?: string;
  subtitle?: string;
};

export default function WelcomeSection({
  title = "Welcome, Citizen",
  subtitle = "Stay healthy and connected with your community",
}: WelcomeSectionProps) {
  return (
    <div className="text-center py-4">
      <h1 className="headline-medium text-text-primary mb-2">{title}</h1>
      <p className="body-medium text-text-secondary">{subtitle}</p>
    </div>
  );
}
