import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { CURRENCIES } from "@/const";
import { Dict } from "@/const/dict";
import { useLimits } from "@/lib/general/queries";
import { addLimit } from "@/lib/operations/queries";
import formatAmount from "@/utils/operations/format-amount";
import toast from "@/utils/toast";
import { DialogProps } from "@radix-ui/react-dialog";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props extends DialogProps {
  defaultLimit: NewLimit;
  timezone: string;
  dict: Dict["private"]["operations"]["expenses"]["limits"]["modal"];
}

const formSchema = z.object({
  amount: z.string().min(1),
  currency: z.string().min(3),
  period: z.enum(["daily", "weekly", "monthly"]),
});

export type NewLimit = z.infer<typeof formSchema>;

export default function LimitForm({
  open,
  onOpenChange,
  defaultLimit,
  // onClose,
  timezone,
  dict,
}: Props) {
  // const [singleRecord, setSingleRecord] = useState<NewLimit>(defaultLimit);
  const form = useForm<NewLimit>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultLimit,
  });
  const currency = form.watch("currency");
  const { mutate } = useLimits(timezone, currency);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    form.reset(defaultLimit);
  }, [defaultLimit]);

  // console.log(form.getValues());
  const onSubmit = async (data: NewLimit) => {
    console.log(data, form.getValues());
    setIsLoading(true);
    const { error } = await addLimit(data);
    if (error) {
      toast({
        type: "error",
        message: dict.form._submit._error,
      });
    } else {
      mutate();
      // onClose();
      onOpenChange!(false);
    }
    setIsLoading(false);
  };

  const isEdit = !!defaultLimit.amount;

  const { isValid, isDirty } = form.formState;

  const period = form.watch("period");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.title[isEdit ? "edit" : "new"]}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <div className="grid grid-cols-[1fr_128px] gap-4">
                <FormItem className="col-span-2">
                  <Select
                    disabled={isEdit}
                    value={period}
                    onValueChange={(value) =>
                      form.setValue("period", value as NewLimit["period"])
                    }
                  >
                    <SelectTrigger label={dict.form.period.label}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(dict.form.period.values).map(
                        ([key, value]) => (
                          <SelectItem value={key} key={key}>
                            {value}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        label={dict.form.amount.label}
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(formatAmount(e.target.value))
                        }
                        onBlur={() => {
                          const value = parseFloat(field.value);
                          if (!isNaN(value)) {
                            field.onChange(value === 0 ? "" : value.toString());
                          }
                          field.onBlur();
                        }}
                      />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <Select
                    disabled={isEdit}
                    value={currency}
                    onValueChange={(value) => form.setValue("currency", value)}
                  >
                    <SelectTrigger label={dict.form.currency.label}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((curr) => (
                        <SelectItem value={curr} key={curr}>
                          {curr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {dict.form._close.label}
                </Button>
              </DialogClose>
              <Button disabled={isLoading || !isValid || !isDirty}>
                {dict.form._submit.label}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    // <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    //   <ModalContent>
    //     {(onClose) => (
    //       <>
    //         <ModalHeader className="font-normal">
    //           {dict.title[isEdit ? "edit" : "new"]}
    //         </ModalHeader>
    //         <Form
    //           onSubmit={onSubmit}
    //           buttonWrapperClassName="pb-4 px-6 mt-4"
    //           close={{ text: dict.form._close.label, onClose }}
    //           isLoading={isLoading}
    //           buttonProps={{
    //             children: dict.form._submit.label,
    //           }}
    //         >
    //           <ModalBody>
    //             <div className="grid grid-cols-[1fr_128px] gap-4">
    //               <Select
    //                 label={dict.form.period.label}
    //                 required
    //                 name="period"
    //                 isDisabled={isEdit}
    //                 selectedKeys={
    //                   singleRecord.period ? [singleRecord.period] : []
    //                 }
    //                 isRequired
    //                 className="col-span-2"
    //                 classNames={{
    //                   trigger: "bg-light shadow-none border",
    //                 }}
    //                 onChange={(e) =>
    //                   setSingleRecord((prev) => ({
    //                     ...prev,
    //                     period: e.target.value as any,
    //                   }))
    //                 }
    //               >
    //                 {Object.entries(dict.form.period.values).map(
    //                   ([key, value]) => (
    //                     <SelectItem key={key}>{value}</SelectItem>
    //                   )
    //                 )}
    //               </Select>
    //               <Input
    //                 classNames={{ inputWrapper: "bg-light shadow-none border" }}
    //                 name="amount"
    //                 label={dict.form.amount.label}
    //                 placeholder="0.00"
    //                 isRequired
    //                 required
    //                 value={singleRecord.amount}
    //                 onBlur={(_) => {
    //                   const value = parseFloat(singleRecord.amount);
    //                   !isNaN(value) &&
    //                     setSingleRecord((prev) => ({
    //                       ...prev,
    //                       amount: value === 0 ? "" : value.toString(),
    //                     }));
    //                 }}
    //                 onChange={(e) => {
    //                   setSingleRecord((prev) => ({
    //                     ...prev,
    //                     amount: formatAmount(e.target.value),
    //                   }));
    //                 }}
    //               />
    //               <UniversalSelect
    //                 name="currency"
    //                 label={dict.form.currency.label}
    //                 required
    //                 isRequired
    //                 isDisabled={isEdit}
    //                 selectedKeys={
    //                   singleRecord.currency ? [singleRecord.currency] : []
    //                 }
    //                 elements={CURRENCIES}
    //                 disallowEmptySelection
    //                 onChange={(e) =>
    //                   setSingleRecord((prev) => ({
    //                     ...prev,
    //                     currency: e.target.value,
    //                   }))
    //                 }
    //               />
    //             </div>
    //           </ModalBody>
    //         </Form>
    //       </>
    //     )}
    //   </ModalContent>
    // </Modal>
  );
}
