"use client";

import React, { FormHTMLAttributes, useTransition } from "react";
import toast from "@/utils/toast";
import { Check, type LucideIcon } from "lucide-react";
import { Hatch } from "ldrs/react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/utils/cn";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  mutation?: (formData: FormData) => Promise<SupabaseResponse<any> | undefined>;
  callback?: () => void;
  successMessage?: string;
  buttonWrapperClassName?: string;
  isLoading?: boolean;
  passwordReset?: {
    _error: string;
  };
  close?: {
    text: string;
    onClose: () => void;
  };
  buttonProps: ButtonProps & {
    icon?: LucideIcon;
  };
}

export default function Form({
  children,
  mutation,
  callback,
  id,
  close,
  className,
  passwordReset,
  buttonWrapperClassName,
  isLoading,
  successMessage,
  buttonProps: {
    children: buttonChildren,
    icon: ButtonIcon,
    className: buttonClassName,
    ...buttonProps
  } = { children: "Zapisz" },
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition();

  const action = (formData: FormData) => {
    if (
      !!passwordReset &&
      formData.get("password")?.toString() !==
        formData.get("confirm-password")?.toString()
    ) {
      toast({
        type: "error",
        message: passwordReset._error,
      });
      return;
    }
    startTransition(async () => {
      const res = await mutation!(formData);
      if (res?.error) {
        toast({
          type: "error",
          message: res.error,
        });
      } else {
        callback && callback();
        successMessage &&
          toast({
            type: "success",
            message: successMessage,
          });
      }
    });
  };

  return (
    <form
      id={id}
      action={mutation ? action : undefined}
      className={className}
      {...props}
    >
      {children}
      <div
        className={cn(
          "max-w-max ml-auto flex items-center gap-3 mt-6",
          buttonWrapperClassName
        )}
      >
        {close && (
          <Button
            variant="outline"
            disabled={isPending}
            onClick={close.onClose}
            className="border"
          >
            {close.text}
          </Button>
        )}
        <Button
          type="submit"
          form={id}
          disabled={isLoading || isPending || buttonProps.disabled}
          className={buttonClassName}
          {...buttonProps}
        >
          {isLoading || isPending ? (
            <div className="w-4 grid place-content-center">
              <Hatch size={14} color="#FFF" stroke={2} />
            </div>
          ) : ButtonIcon ? (
            <ButtonIcon size={16} />
          ) : (
            <Check size={16} />
          )}
          {buttonChildren}
        </Button>
      </div>
    </form>
  );
}
