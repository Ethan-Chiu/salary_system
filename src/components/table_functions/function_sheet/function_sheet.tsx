import { cn } from "~/lib/utils";
import { type HTMLAttributes, type PropsWithChildren } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "~/components/ui/sheet";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import {
	type TableEnum,
	getTableNameKey,
} from "~/pages/employees/components/context/data_table_enum";
import { modeDescription } from "~/lib/utils/helper_function";

interface TableFunctionSheetProps extends HTMLAttributes<HTMLDivElement> {
  openSheet: boolean,
  setOpenSheet: (open: boolean) => void,
  mode: string; // TODO:
	tableType: TableEnum;
}

export function TableFunctionSheet({
  openSheet,
  setOpenSheet,
	tableType,
  mode,
	className,
  children,
}: PropsWithChildren<TableFunctionSheetProps>) {


	const { t } = useTranslation(["common", "nav"]);

/* open && mode !== "delete" */

// Shouldn't need the sheet
// Or remove the sheet in the context (maybe better)
	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Sheet open={openSheet} onOpenChange={setOpenSheet}>
				{/* Sheet */}
				<SheetContent className="w-[50%]">
					{/* {mode !== "none" && ( */}
						{/* <> */}
							<SheetHeader>
								<SheetTitle>
									{`${t(`button.${mode}`)!}${t(
										"button.form"
									)} (${t(getTableNameKey(tableType))})`}
								</SheetTitle>
								<SheetDescription>
									{modeDescription(t, mode)}
								</SheetDescription>
							</SheetHeader>
							<ScrollArea className="h-full w-full">
                {children}
								<ScrollBar orientation="horizontal" />
							</ScrollArea>
						{/* </> */}
					{/* )} */}
				</SheetContent>
			</Sheet>
		</div>
	);
}


