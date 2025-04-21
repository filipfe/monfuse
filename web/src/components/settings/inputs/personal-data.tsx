"use client";

import { Input } from "@/components/ui/input";
import Form from "@/components/ui/temp-form";
import { Dict } from "@/const/dict";
import { updateName } from "@/lib/settings/actions";
import { cn } from "@/utils/cn";
import { useState } from "react";

interface Props extends Pick<Account, "first_name" | "last_name"> {
  dict: Dict["private"]["settings"]["account"]["personal-data"];
}

export default function PersonalDataInput({
  dict,
  first_name,
  last_name,
}: Props) {
  const [firstName, setFirstName] = useState(first_name);
  const [lastName, setLastName] = useState(last_name);

  return (
    <Form
      mutation={updateName}
      buttonProps={{
        size: "sm",
        children: dict.form._submit.label,
        className: cn(
          firstName === first_name && lastName === last_name && "hidden"
        ),
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 mb-2">
          <h3>{dict.title}</h3>
          <p className="text-sm text-font/60">{dict.description}</p>
        </div>
        <Input
          name="first_name"
          label={dict.form["first-name"].label}
          placeholder={dict.form["first-name"].label}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="max-w-xl"
        />
        <Input
          label={dict.form["last-name"].label}
          name="last_name"
          placeholder={dict.form["last-name"].label}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="max-w-xl"
        />
      </div>
    </Form>
  );
}
