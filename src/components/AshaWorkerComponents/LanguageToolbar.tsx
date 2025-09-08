import MdIcon from '@/components/ui/md3-icon';
import { Button } from '@/components/ui/button';
import { LANGUAGES, LangCode, t } from './TrainingAwarenessUtils';

export default function LanguageToolbar({ lang, setLang, speaking, onSpeak, onStop }: { lang: LangCode; setLang: (l: LangCode) => void; speaking: boolean; onSpeak: () => void; onStop: () => void; }) {
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
