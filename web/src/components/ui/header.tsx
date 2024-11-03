"use client";

import { Fragment, useContext, useTransition } from "react";
import { signOut } from "@/lib/auth/actions";
import { BreadcrumbItem, Breadcrumbs, Button, cn } from "@nextui-org/react";
import { AlignJustifyIcon, Bot, LogOutIcon, SettingsIcon } from "lucide-react";
import { LINKS, PAGES, SETTINGS_PAGES } from "@/const";
import { usePathname } from "next/navigation";
import { MenuContext } from "@/app/(private)/(sidebar)/providers";
import { Dict } from "@/const/dict";

const automationPage: Page = {
  href: "/automation",
  title: "Automatyzacja",
  icon: Bot,
};

const settingsPage: Page = {
  href: "/settings",
  title: "Ustawienia",
  icon: SettingsIcon,
  links: SETTINGS_PAGES,
};

export default function Header({
  dict,
}: {
  dict: Dict["private"]["_navigation"];
}) {
  const [isPending, startTransition] = useTransition();
  const { isMenuHidden, setIsMenuHidden } = useContext(MenuContext);
  const pathname = usePathname();
  const flatten = (arr: Page[]): Page[] =>
    arr.flatMap(({ links, ...page }) => [page, ...flatten(links || [])]);
  const links = flatten([...PAGES, settingsPage, automationPage]).filter(
    ({ href }) => (href === "/" ? pathname === "/" : pathname.startsWith(href))
  );
  return (
    <Fragment>
      <header className="h-20 sticky top-0 bg-white items-center justify-between z-50 px-4 sm:flex hidden">
        <svg
          width={40}
          height={40}
          viewBox="0 0 435 435"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "pl-2",
            isMenuHidden.desktop && "sm:opacity-0 absolute"
          )}
        >
          <path
            d="M209 418C324.428 418 418 324.427 418 209C418 162.203 402.62 118.998 376.638 84.165C377.788 90.168 378.758 96.154 379.551 102.111C379.598 102.461 379.644 102.81 379.689 103.159C396.862 235.427 327.195 353.6 209 347.523C160.671 347.523 118.122 322.773 93.3374 285.257H14.3486C44.8174 362.971 120.482 418 209 418Z"
            fill="#177981"
          />
          <path
            d="M379.551 102.111C378.758 96.1542 377.788 90.1682 376.638 84.1652C366.029 70.6083 357.855 67.6877 357.647 67.784C357.439 67.8803 241.412 204.481 241.412 204.481L163.176 135.582V187.535L244.765 259.838L379.689 103.159C379.644 102.81 379.598 102.461 379.551 102.111Z"
            fill="#177981"
          />
          <path
            d="M124.059 317.454H163.176V187.535V135.582L124.059 101.111V317.454Z"
            fill="#FDBB2D"
          />
          <path
            d="M226.504 191.35L241.412 204.481C241.412 204.481 357.439 67.88 357.647 67.7837H331.644L226.504 191.35Z"
            fill="#FDBB2D"
          />
          <path
            d="M0 209C0 93.572 93.572 0 209 0C222.173 0 235.062 1.2187 247.559 3.5496C199.698 32.6159 209 50.273 158.706 79.8896C107.067 100.02 70.4767 150.237 70.4767 209C70.4767 230.223 75.2496 250.332 83.7805 268.311H8.5353C2.981 249.509 0 229.602 0 209Z"
            fill="#FDBB2D"
          />
        </svg>
        <Button
          disableRipple
          variant="light"
          className={cn(
            "rounded-full h-10 w-10 min-w-0 px-0 ml-auto",
            isMenuHidden.desktop && "mr-auto"
          )}
          onPress={() =>
            setIsMenuHidden((prev) => ({ ...prev, desktop: !prev.desktop }))
          }
        >
          <AlignJustifyIcon size={20} />
        </Button>
      </header>
      <header className="flex items-center border-b gap-4 justify-between px-4 sm:px-10 h-16 sm:h-20 fixed sm:sticky top-0 left-0 bg-white z-50 w-full sm:w-auto">
        <Breadcrumbs
          maxItems={3}
          itemsAfterCollapse={1}
          itemsBeforeCollapse={1}
          itemClasses={{
            item: "px-2 flex items-center gap-1.5 sm:gap-2.5 text-[12px] sm:text-[13px] data-[current=true]:font-medium",
            separator: "px-0 sm:px-1",
          }}
        >
          {links.map((link, k, arr) => (
            <BreadcrumbItem
              startContent={
                (arr.length < 3 || k === 0 || k === arr.length - 1) && (
                  <link.icon size={14} />
                )
              }
              key={link.href}
              href={link.href}
            >
              {dict[link.href.slice(1) as keyof typeof dict]}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
        <form
          action={() => startTransition(signOut)}
          className="hidden sm:block"
        >
          <Button
            isDisabled={isPending}
            variant="light"
            size="sm"
            disableRipple
            type="submit"
            className="font-medium"
          >
            {isPending ? (
              <l-hatch size={12} stroke={1.5} />
            ) : (
              <LogOutIcon size={16} />
            )}
            {dict._logout}
          </Button>
        </form>
        <Button
          onPress={() =>
            setIsMenuHidden((prev) => ({ ...prev, mobile: !prev.mobile }))
          }
          className="rounded-full h-10 w-10 min-w-0 px-0 sm:hidden"
          variant="light"
        >
          <AlignJustifyIcon size={20} />
        </Button>
      </header>
    </Fragment>
  );
}
