import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export type WaterLocationData = {
  village: string;
  area: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
};

type Props = {
  value: WaterLocationData;
  onChange: (value: WaterLocationData) => void;
};

export default function WaterLocationInput({ value, onChange }: Props) {
  const [locating, setLocating] = useState(false);

  const useGPS = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ ...value, latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Location</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="label-medium text-text-primary">GPS Tag</p>
            <p className="body-small text-text-secondary">
              {value.latitude && value.longitude ? `${value.latitude.toFixed(5)}, ${value.longitude.toFixed(5)}` : 'No GPS tag added'}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" className="ripple" onClick={useGPS} disabled={locating}>
            <MapPin className="h-4 w-4 mr-2" /> {locating ? 'Locating…' : 'Use current location'}
          </Button>
        </div>
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
          <Input value={value.landmark || ''} onChange={(e) => onChange({ ...value, landmark: e.target.value })} placeholder="e.g., Community Tank" className="border-input" />
        </div>
      </CardContent>
    </Card>
  );
}
