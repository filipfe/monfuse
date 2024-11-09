"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { VisuallyHidden } from "react-aria";
import { Drawer } from "vaul";

export default function MobileDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger className="flex flex-col gap-1 mr-5">
        <span className="sr-only">Open main menu</span>
        <div className="bg-current h-0.5 w-5 rounded-full" />
        <div className="bg-current h-0.5 w-5 rounded-full" />
        <div className="bg-current h-0.5 w-5 rounded-full" />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-white h-fit fixed bottom-0 left-0 right-0 outline-none z-50">
          <VisuallyHidden>
            <Drawer.Title>Main Menu Content</Drawer.Title>
          </VisuallyHidden>
          <div className="px-4 py-3">
            <Drawer.Handle className="w-12 mb-3" />
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
