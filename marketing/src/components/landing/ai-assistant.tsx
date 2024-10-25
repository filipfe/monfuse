import { Dict } from "@/dict";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Mailbox, MessageSquareText, Sparkles } from "lucide-react";

export default function AIAssistant({
  dict,
}: {
  dict: Dict["landing"]["ai-assistant"];
}) {
  return (
    <section id="how-it-works" className="sm:px-6 py-16 sm:py-24">
      <div>
        <div className="relative w-full mx-auto max-w-7xl">
          <div className="text-center space-y-4 pb-6 mx-auto">
            <h2 className="text-sm text-primary font-mono font-medium tracking-wider uppercase">
              {dict.category}
            </h2>
            <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
              {dict.title}
            </h3>
          </div>
          <Tabs
            defaultValue="context"
            className="mx-auto my-6 sm:my-12 h-full grid lg:grid-cols-[2fr_3fr] gap-10 items-center"
          >
            <TabsList className="flex flex-col gap-4 h-auto p-0 !bg-transparent">
              <TabsTrigger value="context" className="items-stretch gap-6">
                <div className="w-0.5 bg-border shrink-0 rounded-full overflow-hidden grid">
                  <div className="bg-primary scale-y-0" />
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full shrink-0 flex items-center justify-center self-center">
                  <Mailbox className="text-primary" />
                </div>
                <div className="flex flex-col gap-1 items-start text-left">
                  <h3 className="font-bold sm:text-lg lg:text-xl text-font">
                    1. Zbuduj kontekst
                  </h3>
                  <p className="text-font/80 text-sm leading-relaxed font-normal">
                    Simply upload your data to our secure platform. We support
                    various file formats and data types to ensure a seamless
                    integration with your existing systems.
                  </p>
                </div>
              </TabsTrigger>
              <TabsTrigger value="message" className="items-stretch gap-6">
                <div className="w-0.5 bg-border shrink-0 rounded-full overflow-hidden grid">
                  <div className="bg-primary scale-y-0" />
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full shrink-0 flex items-center justify-center self-center">
                  <MessageSquareText className="text-primary" />
                </div>
                <div className="flex flex-col gap-1 items-start text-left">
                  <h3 className="font-bold sm:text-lg lg:text-xl text-font">
                    2. Wyślij wiadomość
                  </h3>
                  <p className="text-font/80 text-sm leading-relaxed font-normal">
                    Simply upload your data to our secure platform. We support
                    various file formats and data types to ensure a seamless
                    integration with your existing systems.
                  </p>
                </div>
              </TabsTrigger>
              <TabsTrigger className="items-stretch gap-6" value="response">
                <div className="w-0.5 bg-border shrink-0 rounded-full overflow-hidden grid">
                  <div className="bg-primary scale-y-0" />
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full shrink-0 flex items-center justify-center self-center">
                  <Sparkles className="text-primary" />
                </div>
                <div className="flex flex-col gap-1 items-start text-left">
                  <h3 className="font-bold sm:text-lg lg:text-xl text-font">
                    3. Uzyskaj analizę lub informacje
                  </h3>
                  <p className="text-font/80 text-sm leading-relaxed font-normal">
                    Simply upload your data to our secure platform. We support
                    various file formats and data types to ensure a seamless
                    integration with your existing systems.
                  </p>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="context">
              <div className="h-96">
                <Image
                  width={1152}
                  height={384}
                  src="/app/ai-assistant/context.png"
                  className="aspect-auto h-full w-full rounded-md border border-neutral-300/50 object-cover object-right"
                  alt="feature"
                />
              </div>
            </TabsContent>
            <TabsContent value="message">
              <div className="h-96">
                <Image
                  width={1152}
                  height={384}
                  src="/app/ai-assistant/message.png"
                  className="aspect-auto h-full w-full rounded-md border border-neutral-300/50 object-cover object-left"
                  alt="feature"
                />
              </div>
            </TabsContent>
            <TabsContent value="response">
              <div className="h-96">
                <Image
                  width={1152}
                  height={384}
                  src="/app/ai-assistant/response.png"
                  className="aspect-auto h-full w-full rounded-md border border-neutral-300/50 object-cover object-left"
                  alt="feature"
                />
              </div>
            </TabsContent>
          </Tabs>
          {/* <div className="" data-orientation="vertical">
                <div
                  data-state="open"
                  data-orientation="vertical"
                  className="mt-px overflow-hidden focus-within:relative focus-within:z-10 relative mb-8 last:mb-0"
                >
                  <div className="absolute bottom-0 top-0 h-full w-0.5 overflow-hidden rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30 left-0 right-auto">
                    <div className="absolute left-0 top-0 w-full h-full origin-top bg-primary transition-all ease-linear dark:bg-white"></div>
                  </div>
                  <div className="flex items-center relative">
                    <div className="item-box w-12 h-12 bg-primary/10 rounded-full sm:mx-6 mx-2 shrink-0 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-upload w-6 h-6 text-primary"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" x2="12" y1="3" y2="15"></line>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3
                        data-orientation="vertical"
                        data-state="open"
                        className="flex"
                      >
                        <button
                          type="button"
                          aria-controls="radix-:r47:"
                          aria-expanded="true"
                          data-state="open"
                          data-orientation="vertical"
                          id="radix-:r46:"
                          className="group flex flex-1 cursor-pointer items-center justify-between px-5 outline-none text-xl font-bold pl-0"
                          data-radix-collection-item=""
                          aria-disabled="true"
                        >
                          1. Zbuduj kontekst
                        </button>
                      </h3>
                      <p
                        data-orientation="vertical"
                        data-state="open"
                        className="flex"
                      >
                        <button
                          type="button"
                          aria-controls="radix-:r47:"
                          aria-expanded="true"
                          data-state="open"
                          data-orientation="vertical"
                          id="radix-:r46:"
                          className="group flex text-sm leading-relaxed flex-1 cursor-pointer items-center px-5 outline-none justify-start text-left text-font/80 pl-0"
                          data-radix-collection-item=""
                          aria-disabled="true"
                        >
                          Simply upload your data to our secure platform. We
                          support various file formats and data types to ensure
                          a seamless integration with your existing systems.
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  data-state="closed"
                  data-orientation="vertical"
                  className="mt-px overflow-hidden focus-within:relative focus-within:z-10 relative mb-8 last:mb-0"
                >
                  <div className="absolute bottom-0 top-0 h-full w-0.5 overflow-hidden rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30 left-0 right-auto">
                    <div className="absolute left-0 top-0 w-full h-0 origin-top bg-primary transition-all ease-linear dark:bg-white"></div>
                  </div>
                  <div className="flex items-center relative">
                    <div className="item-box w-12 h-12 bg-primary/10 rounded-full sm:mx-6 mx-2 shrink-0 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-zap w-6 h-6 text-primary"
                      >
                        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3
                        data-orientation="vertical"
                        data-state="closed"
                        className="flex"
                      >
                        <button
                          type="button"
                          aria-controls="radix-:r49:"
                          aria-expanded="false"
                          data-state="closed"
                          data-orientation="vertical"
                          id="radix-:r48:"
                          className="group flex flex-1 cursor-pointer items-center justify-between px-5 outline-none text-xl font-bold pl-0"
                          data-radix-collection-item=""
                        >
                          2. Wyślij wiadomość
                        </button>
                      </h3>
                      <h3
                        data-orientation="vertical"
                        data-state="closed"
                        className="flex"
                      >
                        <button
                          type="button"
                          aria-controls="radix-:r49:"
                          aria-expanded="false"
                          data-state="closed"
                          data-orientation="vertical"
                          id="radix-:r48:"
                          className="group flex text-sm leading-relaxed flex-1 cursor-pointer items-center px-5 outline-none justify-start text-left text-font/80 pl-0"
                          data-radix-collection-item=""
                        >
                          Our advanced AI algorithms automatically process and
                          analyze your data, extracting valuable insights and
                          patterns that would be difficult to identify manually.
                        </button>
                      </h3>
                    </div>
                  </div>
                </div>
                <div
                  data-state="closed"
                  data-orientation="vertical"
                  className="mt-px overflow-hidden focus-within:relative focus-within:z-10 relative mb-8 last:mb-0"
                >
                  <div className="absolute bottom-0 top-0 h-full w-0.5 overflow-hidden rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30 left-0 right-auto">
                    <div className="absolute left-0 top-0 w-full h-0 origin-top bg-primary transition-all ease-linear dark:bg-white"></div>
                  </div>
                  <div className="flex items-center relative">
                    <div className="item-box w-12 h-12 bg-primary/10 rounded-full sm:mx-6 mx-2 shrink-0 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-sparkles w-6 h-6 text-primary"
                      >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                        <path d="M20 3v4"></path>
                        <path d="M22 5h-4"></path>
                        <path d="M4 17v2"></path>
                        <path d="M5 18H3"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3
                        data-orientation="vertical"
                        data-state="closed"
                        className="flex"
                      >
                        <button
                          type="button"
                          aria-controls="radix-:r4b:"
                          aria-expanded="false"
                          data-state="closed"
                          data-orientation="vertical"
                          id="radix-:r4a:"
                          className="group flex flex-1 cursor-pointer items-center justify-between px-5 outline-none text-xl font-bold pl-0"
                          data-radix-collection-item=""
                        >
                          3. Uzyskaj analizę lub informacje
                        </button>
                      </h3>
                      <h3
                        data-orientation="vertical"
                        data-state="closed"
                        className="flex"
                      >
                        <button
                          type="button"
                          aria-controls="radix-:r4b:"
                          aria-expanded="false"
                          data-state="closed"
                          data-orientation="vertical"
                          id="radix-:r4a:"
                          className="group text-sm leading-relaxed flex flex-1 cursor-pointer items-center px-5 outline-none justify-start text-left text-font/80 pl-0"
                          data-radix-collection-item=""
                        >
                          Receive clear, actionable insights and recommendations
                          based on the AI analysis. Use these insights to make
                          data-driven decisions and improve your business
                          strategies.
                        </button>
                      </h3>
                    </div>
                  </div>
                </div>
              </div> */}

          <ul className="px-6 flex h-full snap-x flex-nowrap overflow-x-auto py-10 [-ms-overflow-style:none] sm:[-webkit-mask-image:linear-gradient(90deg,transparent,black_20%,white_80%,transparent)] sm:[mask-image:linear-gradient(90deg,transparent,black_20%,white_80%,transparent)] [scrollbar-width:none] lg:hidden [&amp;::-webkit-scrollbar]:hidden snap-mandatory">
            <div className="min-w-[calc(100vw-64px)] relative grid h-full max-w-60 shrink-0 items-start justify-center py-4 last:mr-0 snap-center">
              <div className="absolute bottom-0 left-0 right-auto top-0 h-0.5 w-full overflow-hidden rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30">
                <div className="absolute left-0 top-0 h-full w-full origin-top bg-primary transition-all ease-linear"></div>
              </div>
              <h2 className="text-xl font-bold">1. Upload Your Data</h2>
              <p className="mx-0 max-w-sm text-balance text-sm text-font/60 mt-2">
                Simply upload your data to our secure platform. We support
                various file formats and data types to ensure a seamless
                integration with your existing systems.
              </p>
            </div>
            <div className="min-w-[calc(100vw-64px)] relative grid h-full max-w-60 shrink-0 items-start justify-center py-4 last:mr-0 snap-center">
              <div className="absolute bottom-0 left-0 right-auto top-0 h-0.5 w-full overflow-hidden rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30">
                <div className="absolute left-0 top-0 h-full w-0 origin-top bg-primary transition-all ease-linear"></div>
              </div>
              <h2 className="text-xl font-bold">2. Click Start</h2>
              <p className="mx-0 max-w-sm text-balance text-sm text-font/60 mt-2">
                Our advanced AI algorithms automatically process and analyze
                your data, extracting valuable insights and patterns that would
                be difficult to identify manually.
              </p>
            </div>
            <div className="min-w-[calc(100vw-64px)] relative grid h-full max-w-60 shrink-0 items-start justify-center py-4 last:mr-0 snap-center">
              <div className="absolute bottom-0 left-0 right-auto top-0 h-0.5 w-full overflow-hidden rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30">
                <div className="absolute left-0 top-0 h-full w-0 origin-top bg-primary transition-all ease-linear"></div>
              </div>
              <h2 className="text-xl font-bold">3. Get Actionable Insights</h2>
              <p className="mx-0 max-w-sm text-balance text-sm text-font/60 mt-2">
                Receive clear, actionable insights and recommendations based on
                the AI analysis. Use these insights to make data-driven
                decisions and improve your business strategies.
              </p>
            </div>
          </ul>
        </div>
      </div>
    </section>
  );
}
