import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FieldGuides() {
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
