import Link from "next/link";
import Wrapper from "./wrapper";
import { Dict } from "@/dict";
import {
  CheckCircle,
  ChevronRight,
  Coins,
  Repeat,
  Wallet2,
} from "lucide-react";
import DropdownLink from "./dropdown";

export default function Header({ dict }: { dict: Dict }) {
  return (
    <header className="relative z-50">
      <Wrapper>
        <Link href="/" className="ml-3 text-sm">
          Logo
        </Link>
        <nav className="sr-only sm:not-sr-only" aria-labelledby="mainmenulabel">
          <h2 id="mainmenulabel" className="sr-only">
            Main Menu
          </h2>
          <ul>
            <DropdownLink title={dict.services.title}>
              <ul className="bg-white rounded-md border p-3 grid grid-cols-2 gap-1.5">
                <li>
                  <Link
                    className="text-sm !text-foreground rounded-md"
                    href="/incomes"
                  >
                    <div className="grid grid-cols-[14px_1fr] items-center gap-2 py-3 px-4 rounded-md border border-transparent hover:border-border hover:bg-neutral-100">
                      <Wallet2 size={14} />
                      <h3>{dict.services.items.incomes.title}</h3>
                      <p className="opacity-60 max-w-xs col-span-2 line-clamp-2">
                        {dict.services.items.incomes.description}
                      </p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm !text-foreground rounded-md"
                    href="/expenses"
                  >
                    <div className="grid grid-cols-[14px_1fr] items-center gap-2 py-3 px-4 rounded-md border border-transparent hover:border-border hover:bg-neutral-100">
                      <Coins size={14} />
                      <h3>{dict.services.items.expenses.title}</h3>
                      <p className="opacity-60 max-w-xs col-span-2 line-clamp-2">
                        {dict.services.items.expenses.description}
                      </p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm !text-foreground rounded-md"
                    href="/recurring-payments"
                  >
                    <div className="grid grid-cols-[14px_1fr] items-center gap-2 py-3 px-4 rounded-md border border-transparent hover:border-border hover:bg-neutral-100">
                      <Repeat size={14} />
                      <h3>{dict.services.items["recurring-payments"].title}</h3>
                      <p className="opacity-60 max-w-xs col-span-2 line-clamp-2">
                        {dict.services.items["recurring-payments"].description}
                      </p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm !text-foreground rounded-md"
                    href="/goals"
                  >
                    <div className="grid grid-cols-[14px_1fr] items-center gap-2 py-3 px-4 rounded-md border border-transparent hover:border-border hover:bg-neutral-100">
                      <CheckCircle size={14} />
                      <h3>{dict.services.items.goals.title}</h3>
                      <p className="opacity-60 max-w-xs col-span-2 line-clamp-2">
                        {dict.services.items.goals.description}
                      </p>
                    </div>
                  </Link>
                </li>
              </ul>
            </DropdownLink>
            <li className="inline-block">
              <Link
                className="text-sm font-medium px-6 py-3"
                href="/ai-assistant"
              >
                {dict["ai-assistant"].title}
              </Link>
            </li>
            <li className="inline-block">
              <Link className="text-sm font-medium px-6 py-3" href="/pricing">
                {dict.pricing.title}
              </Link>
            </li>
            <li className="inline-block">
              <Link className="text-sm font-medium px-6 py-3" href="/blog">
                Blog
              </Link>
            </li>
            <li className="inline-block">
              <Link className="text-sm font-medium px-6 py-3" href="/contact">
                Kontakt
              </Link>
            </li>
          </ul>
        </nav>
        <div className="bg-primary/20 rounded-lg p-1 flex items-center">
          <Link
            href="https://app.monfuse.com"
            className="bg-primary py-2.5 text-sm px-5 rounded-md !text-white"
          >
            Rozpocznij
          </Link>
        </div>
      </Wrapper>
    </header>
  );
}

// type NavLinkProps = { href: string; title: string; items?: NavLinkProps[] };

// const NavLink = ({ href, title, items }: NavLinkProps) => (
//   <li className="inline-block">
//     <Link className="text-sm font-medium text-white px-6 py-3" href={href}>
//       {title}
//     </Link>
//     {items && (
//       <div className="bg-white rounded-md border p-6 group-hover:opacity-100 opacity-0 group-hover:pointer-events-auto pointer-events-none absolute top-full left-1/2 -translate-x-1/2">
//         <ul className="grid grid-cols-2">
//           {items.map(link => <NavLink />)}
//         </ul>
//       </div>
//     )}
//   </li>
// );
