import Logo from "@/assets/svg/logo";
import { Dict } from "@/dict";
import Link from "next/link";

export default function Footer({ dict }: { dict: Dict }) {
  return (
    <footer className="bg-primary-dark">
      <div className="relative w-full mx-auto max-w-7xl px-6">
        <div className="flex flex-col max-sm:items-start sm:flex-row gap-8 sm:gap-4 justify-between py-12">
          <Link href="/" className="text-sm text-white h-11">
            <Logo />
          </Link>
          <ul className="text-white">
            <li>
              <h3 className="font-medium">{dict.services.title}</h3>
              <ul className="mt-2">
                <li className="py-1">
                  <Link className="text-sm text-white/80" href="/incomes">
                    {dict.services.items.incomes.title}
                  </Link>
                </li>
                <li className="py-1">
                  <Link className="text-sm text-white/80" href="/expenses">
                    {dict.services.items.expenses.title}
                  </Link>
                </li>
                <li className="py-1">
                  <Link
                    className="text-sm text-white/80"
                    href="/recurring-payments"
                  >
                    {dict.services.items["recurring-payments"].title}
                  </Link>
                </li>
                <li className="py-1">
                  <Link className="text-sm text-white/80" href="/goals">
                    {dict.services.items.goals.title}
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="text-white">
            <li className="pb-2">
              <Link href="/ai-assistant">{dict["ai-assistant"].title}</Link>
            </li>
            <li className="py-2">
              <Link href="/pricing">{dict.pricing.title}</Link>
            </li>
            <li className="py-2">
              <Link href="/blog">{dict.blog.title}</Link>
            </li>
          </ul>
          <div>
            <div className="bg-primary/20 rounded-md px-1 h-12 flex items-center justify-center flex-1">
              <Link
                href="https://app.monfuse.com"
                className="whitespace-nowrap bg-primary py-2.5 text-sm px-5 rounded-md text-white"
              >
                {dict.landing.hero.cta.primary}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-between py-4 border-t border-white/10">
          <small className="text-white/80">
            &copy; {new Date().getFullYear()} Monfuse, Inc. All rights reserved.
          </small>
          <small className="text-white/80">
            <Link href="/privacy-policy">{dict["privacy-policy"].title}</Link>
          </small>
        </div>
      </div>
    </footer>
  );
}
