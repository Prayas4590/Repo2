import { useEffect, useMemo, useState } from 'react';

export interface Module {
  id: string;
  title: string;
  description: string;
}

export const TRAINING_MODULES: Module[] = [
  { id: 'wb-diseases', title: 'Understanding Waterborne Diseases', description: 'Causes, symptoms, and prevention of common waterborne illnesses.' },
  { id: 'safe-storage', title: 'Safe Water Storage', description: 'Best practices for storing drinking water safely at home.' },
  { id: 'filtration', title: 'Filtration & Treatment', description: 'Low-cost methods for filtering and treating water.' },
  { id: 'hygiene', title: 'Hand & Community Hygiene', description: 'Hygiene practices to reduce disease transmission.' },
  { id: 'early-signs', title: 'Recognizing Early Outbreak Signs', description: 'Identify symptoms that indicate potential outbreaks.' },
];

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'od', label: 'Odia' },
] as const;

export type LangCode = typeof LANGUAGES[number]['code'];

export const t = (key: string, lang: string) => {
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

export function useTrainingProgress(modules: Module[]) {
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

export function downloadBlob(filename: string, content: string, mime = 'text/plain') {
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

export function openPrintable(html: string, title = 'Print') {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${title}</title><style>body{font-family:Arial;margin:24px} .cert{border:3px solid #0a7; padding:24px; border-radius:12px} h1{margin:0 0 8px} h2{margin:8px 0} .muted{color:#555}</style></head><body>${html}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 250);
}
