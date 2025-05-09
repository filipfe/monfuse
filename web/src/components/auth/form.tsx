"use client";

import { Dict } from "@/const/dict";
import { signIn, signInWithGoogle, signUp } from "@/lib/auth/actions";
import toast from "@/utils/toast";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";

export default function Form({
  children,
  isSignUp,
  dict,
}: {
  children: React.ReactNode;
  isSignUp?: boolean;
  dict: Dict["public"]["auth"]["_layout"] &
    Dict["private"]["general"] &
    (Dict["public"]["auth"]["sign-in"] | Dict["public"]["auth"]["sign-up"]);
}) {
  const { lang } = useParams();
  const [isPending, startTransition] = useTransition();
  // const [isSuccess, setIsSuccess] = useState(false);

  // if(isSuccess) {
  //   return
  // }

  return (
    <div className="flex flex-col gap-6">
      <form
        action={(formData) =>
          startTransition(async () => {
            const { error } = isSignUp
              ? await signUp(formData)
              : await signIn(formData);
            if (error) {
              if (isSignUp) {
                switch (error) {
                  case "user_already_exists":
                    toast({
                      type: "error",
                      message: (dict as Dict["public"]["auth"]["sign-up"]).form
                        ._error["already-exists"],
                    });
                    break;
                  case "weak_password":
                    toast({
                      type: "error",
                      message: (dict as Dict["public"]["auth"]["sign-up"]).form
                        ._error.password,
                    });
                    break;
                }
              } else if (error === "Invalid login credentials") {
                toast({
                  type: "error",
                  message: (dict as Dict["public"]["auth"]["sign-in"]).form
                    ._error.invalid,
                });
              } else {
                toast({
                  type: "error",
                  message: dict._error,
                });
              }
            }
          })
        }
      >
        {isSignUp && (
          <>
            <input type="hidden" name="lang" value={lang} />
            <input
              type="hidden"
              name="timezone"
              value={Intl.DateTimeFormat().resolvedOptions().timeZone}
            />
          </>
        )}
        {children}
        <div className="flex flex-col gap-6 mt-6">
          <div>
            <Button
              disabled={isPending}
              type="submit"
              size="lg"
              className="font-medium w-full"
            >
              {dict.form._submit.label}
            </Button>
            <p className="text-sm mt-4">
              {dict.swap.label}{" "}
              <Link
                href={isSignUp ? "/sign-in" : "/sign-up"}
                className="text-primary font-medium hover:text-primary/60 transition-colors"
              >
                {dict.swap.link}
              </Link>
            </p>
          </div>
          <div className="h-px bg-font/10 flex items-center justify-center my-2">
            <div className="px-2 bg-white mb-1">
              <span className="text-tiny text-font/40 uppercase">
                {dict.or}
              </span>
            </div>
          </div>
        </div>
      </form>
      <form
        action={() =>
          startTransition(async () => {
            const res = await signInWithGoogle();
            if (res?.error) {
              // toast
            }
          })
        }
      >
        <button
          disabled={isPending}
          className="border bg-light rounded-md text-sm flex items-center gap-2 justify-center h-10 w-full disabled:opacity-60"
        >
          <Image
            className="max-w-5"
            width={240}
            height={240}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/240px-Google_%22G%22_logo.svg.png"
            alt="Google Logo"
          />
          <span className="mb-0.5">{dict.google.label}</span>
        </button>
      </form>
    </div>
  );
}
