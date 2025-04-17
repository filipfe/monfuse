"use client";

import { Input } from "@/components/ui/input";
import Form from "@/components/ui/temp-form";
import { Dict } from "@/const/dict";
import { resetPassword } from "@/lib/auth/actions";
import { useState } from "react";

export default function PasswordInput({
  dict,
}: {
  dict: Dict["private"]["settings"]["account"]["password"];
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 mb-2">
        <h3>{dict.title}</h3>
        <p className="text-sm text-font/60">{dict.description}</p>
      </div>
      <Form
        mutation={resetPassword}
        buttonProps={{
          size: "sm",
          children: dict.form._submit.label,
        }}
        successMessage={dict.form._toast.success}
      >
        <div className="flex flex-col gap-4">
          <Input
            name="password"
            type="password"
            label={dict.form.password.label}
            placeholder="*********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            name="password"
            type="password"
            label={dict.form["confirm-password"].label}
            placeholder="*********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </Form>
    </div>
  );
}
