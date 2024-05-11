import { HTMLAttributes } from "react";

import { cn } from "./utils";
import { Spinner } from "@nextui-org/react";

export function Button({
  className,
  loading,
  disabled,
  text,
  ...props
}: {
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  text: string;
} & HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "flex items-center gap-2 rounded-medium px-4 py-2 text-base bg-primary text-primary-foreground cursor-pointer hover:opacity-80",
        { "opacity-80 cursor-not-allowed": disabled },
        className
      )}
    >
      {loading && <Spinner color="current" size="sm"/>}
      {text}
    </button>
  );
}
