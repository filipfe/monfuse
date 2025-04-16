"use client";

import { createClient } from "@/utils/supabase/client";

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Toast from "../../ui/toast";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { Dict } from "@/const/dict";
import { Hatch } from "ldrs/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type Props = {
  dict: Dict["private"]["operations"]["operation-table"]["modal"];
  docPath: string | null;
  setDocPath: Dispatch<SetStateAction<string | null>>;
};

export default function DocModal({ dict, docPath, setDocPath }: Props) {
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState({
    url: true,
    image: true,
  });

  useEffect(() => {
    setMediaUrl("");
    if (!docPath) return;
    setIsLoading({ url: true, image: true });
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.storage
        .from("docs")
        .createSignedUrl(docPath, 60);
      if (data) {
        setMediaUrl(data.signedUrl);
        setIsLoading((prev) => ({ ...prev, url: false }));
      } else {
        toast.custom((t) => (
          <Toast {...t} message={dict._error} type="error" />
        ));
        setDocPath(null);
      }
    })();
  }, [docPath]);

  return (
    <Dialog open={!!docPath} onOpenChange={(open) => !open && setDocPath(null)}>
      <DialogContent>
        <DialogHeader className="space-y-0">
          <DialogTitle className="sr-only">Operation</DialogTitle>
          {mediaUrl && (
            <Button variant="outline" className="max-w-max" asChild>
              <Link href={`${mediaUrl}&download`}>
                <DownloadIcon size={16} /> {dict.button}
              </Link>
            </Button>
          )}
        </DialogHeader>
        <div className="relative flex items-center justify-center min-h-48 py-0 [&:has(+button)]:z-40">
          {isLoading.url || (isLoading.image && <Hatch size={32} />)}
          {mediaUrl && (
            <Image
              width={0}
              height={0}
              sizes="100vw"
              onLoad={() => setIsLoading((prev) => ({ ...prev, image: false }))}
              className={cn(
                "w-full h-auto rounded-md max-h-[80vh]",
                isLoading.image && "sr-only"
              )}
              src={mediaUrl}
              alt=""
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
