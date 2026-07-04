import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-dark-400 md:flex">
      <span className="font-mono text-xs">Scroll</span>
      <ChevronDown className="h-4 w-4 animate-bounce" />
    </div>
  );
}
