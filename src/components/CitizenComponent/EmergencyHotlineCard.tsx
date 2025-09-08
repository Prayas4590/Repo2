import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function EmergencyHotlineCard() {
  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Emergency Hotline
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <Button asChild className="material-button bg-error text-error-foreground hover:bg-error/90 ripple">
          <a href="tel:108" aria-label="Call 108">Call 108</a>
        </Button>
        <Button asChild variant="outline" className="ripple">
          <a href="tel:112" aria-label="Call 112">Call 112</a>
        </Button>
      </CardContent>
    </Card>
  );
}
