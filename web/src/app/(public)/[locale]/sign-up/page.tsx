import Logo from "@/assets/icons/logo";
import Form from "@/components/auth/form";
import { Input } from "@/components/ui/input";
import getDictionary from "@/const/dict";
import { LOCALES } from "@/const/locales";
import getLang from "@/utils/get-lang";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
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
      locale: locale.replace("-", "_"),
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

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const lang = getLang(locale);
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
                name="first-name"
                label={signUp.form["first-name"].label}
                type="text"
                placeholder="Jan"
                required
                autoComplete="off"
              />
              <Input
                name="last-name"
                label={signUp.form["last-name"].label}
                type="text"
                required
                placeholder="Kowalski"
                autoComplete="off"
              />
            </div>
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="example@mail.com"
              required
              autoComplete="off"
            />
            <Input
              name="password"
              label={signUp.form.password.label}
              type="password"
              placeholder="**********"
              required
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
