import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { PencilLine, PenSquare, Plus, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { PropsWithChildren } from "react";
import { TFunction } from "i18next";

export type FunctionsItem = { create: boolean; update: boolean; delete: boolean };
export type FunctionsItemKey = keyof FunctionsItem;

interface FunctionsComponentProps<TMode> extends PropsWithChildren {
    t: TFunction<[string], undefined>,
    open: boolean,
    setOpen: (open: boolean) => void,
    mode: TMode,
    setMode: (mode: TMode) => void,
    functionsItem: FunctionsItem,
}

export function FunctionsComponent<TMode>({ children, t, open, setOpen, mode, setMode, functionsItem }: FunctionsComponentProps<TMode>) {
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden h-8 lg:flex"
                    >
                        <PencilLine className="cursor-pointer stroke-[1.5]" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[120px]">
                    {(["create", "update", "delete"] as FunctionsItemKey[]).map((key: FunctionsItemKey) => (
                        <SheetTrigger
                            className="w-full"
                            onClick={() => {
                                setMode(key as TMode);
                                setOpen(true);
                            }}
                            disabled={!functionsItem[key]}
                        >
                            <DropdownMenuItem className="cursor-pointer" disabled={!functionsItem[key]}>
                                {key == "create" && <Plus className={cn("mr-2 h-4 w-4", !functionsItem[key] && "stroke-muted-foreground")} />}
                                {key == "update" && <PenSquare className={cn("mr-2 h-4 w-4", !functionsItem[key] && "stroke-muted-foreground")} />}
                                {key == "delete" && <Trash2 className={cn("mr-2 h-4 w-4", !functionsItem[key] && "stroke-muted-foreground")} />}
                                <span className={cn(!functionsItem[key] && "text-muted-foreground")}>{t(`button.${key}`)}</span>
                            </DropdownMenuItem>
                        </SheetTrigger>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <SheetContent className="w-[50%]">
                {children}
            </SheetContent>
        </Sheet>
    );
}