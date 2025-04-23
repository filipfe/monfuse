"use client";

import { Input } from "@/components/ui/input";
import Form from "@/components/ui/temp-form";
import { Dict } from "@/const/dict";
import { cn } from "@/utils/cn";
import { useState } from "react";

interface Props extends Pick<Account, "email"> {
  dict: Dict["private"]["settings"]["account"]["email"];
}

export default function EmailInput({ dict, email: initialEmail }: Props) {
  const [email, setEmail] = useState(initialEmail || "");
  return (
    <Form
      buttonProps={{
        size: "sm",
        children: dict.form._submit.label,
        className: cn(email === initialEmail && "hidden"),
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 mb-2">
          <h3>{dict.title}</h3>
          <p className="text-sm text-font/60">{dict.description}</p>
        </div>
        <Input
          name="email"
          label={dict.form.email.label}
          placeholder={dict.form.email.placeholder}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </Form>
  );
}
