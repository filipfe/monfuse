import { Dict } from "@/dict";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type Question = {
  question: string;
  answer: string;
};

type Props = { dict: Dict["landing"]["faq"] & { items: Question[] } };

export default function FAQ({ dict }: Props) {
  return (
    <section id="faq">
      <div>
        <div className="relative container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center mx-auto pb-4">
            <h2 className=" text-primary font-mono font-medium tracking-wider uppercase">
              {dict.category}
            </h2>
            <h3 className="mx-auto mt-2 sm:mt-4 max-w-xs text-2xl font-black sm:max-w-none sm:text-3xl lg:text-4xl">
              {dict.title}
            </h3>
          </div>
          <div className="mx-auto my-6 sm:my-12 max-w-4xl">
            <Accordion type="single" className="w-full gap-2 flex flex-col">
              {dict.items.map((q, k) => (
                <QuestionRef {...q} key={`faq-${k}`} />
              ))}
            </Accordion>
          </div>
          <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-foreground/80">
            {dict.email}{" "}
            <a href="mailto:team@monfuse.com" className="underline">
              team@monfuse.com
            </a>
          </h4>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: dict.items.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: {
                "@type": "Answer",
                text: answer,
              },
            })),
          }),
        }}
      ></script>
    </section>
  );
}

const QuestionRef = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <AccordionItem value={question}>
    <AccordionTrigger>{question}</AccordionTrigger>
    <AccordionContent>{answer}</AccordionContent>
  </AccordionItem>
);
