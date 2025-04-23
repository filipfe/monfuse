import { Ring } from "ldrs/react";

export default function Loading() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Ring size={44} />
    </div>
  );
}
