import Logo from "@/assets/icons/logo";
import Form from "@/components/auth/form";
import getDictionary from "@/const/dict";
import { LOCALES } from "@/const/locales";
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
  const dict = auth["sign-up"]._metadata;
  return {
    ...dict,
    openGraph: {
      ...dict,
      url: new URL(`https://app.monfuse.com/${locale}/sign-up`),
      locale,
    },
    twitter: {
      ...dict,
    },
    alternates: {
      canonical: new URL(`https://app.monfuse.com/${locale}/sign-up`),
      languages: LOCALES.reduce(
        (prev, locale) => ({
          ...prev,
          [locale]: `https://app.monfuse.com/${locale}/sign-up`,
        }),
        {}
      ),
    },
  };
}

export default async function Page({ params }: { params: { locale: Locale } }) {
  const lang = getLang(params.locale);
  const {
    private: { general },
    public: {
      auth: { _layout, ...auth },
    },
  } = await getDictionary(lang);
  const signUp = auth["sign-up"];
  return (
    <div className="h-screen sm:h-auto min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white rounded-md px-6 sm:px-10 py-8 w-full max-w-lg border">
        <Form isSignUp dict={{ ..._layout, ...signUp, ...general }}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="bg-light rounded-md h-16 w-16 mb-4 border flex items-center justify-center">
                <Logo className="w-9 h-9" />
              </div>
              <h1 className="text-2xl font-medium">{signUp.title}</h1>
              <p className="text-sm">{signUp.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                classNames={{
                  inputWrapper: "!bg-light shadow-none border",
                }}
                name="first-name"
                label={signUp.form["first-name"].label}
                type="text"
                placeholder="Jan"
                isRequired
                required
                autoComplete="off"
              />
              <Input
                classNames={{
                  inputWrapper: "!bg-light shadow-none border",
                }}
                name="last-name"
                label={signUp.form["last-name"].label}
                type="text"
                isRequired
                required
                placeholder="Kowalski"
                autoComplete="off"
              />
            </div>
            <Input
              classNames={{
                inputWrapper: "!bg-light shadow-none border",
              }}
              name="email"
              label="Email"
              type="email"
              placeholder="example@mail.com"
              isRequired
              required
              autoComplete="off"
            />
            <Input
              classNames={{
                inputWrapper: "!bg-light shadow-none border",
              }}
              name="password"
              label={signUp.form.password.label}
              type="password"
              placeholder="**********"
              isRequired
              required
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
