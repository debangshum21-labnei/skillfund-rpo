import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is this MVP connected to real trading or payments?",
    answer: "No. The current frontend uses mock data only. Trading execution, deposits, withdrawals, and session settlement are simulated.",
  },
  {
    question: "How does a session end?",
    answer: "A session ends when the demo account reaches +20% profit or -10% loss. The user then enters a 15-minute cooldown.",
  },
  {
    question: "Why use a demo wallet?",
    answer: "The demo wallet lets the product evaluate trading performance without exposing the user deposit directly to live market execution in this MVP.",
  },
  {
    question: "What should be validated before launch?",
    answer: "Legal structure, risk disclosure, payment operations, anti-abuse controls, and session settlement logic should be validated before any production release.",
  },
];

export function FAQAccordion() {
  return (
    <Accordion type="single" collapsible>
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`item-${index}`}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
