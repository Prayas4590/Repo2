import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import MdIcon from '@/components/ui/md3-icon';
import { useAuth } from '@/contexts/AuthContext';

interface Module {
  id: string;
  title: string;
  description: string;
}

const TRAINING_MODULES: Module[] = [
  { id: 'wb-diseases', title: 'Understanding Waterborne Diseases', description: 'Causes, symptoms, and prevention of common waterborne illnesses.' },
  { id: 'safe-storage', title: 'Safe Water Storage', description: 'Best practices for storing drinking water safely at home.' },
  { id: 'filtration', title: 'Filtration & Treatment', description: 'Low-cost methods for filtering and treating water.' },
  { id: 'hygiene', title: 'Hand & Community Hygiene', description: 'Hygiene practices to reduce disease transmission.' },
  { id: 'early-signs', title: 'Recognizing Early Outbreak Signs', description: 'Identify symptoms that indicate potential outbreaks.' },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'od', label: 'Odia' },
] as const;

type LangCode = typeof LANGUAGES[number]['code'];

const t = (key: string, lang: string) => {
  const map: Record<string, Record<string, string>> = {
    heading: { en: 'Training & Awareness Resources', hi: 'प्रशिक्षण और जागरूकता संसाधन', od: 'ପ୍ରଶିକ୍ଷଣ ଏବଂ ସଚେତନତା ସମଗ୍ରୀ' },
    playAudio: { en: 'Play Audio', hi: 'ऑडियो चलाएँ', od: 'ଶବ୍ଦ ପ୍ଳେ କରନ୍ତୁ' },
    stopAudio: { en: 'Stop Audio', hi: 'ऑडियो रोकें', od: 'ଶବ୍ଦ ବନ୍ଦ କରନ୍ତୁ' },
    videos: { en: 'Video Tutorials', hi: 'वीडियो ट्यूटोरियल', od: 'ଭିଡିଓ ପାଠ' },
    guides: { en: 'Step-by-step Guides', hi: 'चरण-दर-चरण मार्गदर्शिका', od: 'ପଦକ୍ଷେପ ଗାଇଡ୍' },
    campaigns: { en: 'Awareness Campaigns', hi: 'जागरूकता अभियान', od: 'ଜାଗରୁକତା ଅଭିଯାନ' },
    infographics: { en: 'Infographics', hi: 'इन्फोग्राफिक्स', od: 'ଇନ୍ଫୋଗ୍ରାଫିକ୍ସ' },
    posters: { en: 'Hygiene Posters', hi: 'स्वच्छता पोस्टर', od: 'ସ୍ୱାସ୍ଥ୍ୟ ପୋଷ୍ଟର' },
    downloads: { en: 'Downloadables', hi: 'डाउनलोड सामग्री', od: 'ଡାଉନଲୋଡ଼' },
    progress: { en: 'My Progress', hi: 'मेरी प्रगति', od: 'ମୋର ପ୍ରଗତି' },
  };
  return map[key]?.[lang] ?? map[key]?.en ?? key;
};

const STORAGE_KEY = 'asha_training_progress_v1';

type ProgressState = Record<string, boolean>;

