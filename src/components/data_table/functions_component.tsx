import { DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { PencilLine, PenSquare, Plus, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { type TFunction } from "i18next";
import { type DataWithFunctions, type FunctionsItem } from "~/pages/parameters/components/context/data_table_context";

export type FunctionsItemKey = keyof FunctionsItem;

interface FunctionsComponentProps<TMode, TData extends object> {
    t: TFunction<[string], undefined>;
    setOpen: (open: boolean) => void;
    setMode: (mode: TMode) => void;
    data: TData & DataWithFunctions;
    setData: (data: TData & DataWithFunctions) => void;
}

export function FunctionsComponent<TMode, TData extends object>({
    t,
    setOpen,
    setMode,
    data,
    setData,
}: FunctionsComponentProps<TMode, TData>) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 lg:flex"
                >
                    <PencilLine className="cursor-pointer stroke-[1.5]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[120px]">
                {(["creatable", "updatable", "deletable"] as FunctionsItemKey[]).map(
                    (key: FunctionsItemKey) => {
                        const disabled = data ? (data.functions ? !data.functions[key] : true) : true;
                        const mode = key == "creatable" ? "create" : key == "updatable" ? "update" : "delete"
                        return (
                            <SheetTrigger
                                key={key}
                                className="w-full"
                                onClick={() => {
                                    setMode(mode as TMode);
                                    setData(data);
                                    setOpen(true);
                                }}
                                disabled={disabled}
                            >
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    disabled={disabled}
                                >
                                    {key == "creatable" && (
                                        <Plus
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                disabled &&
                                                "stroke-muted-foreground"
                                            )}
                                        />
                                    )}
                                    {key == "updatable" && (
                                        <PenSquare
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                disabled &&
                                                "stroke-muted-foreground"
                                            )}
                                        />
                                    )}
                                    {key == "deletable" && (
                                        <Trash2
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                disabled &&
                                                "stroke-muted-foreground"
                                            )}
                                        />
                                    )}
                                    <span
                                        className={cn(
                                            disabled &&
                                            "text-muted-foreground"
                                        )}
                                    >
                                        {t(`button.${mode}`)}
                                    </span>
                                </DropdownMenuItem>
                            </SheetTrigger>
                        )
                    }
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

