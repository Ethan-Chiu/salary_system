import { modeDescription } from "~/lib/utils/helper_function";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { type TFunction } from "i18next";
import ParameterToolbarFunctionsProvider from "~/pages/parameters/components/function_sheet/parameter_functions_context";
import { ParameterForm } from "~/pages/parameters/components/function_sheet/parameter_form";
import { PropsWithChildren, useContext } from "react";
import dataTableContext, { FunctionMode } from "../context/data_table_context";
import { getTableNameKey } from "../context/data_table_enum";
import { getSchema } from "../../schemas/get_schemas";
import { ScrollArea } from "~/components/ui/scroll-area";

export type FunctionsItem = {
    create: boolean;
    update: boolean;
    delete: boolean;
};
export type FunctionsItemKey = keyof FunctionsItem;

interface FunctionsSheetProps extends PropsWithChildren {
    t: TFunction<[string], undefined>;
    period_id: number;
}

export function FunctionsSheet({
    t,
    period_id,
    children,
}: FunctionsSheetProps) {
    const { open, setOpen, mode, selectedTableType } = useContext(dataTableContext);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {children}
            <SheetContent className="w-[50%] px-12 py-6">
                <ScrollArea className="h-full w-full">
                    <SheetHeader>
                        <SheetTitle>
                            {`${t(`button.${mode}`)!}${t("button.form")} (${t(`${getTableNameKey(selectedTableType)}`)})`}
                        </SheetTitle>
                        <SheetDescription>
                            {modeDescription(t, mode as string)}
                        </SheetDescription>
                    </SheetHeader>
                    <ParameterToolbarFunctionsProvider
                        selectedTableType={selectedTableType}
                        period_id={period_id}
                    >
                        <ParameterForm
                            formSchema={getSchema(selectedTableType)}
                            mode={mode}
                            closeSheet={() => setOpen(false)}
                        />
                    </ParameterToolbarFunctionsProvider>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

