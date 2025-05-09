"use client";

import { Fragment, useContext, useTransition } from "react";
import { signOut } from "@/lib/auth/actions";
import { BreadcrumbItem, Breadcrumbs, Button, cn } from "@heroui/react";
import { AlignJustifyIcon, Bot, LogOutIcon, SettingsIcon } from "lucide-react";
import { PAGES, SETTINGS_PAGES } from "@/const";
import { usePathname } from "next/navigation";
import { MenuContext } from "@/app/(private)/(sidebar)/providers";
import { Dict } from "@/const/dict";
import Logo from "@/assets/icons/logo";
import toast from "@/utils/toast";
import { Hatch } from "ldrs/react";

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
  dict: Dict["private"]["_navigation"] & Dict["private"]["general"];
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
        <Logo
          className={cn(
            "w-9 h-9 ml-2.5",
            isMenuHidden.desktop && "absolute opacity-0"
          )}
        />
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
          action={() =>
            startTransition(async () => {
              const res = await signOut();
              if (res?.error) {
                toast({
                  type: "error",
                  message: dict._error,
                });
              }
            })
          }
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
              <Hatch size={12} stroke={1.5} />
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
