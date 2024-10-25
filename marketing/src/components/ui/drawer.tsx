"use client";

import { VisuallyHidden } from "react-aria";
import { Drawer } from "vaul";

export default function MobileDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Drawer.Root>
      <Drawer.Trigger className="flex flex-col gap-1 mr-3">
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