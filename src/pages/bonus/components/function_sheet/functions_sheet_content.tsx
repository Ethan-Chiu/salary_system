import { modeDescription } from "~/lib/utils/helper_function";
import {
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "~/components/ui/sheet";
import { type TFunction } from "i18next";
import { type PropsWithChildren, useContext } from "react";
import dataTableContext from "../context/data_table_context";
import { getTableNameKey } from "../context/data_table_enum";
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

export function FunctionsSheetContent({
	t,
	period_id,
	children,
}: FunctionsSheetProps) {
	const { mode, selectedTableType } = useContext(dataTableContext);
	return (
		<SheetContent className="w-[50%] px-10 py-6">
			<ScrollArea className="h-full w-full px-2">
				<SheetHeader>
					<SheetTitle>
						{`${t(`button.${mode}`)!}${t("button.form")} (${t(
							`${getTableNameKey(selectedTableType)}`
						)})`}
					</SheetTitle>
					<SheetDescription>
						{modeDescription(t, mode as string)}
					</SheetDescription>
				</SheetHeader>
				{children}
			</ScrollArea>
		</SheetContent>
	);
}
