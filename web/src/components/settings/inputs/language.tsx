"use client";

import Toast from "@/components/ui/toast";
import UniversalSelect from "@/components/ui/universal-select";
import { Dict } from "@/const/dict";
import { updatePreferences } from "@/lib/settings/actions";
import { getLanguages } from "@/lib/settings/queries";
import { useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type Props = {
  dict: Dict["private"]["settings"]["preferences"]["location"]["language"];
  defaultValue: string;
};

export default function LanguageSelect({ defaultValue, dict }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(defaultValue);
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    isLoading,
    mutate,
    data: languages,
  } = useSWR("languages", () => getLanguages());

  useEffect(() => {
    if (!formRef.current || selected === defaultValue) return;
    formRef.current.requestSubmit();
  }, [selected]);

  const action = (formData: FormData) =>
    startTransition(async () => {
      const res = await updatePreferences(formData);
      if (res?.error) {
        toast.custom((t) => <Toast {...t} message={res.error} type="error" />);
      } else {
        mutate();
        toast.custom((t) => (
          <Toast {...t} type="success" message="Pomyślnie zmieniono dane!" />
        ));
      }
    });

  return (
    <form action={action} ref={formRef}>
      <UniversalSelect
        name="language"
        aria-label="Language select"
        label={dict.label}
        selectedKeys={[selected]}
        isLoading={isLoading || isPending}
        isDisabled={isLoading || isPending}
        elements={
          languages
            ? languages.map((lang) => ({ name: lang.name, value: lang.code }))
            : []
        }
        placeholder={dict.placeholder}
        onChange={(e) => setSelected(e.target.value)}
      />
      <input type="hidden" name="name" value="language" />
      <input type="hidden" name="value" value={selected} />
    </form>
  );
}
