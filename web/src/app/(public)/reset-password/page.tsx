import Logo from "@/assets/icons/logo";
import Form from "@/components/ui/temp-form";
import getDictionary from "@/const/dict";
import { resetPassword } from "@/lib/auth/actions";
import { getSettings } from "@/lib/general/actions";
import { Input } from "@heroui/react";

export async function generateMetadata() {
  const settings = await getSettings();
  const {
    public: { auth },
  } = await getDictionary(settings.language);
  const dict = auth["reset-password"];
  return dict._metadata;
}

export default async function Page() {
  const settings = await getSettings();
  const { public: dict } = await getDictionary(settings.language);
  return (
    <div className="h-screen sm:h-auto min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white rounded-md px-6 sm:px-10 py-8 w-full max-w-[28rem] border">
        <Form
          passwordReset={{
            _error: dict.auth["reset-password"].form._toast.error,
          }}
          mutation={resetPassword}
          buttonWrapperClassName="max-w-none"
          buttonProps={{
            children: dict.auth["reset-password"].form._submit.label,
            className: "w-full",
          }}
          successMessage={dict.auth["reset-password"].form._toast.success}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="bg-light rounded-md h-16 w-16 mb-4 border flex items-center justify-center">
                <Logo className="w-9 h-9" />
              </div>
              <h1 className="text-2xl font-medium">
                {dict.auth["reset-password"].title}
              </h1>
              <p className="text-sm">
                {dict.auth["reset-password"].description}
              </p>
            </div>
            <Input
              classNames={{
                inputWrapper: "!bg-light border shadow-none",
              }}
              name="password"
              label={dict.auth["reset-password"].form.password.label}
              type="password"
              placeholder="**********"
              isRequired
              required
            />
            <Input
              classNames={{
                inputWrapper: "!bg-light border shadow-none",
              }}
              name="confirm-password"
              label={dict.auth["reset-password"].form["confirm-password"].label}
              type="password"
              placeholder="**********"
              isRequired
              required
            />
          </div>
          <input type="hidden" name="redirect" value="true" />
        </Form>
      </div>
    </div>
  );
}
