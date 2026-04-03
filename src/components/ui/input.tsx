import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validation?: {
    isValid?: boolean;
    message?: string;
  };
  showValidation?: boolean;
  isTouched?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, validation, showValidation = true, isTouched = false, ...props }, ref) => {
    const isValid = validation?.isValid;
    const showStatus = showValidation && typeof isValid !== 'undefined' && isTouched;
    
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            // Base styles
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "transition-all duration-200 ease-in-out",
            
            // Focus state
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
            
            // Validation states - only show when touched
            showStatus && isValid && "border-emerald-500/50 focus-visible:ring-emerald-500/20",
            showStatus && !isValid && "border-red-500/50 focus-visible:ring-red-500/20",
            
            // Icon padding
            showStatus && "pr-10",
            
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            
            className
          )}
          ref={ref}
          aria-invalid={showStatus && !isValid}
          {...props}
        />
        
        {/* Validation Icons */}
        {showStatus && (
          <div 
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
              "transition-opacity duration-200",
              isTouched ? "opacity-100" : "opacity-0"
            )}
          >
            {isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 transition-transform duration-200" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 transition-transform duration-200" />
            )}
          </div>
        )}
        
        {/* Validation Message */}
        {showStatus && validation?.message && !isValid && (
          <p 
            className={cn(
              "text-xs text-red-500 mt-1 ml-1",
              "transition-all duration-200",
              isTouched ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            )}
          >
            {validation.message}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
