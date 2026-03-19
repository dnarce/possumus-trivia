import * as React from "react";

import { cn } from "@/lib/utils";

function GlassCard({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative isolate rounded-[16px] border border-[rgba(255,255,255,0.35)] bg-[rgba(255,255,255,0.2)] shadow-[0_10px_30px_rgba(0,0,0,0.204)] backdrop-blur-md backdrop-saturate-[1.4] transition-all hover:bg-[rgba(255,255,255,0.22)] hover:backdrop-blur-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.218)]",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 z-0 rounded-[16px] bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.02))]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export { GlassCard };
