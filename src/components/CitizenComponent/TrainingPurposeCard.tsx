import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrainingPurposeCard() {
  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Purpose</CardTitle>
      </CardHeader>
      <CardContent className="body-medium text-text-secondary leading-relaxed">
        Help citizens understand hygiene, disease prevention, and safe water practices.
      </CardContent>
    </Card>
  );
}
