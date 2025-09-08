import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const languages = ['English', 'Hindi', 'Haryanvi', 'Bengali'];

export default function TrainingLanguageAudio() {
  const [lang, setLang] = useState('English');
  const { toast } = useToast();

  const playAudio = () => {
    toast({ title: 'Audio Guide', description: `Playing ${lang} audio guide...` });
  };
  const downloadAudio = () => {
    toast({ title: 'Download Started', description: `${lang} audio is downloading...` });
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Languages & Audio Support</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {languages.map((l) => (
            <Button
              key={l}
              variant={lang === l ? 'default' : 'outline'}
              size="sm"
              className="rounded-full whitespace-nowrap ripple"
              onClick={() => setLang(l)}
            >
              {l}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button className="ripple" onClick={playAudio}>
            <Headphones className="h-4 w-4 mr-2" /> Play Audio Guide
          </Button>
          <Button variant="outline" className="ripple" onClick={downloadAudio}>Download Audio</Button>
        </div>
        <p className="body-small text-text-secondary">
          Content available in selected language. Audio format supports low-literacy users.
        </p>
      </CardContent>
    </Card>
  );
}