function useTrainingProgress(modules: Module[]) {
  const [progress, setProgress] = useState<ProgressState>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProgress(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const completedCount = useMemo(
    () => modules.reduce((sum, m) => sum + (progress[m.id] ? 1 : 0), 0),
    [modules, progress]
  );

  const completionPercent = Math.round((completedCount / modules.length) * 100);

  const toggle = (id: string) => setProgress((p) => ({ ...p, [id]: !p[id] }));

  return { progress, completedCount, completionPercent, toggle };
}

function downloadBlob(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function openPrintable(html: string, title = 'Print') {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${title}</title><style>body{font-family:Arial;margin:24px} .cert{border:3px solid #0a7; padding:24px; border-radius:12px} h1{margin:0 0 8px} h2{margin:8px 0} .muted{color:#555}</style></head><body>${html}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 250);
}

function LanguageToolbar({ lang, setLang, speaking, onSpeak, onStop }: { lang: LangCode; setLang: (l: LangCode) => void; speaking: boolean; onSpeak: () => void; onStop: () => void; }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="headline-medium text-text-primary">{t('heading', lang)}</h1>
      <div className="flex items-center gap-2">
        <MdIcon name="language" size={20} className="text-text-secondary" />
        <select
          className="border rounded-md px-2 py-1 bg-background text-foreground"
          value={lang}
          onChange={(e) => setLang(e.target.value as LangCode)}
        >
          {LANGUAGES.map(l => (<option key={l.code} value={l.code}>{l.label}</option>))}
        </select>
        {!speaking ? (
          <Button variant="outline" size="sm" className="material-button ripple" onClick={onSpeak}>
            <MdIcon name="headphones" size={18} className="mr-2" /> {t('playAudio', lang)}
          </Button>
        ) : (
          <Button variant="destructive" size="sm" className="material-button ripple" onClick={onStop}>
            {t('stopAudio', lang)}
          </Button>
        )}
      </div>
    </div>
  );
}

function VideoTutorials() {
  const videos = [
    'https://www.youtube.com/embed/RmYw5X9bG0E',
    'https://www.youtube.com/embed/n-8h3B2CqGk',
  ];
  return (
    <Card className="material-card">
      <CardHeader>
        <CardTitle className="title-medium flex items-center gap-2">
          <MdIcon name="play_circle" size={20} className="text-info" /> Video Tutorials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {videos.map((src, i) => (
            <div key={i} className="aspect-video rounded-lg overflow-hidden">
              <iframe className="w-full h-full" src={src} title={`Tutorial ${i + 1}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FieldGuides() {
  return (
    <Card className="material-card">
      <CardHeader>
        <CardTitle className="title-medium">Step-by-step Guides</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="guide-1">
            <AccordionTrigger>Safe Water Storage</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal ml-6 space-y-1">
                <li>Use clean, covered containers.</li>
                <li>Keep containers away from sunlight and heat.</li>
                <li>Do not dip hands directly; use a ladle.</li>
                <li>Clean containers weekly with soap and safe disinfectant.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="guide-2">
            <AccordionTrigger>Boiling & Filtration</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal ml-6 space-y-1">
                <li>Boil water for at least 3 minutes.</li>
                <li>Use cloth or ceramic filters to remove particles.</li>
                <li>Add chlorine tablets if recommended.</li>
                <li>Store treated water separately.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="guide-3">
            <AccordionTrigger>Hand Hygiene</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal ml-6 space-y-1">
                <li>Wash hands for 20 seconds with soap.</li>
                <li>Before eating and after toilet use.</li>
                <li>Dry hands with a clean towel.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function CampaignsSection() {
  const campaigns = [
    { title: 'Village Sanitation Drive', desc: 'One-week cleanliness and safe water campaign.' },
    { title: 'Handwashing Awareness Week', desc: 'Demonstrations in schools and anganwadis.' },
    { title: 'Boil Water Advisory', desc: 'Outreach during monsoon and outbreak alerts.' },
    { title: 'Clean Storage Challenge', desc: 'Household visits checking water containers.' },
  ];
  return (
    <div className="grid gap-4">
      {campaigns.map((c, i) => (
        <Card key={i} className="material-card">
          <CardHeader>
            <CardTitle className="title-medium">{c.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="body-medium text-text-secondary mb-3">{c.desc}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="material-button ripple" onClick={() => downloadBlob(`${c.title.replace(/\s+/g, '_')}_plan.txt`, `${c.title}\n\n${c.desc}`)}>
                <MdIcon name="download" size={18} className="mr-2" /> Download Plan
              </Button>
              <Button variant="ghost" size="sm" className="material-button ripple" onClick={() => openPrintable(`<h1>${c.title}</h1><p>${c.desc}</p>`, 'Campaign Plan')}>
                <MdIcon name="print" size={18} className="mr-2" /> Print
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function InfographicsSection() {
  const svgPoster = (title: string, subtitle: string) => `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="800" height="1120"><rect width="100%" height="100%" fill="#E6F4EA"/><text x="50%" y="180" font-size="48" text-anchor="middle" fill="#0A7">${title}</text><text x="50%" y="260" font-size="28" text-anchor="middle" fill="#0A7">${subtitle}</text><circle cx="400" cy="560" r="160" fill="#0A7" opacity="0.1"/><text x="50%" y="560" font-size="36" text-anchor="middle" fill="#0A7">Wash Hands • Boil Water • Clean Storage</text></svg>`;
  const items = [
    { title: 'Early Signs of Outbreak', sub: 'Fever, diarrhea, vomiting, dehydration' },
    { title: 'Safe Water Tips', sub: 'Boil • Filter • Store Covered' },
  ];
  return (
    <div className="grid gap-4">
      {items.map((info, i) => {
        const svg = svgPoster(info.title, info.sub);
        const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        return (
          <Card key={i} className="material-card">
            <CardHeader>
              <CardTitle className="title-medium">{info.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={src} alt={info.title} className="w-full rounded-md border" />
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="material-button ripple" onClick={() => downloadBlob(`${info.title.replace(/\s+/g, '_')}.svg`, svg, 'image/svg+xml')}>
                  <MdIcon name="download" size={18} className="mr-2" /> Download
                </Button>
                <Button variant="ghost" size="sm" className="material-button ripple" onClick={() => openPrintable(`<img src='${src}' style='width:100%'/>`, 'Infographic')}>
                  <MdIcon name="print" size={18} className="mr-2" /> Print
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function PostersSection() {
  const posters = ['Handwashing Steps', 'Drink Safe Water', 'Clean Storage Containers'];
  return (
    <Card className="material-card">
      <CardHeader>
        <CardTitle className="title-medium">Hygiene Posters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {posters.map((p, i) => (
          <div key={i} className="flex items-center justify-between bg-muted/40 p-3 rounded-md">
            <div>
              <p className="label-large">{p}</p>
              <p className="body-small text-text-secondary">A4 printable poster</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="material-button ripple" onClick={() => downloadBlob(`${p.replace(/\s+/g, '_')}.txt`, `${p} poster content`)}>
                <MdIcon name="download" size={18} className="mr-2" /> Download
              </Button>
              <Button variant="ghost" size="sm" className="material-button ripple" onClick={() => openPrintable(`<h1>${p}</h1><p>Display in schools and centers.</p>`, p)}>
                <MdIcon name="print" size={18} className="mr-2" /> Print
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DownloadsSection() {
  const items = [
    { name: 'Field Checklist', content: 'Pre-visit checklist for ASHA workers.' },
    { name: 'Household Survey', content: 'Basic hygiene and water safety survey.' },
    { name: 'Session Attendance Sheet', content: 'Track participants for awareness sessions.' },
  ];
  return (
    <div className="grid gap-4">
      {items.map((d, i) => (
        <Card key={i} className="material-card">
          <CardHeader>
            <CardTitle className="title-medium">{d.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="body-medium text-text-secondary mb-3">{d.content}</p>
            <Button variant="outline" size="sm" className="material-button ripple" onClick={() => downloadBlob(`${d.name.replace(/\s+/g, '_')}.txt`, `${d.name}\n\n${d.content}`)}>
              <MdIcon name="download" size={18} className="mr-2" /> Download
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProgressSection({ modules, progress, completionPercent, toggle, onCertificate }: { modules: Module[]; progress: Record<string, boolean>; completionPercent: number; toggle: (id: string) => void; onCertificate: () => void; }) {
  return (
    <Card className="material-card">
      <CardHeader>
        <CardTitle className="title-medium flex items-center gap-2">
          <MdIcon name="check_circle" size={20} className="text-success" /> My Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="body-medium text-text-primary">Completion</span>
            <Badge>{completionPercent}%</Badge>
          </div>
          <Progress value={completionPercent} />
        </div>
        <div className="space-y-2">
          {modules.map(m => (
            <div key={m.id} className="flex items-center justify-between bg-muted/40 p-3 rounded-md">
              <div>
                <p className="label-large">{m.title}</p>
                <p className="body-small text-text-secondary">{m.description}</p>
              </div>
              <Button size="sm" variant={progress[m.id] ? 'secondary' : 'default'} className="material-button ripple" onClick={() => toggle(m.id)}>
                {progress[m.id] ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button className="material-button ripple" onClick={onCertificate}>
            <MdIcon name="print" size={18} className="mr-2" /> View Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TrainingAwarenessSection() {
  const { user } = useAuth();
  const [lang, setLang] = useState<LangCode>('en');
  const [speaking, setSpeaking] = useState(false);
  const { progress, completionPercent, toggle } = useTrainingProgress(TRAINING_MODULES);

  const speakSample = () => {
    const utter = new SpeechSynthesisUtterance(
      lang === 'hi'
        ? 'सुरक्षित पानी संग्रहण और हाथों की स्वच्छता बीमारी के प्रसार को कम करती है।'
        : lang === 'od'
        ? 'ନିରାପଦ ପାଣି ସଂରକ୍ଷଣ ଏବଂ ହାତ ସଫା ରଖିବାରେ ରୋଗ ପ୍ରସାର କମେ।'
        : 'Safe water storage and hand hygiene reduce disease transmission.'
    );
    utter.lang = lang === 'hi' ? 'hi-IN' : lang === 'od' ? 'or-IN' : 'en-US';
    utter.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const certificate = () => {
    const date = new Date().toLocaleDateString();
    const modulesList = TRAINING_MODULES.map(m => `<li>${m.title} - ${progress[m.id] ? 'Completed' : 'Pending'}</li>`).join('');
    openPrintable(
      `<div class=\"cert\">
        <h1>Training Completion Certificate</h1>
        <p class=\"muted\">Issued to</p>
        <h2>${user?.name ?? 'ASHA Worker'}</h2>
        <p class=\"muted\">on ${date}</p>
        <h3>Modules</h3>
        <ul>${modulesList}</ul>
        <p>Completion: ${completionPercent}%</p>
      </div>`,
      'Certificate'
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <LanguageToolbar lang={lang} setLang={setLang} speaking={speaking} onSpeak={speakSample} onStop={stopSpeaking} />

      <VideoTutorials />
      <FieldGuides />
      <CampaignsSection />
      <InfographicsSection />
      <PostersSection />
      <DownloadsSection />
      <ProgressSection modules={TRAINING_MODULES} progress={progress} completionPercent={completionPercent} toggle={toggle} onCertificate={certificate} />
    </div>
  );
}
