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
          width={36}
          height={36}
          viewBox="0 0 418 418"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("ml-2.5", isMenuHidden.desktop && "absolute opacity-0")}
        >
          <g clipPath="url(#clip0_54_76)">
            <path
              d="M209 418C324.428 418 418 324.427 418 209C418 162.203 402.62 118.998 376.638 84.165C377.788 90.168 378.758 96.154 379.551 102.111C379.598 102.461 379.644 102.81 379.689 103.159C396.862 235.427 327.195 353.6 209 347.523C160.671 347.523 118.122 322.773 93.3374 285.257H14.3486C44.8174 362.971 120.482 418 209 418Z"
              fill="#177981"
            />
            <path
              d="M379.551 102.111C378.758 96.1537 377.788 90.1677 376.638 84.1647C366.029 70.6078 357.855 67.6872 357.647 67.7835C357.439 67.8798 241.412 204.481 241.412 204.481L163.176 135.582V187.535L244.765 259.838L379.689 103.159C379.644 102.81 379.598 102.461 379.551 102.111Z"
              fill="#177981"
            />
            <path
              d="M124.059 317.454H163.176V187.535V135.582L124.059 101.111V317.454Z"
              fill="#FDBB2D"
            />
            <path
              d="M226.504 191.35L241.412 204.481C241.412 204.481 357.439 67.8805 357.647 67.7842H331.644L226.504 191.35Z"
              fill="#FDBB2D"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M209 -7.86366e-05C93.5729 -7.86366e-05 -7.03138e-05 93.5719 -7.03138e-05 209C-7.03138e-05 229.489 2.94823 249.289 8.44371 268H83.6338C75.195 250.1 70.4769 230.101 70.4769 209C64.3999 90.8049 182.573 21.1379 314.841 38.3109C315.19 38.3559 315.539 38.4019 315.889 38.4489C321.846 39.2419 327.832 40.2119 333.835 41.3619C299.002 15.3799 255.797 -7.86366e-05 209 -7.86366e-05Z"
              fill="#FDBB2D"
            />
          </g>
          <defs>
            <clipPath id="clip0_54_76">
              <rect width="418" height="418" fill="white" />
            </clipPath>
          </defs>
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
