import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-allin-orange/20 bg-allin-dark/5 dark:bg-allin-bg-dark-3 px-3 py-2 text-base text-allin-white ring-offset-allin-dark file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-allin-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-allin-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }