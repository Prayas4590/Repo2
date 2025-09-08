import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LanguageToolbar from './LanguageToolbar';
import VideoTutorials from './VideoTutorials';
import FieldGuides from './FieldGuides';
import CampaignsSection from './CampaignsSection';
import InfographicsSection from './InfographicsSection';
import PostersSection from './PostersSection';
import DownloadsSection from './DownloadsSection';
import ProgressSection from './ProgressSection';
import { LangCode, TRAINING_MODULES, useTrainingProgress, openPrintable } from './TrainingAwarenessUtils';

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
      `<div class="cert">
        <h1>Training Completion Certificate</h1>
        <p class="muted">Issued to</p>
        <h2>${user?.name ?? 'ASHA Worker'}</h2>
        <p class="muted">on ${date}</p>
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
