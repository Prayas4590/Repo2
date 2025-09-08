import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Droplets } from 'lucide-react';

export type VillageRisk = { village: string; risk: 'low'|'moderate'|'high'; reason: string; lastUpdate: string };

const riskColor = (r: VillageRisk['risk']) => r === 'high' ? 'bg-error text-error-foreground' : r === 'moderate' ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground';

export default function NearbyOutbreaksCard() {
  const data: VillageRisk[] = [
    { village: 'Shivpuri', risk: 'high', reason: 'Brahmaputra contamination reported upstream; water sources affected', lastUpdate: '1h ago' },
    { village: 'Rampur', risk: 'moderate', reason: 'Downstream of contaminated canal; boil-water advisory in place', lastUpdate: '2h ago' },
    { village: 'Lakshmi Nagar', risk: 'low', reason: 'No contamination reported; routine hygiene advisory', lastUpdate: '1d ago' },
  ];

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Nearby Villages Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map((d) => (
          <div key={d.village} className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="label-medium text-text-primary truncate">{d.village}</p>
                <p className="body-small text-text-disabled">Updated {d.lastUpdate}</p>
              </div>
              <Badge className={riskColor(d.risk)}>{d.risk} risk</Badge>
            </div>
            <p className="body-small text-text-secondary mt-1 flex items-center gap-1">
              <Droplets className="h-4 w-4 text-coordinator" /> {d.reason}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
