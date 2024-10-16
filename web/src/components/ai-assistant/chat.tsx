"use client";

import { useAIAssistant } from "@/app/(private)/ai-assistant/providers";
import { createClient } from "@/utils/supabase/client";
import toast from "@/utils/toast";
import { Button, Input, ScrollShadow } from "@nextui-org/react";
import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import MessageRef from "./chat/message";

export default function Chat({ settings }: { settings: Settings }) {
  const { currency, selected, limit, goal } = useAIAssistant();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input) return;

    setMessages((prev) => [...prev, { from: "user", content: input }]);
    setIsLoading(true);
    setInput("");

    const supabase = createClient();

    const { data: operations, error: operationsError } = await supabase.rpc(
      "get_ai_assistant_operations",
      {
        p_timezone: settings.timezone,
        p_currency: currency,
        p_incomes: selected.incomes,
        p_expenses: selected.expenses,
        p_recurring_payments: false,
      }
    );

    if (operationsError) {
      toast({
        type: "error",
        message: "Wystąpił błąd przy pobieraniu operacji",
      });
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.functions.invoke("ai-assistant", {
      body: {
        timezone: settings.timezone,
        language: settings.language,
        input,
        limit,
        goal,
        operations,
      },
    });

    if (error) {
      toast({
        type: "error",
        message: "Wystąpił błąd przy przetwarzaniu zapytania",
      });
    } else {
      setMessages((prev) => [
        ...prev,
        { from: "assistant", content: data.message },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col px-6 sm:px-0 mb-4 sm:mb-8">
      <div className="flex-1 flex flex-col justify-center">
        {messages.length === 0 ? (
          <div className="grid grid-cols-3 gap-4 mx-6">
            <RecommendationRef title="Wygeneruj prasówkę" />
            <RecommendationRef title="Example" />
            <RecommendationRef title="Example" />
            <RecommendationRef title="Example" />
            <RecommendationRef title="Example" />
            <RecommendationRef title="Example" />
          </div>
        ) : (
          <ScrollShadow
            className="h-full max-h-[calc(100vh-160px)] pt-4 sm:pt-8 pb-6"
            hideScrollBar
          >
            <div className="flex flex-col gap-4 min-h-max">
              {messages.map((message, k) => (
                <MessageRef {...message} key={message.from + k} />
              ))}
            </div>
          </ScrollShadow>
        )}
      </div>
      <form onSubmit={onSubmit}>
        <Input
          radius="full"
          size="lg"
          placeholder="Wykryj anomalie w wybranych wydatkach"
          value={input}
          endContent={
            <Button
              className="relative left-2"
              size="sm"
              radius="full"
              color="primary"
              disableRipple
              type="submit"
              isDisabled={!input || isLoading}
            >
              <Send size={20} />
              Wyślij
            </Button>
          }
          onValueChange={(value) => setInput(value)}
          classNames={{
            inputWrapper: "shadow-none !bg-white border",
            input: "text-sm",
          }}
        />
      </form>
    </div>
  );
}

const RecommendationRef = ({ title }: { title: string }) => (
  <button className="p-3 border rounded-md cursor-pointer select-none bg-white">
    <div className="text-left">
      <h4 className="font-medium text-sm">{title}</h4>
    </div>
  </button>
);
