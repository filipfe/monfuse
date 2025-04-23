"use client";

import {
  BellRingIcon,
  LayersIcon,
  SlidersIcon,
  UserCogIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Dict } from "@/const/dict";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";

export default function SettingsTabs({
  dict,
}: {
  dict: Dict["private"]["_navigation"];
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Tabs className="mb-4" value={pathname}>
      <TabsList>
        <TabsTrigger value="/settings/account" asChild>
          <Link href="/settings/account">
            <UserCogIcon size={16} />
            {dict["settings/account"]}
          </Link>
        </TabsTrigger>
        <TabsTrigger value="/settings/preferences" asChild>
          <Link href="/settings/preferences">
            <SlidersIcon size={16} />
            {dict["settings/preferences"]}
          </Link>
        </TabsTrigger>
        <TabsTrigger value="/settings/subscription" asChild>
          <Link href="/settings/subscription">
            <LayersIcon size={16} />
            {dict["settings/subscription"]}
          </Link>
        </TabsTrigger>
        <TabsTrigger value="/settings/notifications" asChild>
          <Link href="/settings/notifications">
            <BellRingIcon size={16} />
            {dict["settings/notifications"]}
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
