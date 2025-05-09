import { WebVitals } from "@/components/web-vitals";
import Providers from "./providers";
// import MobileActions from "@/components/ui/cta/mobile-actions";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  const {
    private: { _navigation, general },
  } = await getDictionary(settings.language);

  return (
    <Providers settings={settings}>
      <Header dict={{ ..._navigation, ...general }} />
      <Sidebar dict={_navigation} />
      {/* <WebVitals /> */}
      <main className="bg-light">{children}</main>
      {/* <MobileActions /> */}
    </Providers>
  );
}
