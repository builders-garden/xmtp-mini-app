import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 462 462"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 231C1 103.422 104.422 0 232 0C359.495 0 458 101.5 461 230C461 271 447 305.5 412 338C382.424 365.464 332 369.5 295.003 349C268.597 333.767 248.246 301.326 231 277.5L199 326.5H130L195 229.997L132 135H203L231.5 184L259.5 135H331L266 230C266 230 297 277.5 314 296C331 314.5 362 315 382 295C403.989 273.011 408.912 255.502 409 230C409.343 131.294 330.941 52 232 52C133.141 52 53 132.141 53 231C53 329.859 133.141 410 232 410C245.674 410 258.781 408.851 271.5 406L283.5 456.5C265.401 460.558 249.778 462 232 462C104.422 462 1 358.578 1 231Z"
          fill="#FC4F37"
        />
      </svg>
    </div>
  );
};
