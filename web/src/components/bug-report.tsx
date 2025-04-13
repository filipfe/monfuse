"use client";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@nextui-org/react";
import Form from "./ui/form";
import { FormEvent, useState } from "react";
import { Check, Flag } from "lucide-react";
import { captureFeedback } from "@sentry/nextjs";

export default function BugReport({ first_name, last_name, email }: Settings) {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    captureFeedback(
      {
        name: `${first_name} ${last_name}`,
        email,
        message,
      },
      { includeReplay: true }
    );
    setIsSent(true);
  };

  return (
    <Popover>
      <PopoverTrigger className="fixed right-8 cursor-pointer bottom-8 text-sm bg-white rounded-full font-medium border py-3 px-6">
        <div className="flex items-center gap-2">
          <Flag size={16} />
          <span>Zgłoś problem</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-4 !shadow-none border w-80">
        <div className="w-full pb-6 space-y-1.5">
          <h4 className="font-bold">Zgłoś problem</h4>
          <p className="max-w-56">
            Opisz co się stało, a my postaramy się rozwiązać problem.
          </p>
        </div>
        <form className="space-y-4 w-full" onSubmit={onSubmit}>
          <Textarea
            isDisabled={isSent}
            size="sm"
            label="Wiadomość"
            className="border rounded-md"
            classNames={{ innerWrapper: "!bg-light min-h-32" }}
            maxLength={256}
            value={message}
            onValueChange={(value) => setMessage(value)}
          />
          <Button
            disableRipple
            type="submit"
            isDisabled={message.length === 0 || isSent}
            color="primary"
            className="w-full"
          >
            {isSent && <Check size={16} />}
            {isSent ? "Wysłano" : "Wyślij"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
