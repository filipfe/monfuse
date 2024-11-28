import Logo from "@/assets/icons/logo";
import Form from "@/components/ui/form";
import getDictionary from "@/const/dict";
import { LOCALES } from "@/const/locales";
import { requestPasswordChange } from "@/lib/auth/actions";
import getLang from "@/utils/get-lang";
import { Input } from "@nextui-org/react";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const lang = getLang(locale);
  const {
    public: { auth },
  } = await getDictionary(lang);
  const dict = auth["forgot-password"]._metadata;
  return {
    ...dict,
    openGraph: {
      ...dict,
      url: new URL(`https://app.monfuse.com/${locale}/forgot-password`),
      locale: locale.replace("-", "_"),
    },
    twitter: {
      ...dict,
    },
    alternates: {
      canonical: new URL(`https://app.monfuse.com/${locale}/forgot-password`),
      languages: LOCALES.reduce(
        (prev, locale) => ({
          ...prev,
          [locale]: `https://app.monfuse.com/${locale}/forgot-password`,
        }),
        {}
      ),
    },
  };
}

export default async function Page({ params }: { params: { locale: Locale } }) {
  const lang = getLang(params.locale);
  const {
    public: { auth },
  } = await getDictionary(lang);
  const dict = auth["forgot-password"];
  return (
    <div className="h-screen sm:h-auto min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white rounded-md px-6 sm:px-10 py-8 w-full max-w-[28rem] border">
        <Form
          mutation={requestPasswordChange}
          buttonWrapperClassName="max-w-none"
          buttonProps={{
            children: dict.form._submit.label,
            className: "w-full",
          }}
          successMessage={dict.form._toast.success}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="bg-light rounded-md h-16 w-16 mb-4 border flex items-center justify-center">
                <Logo className="w-9 h-9" />
              </div>
              <h1 className="text-2xl font-medium">{dict.title}</h1>
              <p className="text-sm">{dict.description}</p>
            </div>
            <Input
              classNames={{
                inputWrapper: "!bg-light border shadow-none",
              }}
              name="email"
              label="Email"
              type="email"
              placeholder="example@mail.com"
              isRequired
              required
              autoComplete="off"
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
