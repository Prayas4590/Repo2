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

  const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
    <div className="sticky top-0 z-10 bg-surface px-4 pt-3 pb-2 border-b border-divider">
      <div className="flex items-center gap-2">
        <MdIcon name={icon} size={20} className="text-asha" />
        <span className="title-medium text-text-primary">{title}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto w-full pb-24">
      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-medium flex items-center gap-2">
            <MdIcon name="menu_book" size={20} className="text-asha" />
            Training & Awareness
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value="videos" onValueChange={() => {}} className="w-full">
            <div className="w-full grid grid-cols-4 rounded-none sticky top-0 z-10">
              <button className="text-[11px] py-3 px-2 text-center">Videos</button>
              <button className="text-[11px] py-3 px-2 text-center">Guides</button>
              <button className="text-[11px] py-3 px-2 text-center">Campaigns</button>
              <button className="text-[11px] py-3 px-2 text-center">Progress</button>
            </div>

            <div className="p-4">
              <SectionHeader title="Video Tutorials" icon="play_circle" />
              <div className="p-4 space-y-3">
                <VideoTutorials />
              </div>
            </div>

            <div className="p-4">
              <SectionHeader title="Field Guides" icon="menu_book" />
              <div className="p-4 space-y-3">
                <FieldGuides />
              </div>
            </div>

            <div className="p-4">
              <SectionHeader title="Campaigns & Materials" icon="campaign" />
              <div className="p-4 space-y-3">
                <CampaignsSection />
                <InfographicsSection />
                <PostersSection />
                <DownloadsSection />
              </div>
            </div>

            <div className="p-4">
              <SectionHeader title="Progress & Certificate" icon="check_circle" />
              <div className="p-4 space-y-3">
                <ProgressSection modules={TRAINING_MODULES} progress={progress} completionPercent={completionPercent} toggle={toggle} onCertificate={certificate} />
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
