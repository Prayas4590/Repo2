import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type LocationData = {
  village: string;
  area: string;
  landmark?: string;
};

type Props = {
  value: LocationData;
  onChange: (value: LocationData) => void;
};

export default function SymptomsLocationInput({ value, onChange }: Props) {
  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Location</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="space-y-1">
          <Label className="label-medium text-text-primary">Village</Label>
          <Input value={value.village} onChange={(e) => onChange({ ...value, village: e.target.value })} placeholder="Enter village name" className="border-input" />
        </div>
        <div className="space-y-1">
          <Label className="label-medium text-text-primary">Area / Block</Label>
          <Input value={value.area} onChange={(e) => onChange({ ...value, area: e.target.value })} placeholder="Enter area or block" className="border-input" />
        </div>
        <div className="space-y-1">
          <Label className="label-medium text-text-primary">Nearby Landmark (optional)</Label>
          <Input value={value.landmark || ''} onChange={(e) => onChange({ ...value, landmark: e.target.value })} placeholder="e.g., Community Health Center" className="border-input" />
        </div>
      </CardContent>
    </Card>
  );
}
