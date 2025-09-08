import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const question = {
  q: 'Which is the safest way to make water drinkable at home?',
  options: [
    { id: 'a', text: 'Add salt to water' },
    { id: 'b', text: 'Boil water for at least 1 minute' },
    { id: 'c', text: 'Keep water in open bucket' },
    { id: 'd', text: 'Use ice to cool and drink' },
  ],
  answer: 'b',
};

export default function TrainingQuizzes() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correct = submitted && selected === question.answer;

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Interactive Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="body-medium text-text-primary">{question.q}</p>
        <div className="grid gap-2">
          {question.options.map((opt) => (
            <Button
              key={opt.id}
              variant={selected === opt.id ? 'default' : 'outline'}
              className={`justify-start h-12 ripple ${submitted ? (opt.id === question.answer ? 'border-success' : selected === opt.id ? 'border-error' : '') : ''}`}
              onClick={() => !submitted && setSelected(opt.id)}
            >
              {opt.text}
            </Button>
          ))}
        </div>
        {submitted && (
          <Badge className={`${correct ? 'bg-success text-success-foreground' : 'bg-error text-error-foreground'}`}>
            {correct ? 'Correct! Boiling kills most germs.' : 'Incorrect. Correct answer: Boil for at least 1 minute.'}
          </Badge>
        )}
      </CardContent>
      <CardFooter>
        <Button disabled={!selected || submitted} onClick={() => setSubmitted(true)} className="w-full ripple">
          Submit Answer
        </Button>
      </CardFooter>
    </Card>
  );
}
