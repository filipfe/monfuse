"use client";

import { HeroUIProvider } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

type IsMenuHidden = {
  mobile: boolean;
  desktop: boolean;
};

type MenuContextType = {
  isMenuHidden: IsMenuHidden;
  setIsMenuHidden: Dispatch<SetStateAction<IsMenuHidden>>;
};

export const MenuContext = createContext<MenuContextType>({
  isMenuHidden: {
    mobile: true,
    desktop: false,
  },
  setIsMenuHidden: null!,
});

export default function Providers({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: Settings;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuHidden, setIsMenuHidden] = useState<IsMenuHidden>({
    mobile: true,
    desktop: false,
  });

  useEffect(() => {
    setIsMenuHidden((prev) => ({ ...prev, mobile: true }));
  }, [pathname]);

  return (
    <HeroUIProvider navigate={router.push} locale={settings.language}>
      <MenuContext.Provider value={{ isMenuHidden, setIsMenuHidden }}>
        <div
          className={`max-w-screen h-full grid grid-rows-[64px_1fr] sm:grid-rows-[80px_1fr] ${
            isMenuHidden.desktop
              ? "sm:grid-cols-[6rem_1fr]"
              : "sm:grid-cols-[15rem_1fr]"
          } transition-[grid-template-columns]`}
        >
          {children}
        </div>
      </MenuContext.Provider>
    </HeroUIProvider>
  );
}
