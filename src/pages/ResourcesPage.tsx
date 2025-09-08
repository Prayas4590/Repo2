import { TrainingPurposeCard, TrainingVideoLessons, TrainingGuides, TrainingSymptomTips, TrainingSanitationChecklist, TrainingQuizzes, TrainingLanguageAudio } from '@/components/CitizenComponent';

const ResourcesPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="headline-medium text-text-primary mb-2">Training</h1>
        <p className="body-medium text-text-secondary">Learn hygiene, disease prevention, and safe water practices</p>
      </div>

      <TrainingPurposeCard />
      <TrainingVideoLessons />
      <TrainingGuides />
      <TrainingSymptomTips />
      <TrainingSanitationChecklist />
      <TrainingQuizzes />
      <TrainingLanguageAudio />
    </div>
  );
};

export default ResourcesPage;
