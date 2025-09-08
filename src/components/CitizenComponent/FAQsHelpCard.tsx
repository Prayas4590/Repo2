import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export default function FAQsHelpCard() {
  const faqs = [
    { q: 'When should I contact an ASHA worker?', a: 'Contact ASHA for home visits, primary guidance, and to request basic health services or water issue inspections.' },
    { q: 'When should I go to PHC?', a: 'For persistent symptoms (>24h), high fever, dehydration, or for vaccinations and routine checkups, contact your PHC.' },
    { q: 'When is it an emergency?', a: 'Severe bleeding, unconsciousness, severe chest pain, severe breathing difficulty, or poisoning—call the emergency hotline immediately.' },
  ];

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          FAQs & Help
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="label-medium text-text-primary">{f.q}</AccordionTrigger>
              <AccordionContent className="body-medium text-text-secondary">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
