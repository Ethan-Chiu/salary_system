import { Plus, Minus } from "lucide-react";
import { Button } from "~/components/ui/button";

export function ChangeSheetSize({value, changeValue, description, level, type, minValue, maxValue}: any) {
    description = description ?? "";
    level = level ?? 5;
    minValue = minValue ?? 0;
    maxValue = maxValue ?? 100;
    const suffix = 
        (type === "percent") ? "%":
        (type === "value") ? "":
        "";
    return <>
        <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => changeValue(value - level)}
                disabled={value <= minValue}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-6xl font-bold tracking-tighter">
                  {value + suffix}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  {description}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => changeValue(value + level)}
                disabled={value >= maxValue}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            </div>
    
    </>
}