import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Video } from 'lucide-react';

export type WaterMediaFile = { name: string; size: number; type: string };

type Props = {
  files: WaterMediaFile[];
  onChange: (files: WaterMediaFile[]) => void;
};

export default function WaterMediaUpload({ files, onChange }: Props) {
  const imageInput = useRef<HTMLInputElement | null>(null);
  const videoInput = useRef<HTMLInputElement | null>(null);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []).map(f => ({ name: f.name, size: f.size, type: f.type }));
    onChange([...(files || []), ...list]);
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Water Source Photos / Videos (Optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" className="h-14 ripple" onClick={() => imageInput.current?.click()}>
            <Camera className="h-6 w-6 mr-2" /> Add Photos
          </Button>
          <Button type="button" variant="outline" className="h-14 ripple" onClick={() => videoInput.current?.click()}>
            <Video className="h-6 w-6 mr-2" /> Add Videos
          </Button>
        </div>
        <input ref={imageInput} type="file" accept="image/*" multiple className="hidden" onChange={handlePick} />
        <input ref={videoInput} type="file" accept="video/*" multiple className="hidden" onChange={handlePick} />
        {files?.length > 0 && (
          <ul className="space-y-1">
            {files.map((f, i) => (
              <li key={i} className="body-small text-text-secondary truncate">• {f.name}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
