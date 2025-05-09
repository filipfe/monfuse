import { Dict } from "@/dict";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Mailbox, MessageSquareText, Sparkles } from "lucide-react";
import AIAssistantTabs from "./ai-assistant/tabs";
// [text-shadow:_4px_4px_0_rgba(23,121,129,0.2)]
export default function AIAssistant({
  dict,
}: {
  dict: Dict["landing"]["ai-assistant"];
}) {
  return (
    <section id="how-it-works" className="sm:px-6 py-16 sm:py-24">
      <div>
        <div className="relative w-full mx-auto max-w-7xl">
          <div className="text-center mx-auto pb-4">
            <h2 className="text-sm text-primary font-mono font-bold tracking-wider uppercase">
              {dict.category}
            </h2>
            <h3 className="mx-auto mt-2 sm:mt-4 max-w-xs text-2xl font-black sm:max-w-none sm:text-3xl lg:text-4xl">
              {dict.title}
            </h3>
          </div>
          <AIAssistantTabs>
            <TabsList className="flex flex-col gap-4 p-0 !bg-transparent h-auto lg:h-96">
              <TabsTrigger value="context" className="items-stretch gap-6">
                <div className="w-0.5 bg-border shrink-0 rounded-full overflow-hidden grid">
                  <div className="bg-primary scale-y-0 group-data-[state=active]/trigger:scale-y-100 group-data-[state=active]/trigger:animate-shrink-y transition-transform" />
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full shrink-0 flex items-center justify-center self-center">
                  <Mailbox className="text-primary" />
                </div>
                <div className="flex flex-col gap-1 items-start text-left">
                  <h4 className="font-bold text-lg lg:text-xl text-font">
                    1. {dict.context.title}
                  </h4>
                  <p className="text-font/80 text-sm leading-relaxed font-normal">
                    {dict.context.description}
                  </p>
                </div>
              </TabsTrigger>
              <TabsTrigger value="message" className="items-stretch gap-6">
                <div className="w-0.5 bg-border shrink-0 rounded-full overflow-hidden grid">
                  <div className="bg-primary scale-y-0 group-data-[state=active]/trigger:scale-y-100 group-data-[state=active]/trigger:animate-shrink-y transition-transform" />
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full shrink-0 flex items-center justify-center self-center">
                  <MessageSquareText className="text-primary" />
                </div>
                <div className="flex flex-col gap-1 items-start text-left">
                  <h4 className="font-bold text-lg lg:text-xl text-font">
                    2. {dict.message.title}
                  </h4>
                  <p className="text-font/80 text-sm leading-relaxed font-normal">
                    {dict.message.description}
                  </p>
                </div>
              </TabsTrigger>
              <TabsTrigger className="items-stretch gap-6" value="response">
                <div className="w-0.5 bg-border shrink-0 rounded-full overflow-hidden grid">
                  <div className="bg-primary scale-y-0 group-data-[state=active]/trigger:scale-y-100 group-data-[state=active]/trigger:animate-shrink-y transition-transform" />
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full shrink-0 flex items-center justify-center self-center">
                  <Sparkles className="text-primary" />
                </div>
                <div className="flex flex-col gap-1 items-start text-left">
                  <h4 className="font-bold text-lg lg:text-xl text-font">
                    3. {dict.response.title}
                  </h4>
                  <p className="text-font/80 text-sm leading-relaxed font-normal">
                    {dict.response.description}
                  </p>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="context"
              className="max-lg:h-96 md:max-w-max mx-auto w-full max-md:overflow-hidden"
            >
              <Image
                width={828}
                height={412}
                src="/app/ai-assistant/context.png"
                className="!relative aspect-auto animate-slide-left h-full w-full sm:rounded-md border object-cover md:object-contain object-right"
                alt={dict.context._image.alt}
              />
            </TabsContent>
            <TabsContent
              value="message"
              className="max-lg:h-96 md:max-w-max mx-auto w-full max-md:overflow-hidden"
            >
              <Image
                width={828}
                height={412}
                src="/app/ai-assistant/message.png"
                className="!relative aspect-auto animate-slide-left h-full w-full sm:rounded-md border object-cover md:object-contain object-left"
                alt={dict.message._image.alt}
              />
            </TabsContent>
            <TabsContent
              value="response"
              className="max-lg:h-96 md:max-w-max mx-auto w-full max-md:overflow-hidden"
            >
              <Image
                width={828}
                height={412}
                src="/app/ai-assistant/response.png"
                className="!relative aspect-auto animate-slide-left h-full w-full sm:rounded-md border object-cover md:object-contain object-left"
                alt={dict.response._image.alt}
              />
            </TabsContent>
          </AIAssistantTabs>
        </div>
      </div>
    </section>
  );
}
