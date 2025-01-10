import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import GeneralTable from "~/components/table_functions/general_table";
import { z } from "zod";
import { zodOptionalDate } from "~/lib/utils/zod_types";
import { employeeToolbarFunctionsContext } from "./employee_functions_context";
import { useTrustFunctionContext } from "../../tables/employee_trust/employee_trust_provider";

export function ConfirmDialog<SchemaType extends z.AnyZodObject>({
	open,
	onOpenChange,
	schema,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	schema: SchemaType;
}) {
	const { t } = useTranslation();
	const { data } = useTrustFunctionContext();

	const displayData = schema
		.omit({ id: true })
		.merge(z.object({ end_date: zodOptionalDate() }))
		.safeParse(data).data;

	const functions = useContext(employeeToolbarFunctionsContext);
	const deleteFunction = functions.deleteFunction!;

	return (
		<Dialog open={open} onOpenChange={onOpenChange} aria-hidden={false}>
			<DialogContent className="p-0 sm:max-w-[425px]">
				<ScrollArea className="max-h-[80vh] w-full">
					<div className="p-12">
						<DialogHeader className="pb-12">
							<DialogTitle>{t("others.check_data")}</DialogTitle>
						</DialogHeader>
						<GeneralTable data={displayData ?? {}} />
						<DialogFooter className="pt-12">
							<DialogClose asChild>
								<Button
									onClick={() => {
										deleteFunction.mutate({
											id: data.id,
										});
									}}
								>
									{t("button.delete")}
								</Button>
							</DialogClose>
						</DialogFooter>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
