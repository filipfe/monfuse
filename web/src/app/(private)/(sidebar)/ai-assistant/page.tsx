import Chat from "@/components/ai-assistant/chat";
import GoalsContext from "@/components/ai-assistant/context/goals";
import LimitsContext from "@/components/ai-assistant/context/limits";
import OperationsContext from "@/components/ai-assistant/context/operations";
import Block from "@/components/ui/block";
import AIAssistantProvider from "./providers";
import { ScrollShadow } from "@heroui/react";
import { getSettings } from "@/lib/general/actions";
import CurrencyPicker from "@/components/ai-assistant/context/currency";
import getDictionary from "@/const/dict";
import ContextDropdown from "@/components/ai-assistant/context-dropdown";
import { Metadata } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const { private: dict } = await getDictionary(settings.language);
  return dict["ai-assistant"]._metadata;
}

export default async function Page() {
  const settings = await getSettings();

  const {
    private: {
      "ai-assistant": dict,
      general: { incomes, expenses },
      operations: {
        expenses: {
          limits: {
            _empty,
            modal: {
              form: {
                period: { values: periodValues },
              },
            },
          },
        },
      },
    },
  } = await getDictionary(settings.language);

  return (
    <div className="sm:px-10 flex flex-col h-full gap-4 sm:gap-10 xl:grid grid-cols-2 relative">
      <AIAssistantProvider defaultCurrency={settings.currency}>
        <ContextDropdown dict={_empty.title}>
          <ScrollShadow className="max-h-[calc(100vh-240px)]" hideScrollBar>
            <CurrencyPicker dict={dict.context.form.currency} />
            <OperationsContext
              dict={{ ...dict.context.form.operations, incomes, expenses }}
            />
            <LimitsContext
              dict={{
                ...dict.context.form.limits,
                _error: dict.context.form._error,
                periodValues: periodValues,
              }}
              timezone={settings.timezone}
            />
            <GoalsContext
              dict={{
                ...dict.context.form.goals,
                _error: dict.context.form._error,
              }}
            />
          </ScrollShadow>
        </ContextDropdown>
        <Chat dict={dict.chat} />
        <Block
          title={dict.context.title}
          description={dict.context.description}
          className="my-4 sm:my-8 hidden xl:flex"
        >
          <div className="relative flex-1">
            <div className="absolute inset-0 w-full h-full">
              <ScrollShadow className="h-full" hideScrollBar>
                <div>
                  <CurrencyPicker dict={dict.context.form.currency} />
                  <OperationsContext
                    dict={{
                      ...dict.context.form.operations,
                      incomes,
                      expenses,
                    }}
                  />
                  <LimitsContext
                    dict={{
                      ...dict.context.form.limits,
                      _error: dict.context.form._error,
                      periodValues: periodValues,
                    }}
                    timezone={settings.timezone}
                  />
                  <GoalsContext
                    dict={{
                      ...dict.context.form.goals,
                      _error: dict.context.form._error,
                    }}
                  />
                </div>
              </ScrollShadow>
            </div>
          </div>
        </Block>
      </AIAssistantProvider>
    </div>
  );
}
