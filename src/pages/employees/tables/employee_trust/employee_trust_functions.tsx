import { useTrustFunctionContext } from "./employee_trust_provider";
import { DataTableFunctions } from "../../components/function_sheet/data_table_functions";
import { FunctionMenu } from "~/components/table_functions/function_menu/function_menu";
import { FunctionMenuOption } from "~/components/table_functions/function_menu/function_menu_option";
import { ConfirmDialog } from "~/components/table_functions/confirm_dialog";
import { employeeTrustSchema } from "../../schemas/configurations/employee_trust_schema";
import { z } from "zod";
import { zodOptionalDate } from "~/lib/utils/zod_types";
import { api } from "~/utils/api";

export function EmployeeTrustFunctionMenu() {
	const { setMode } = useTrustFunctionContext();

	return (
		<FunctionMenu>
			<FunctionMenuOption.ExcelDownload
				onClick={() => setMode("create")}
			/>
			<FunctionMenuOption.ExcelUpload onClick={() => setMode("create")} />
			<FunctionMenuOption.Initialize onClick={() => setMode("create")} />
			<FunctionMenuOption.AutoCalculate
				onClick={() => setMode("create")}
			/>
		</FunctionMenu>
	);
}

export function EmployeeTrustFunctions() {
	const { data, open, setOpen, mode } = useTrustFunctionContext();

	const ctx = api.useUtils();
	const deleteEmployeeTrust =
		api.employeeTrust.deleteEmployeeTrust.useMutation({
			onSuccess: () => {
				void ctx.employeeTrust.invalidate();
			},
		});

	return (
		<>
			<ConfirmDialog
				open={open && mode === "delete"}
				onOpenChange={setOpen}
				onClick={() =>
					data && deleteEmployeeTrust.mutate({ id: data.id })
				}
				data={
					employeeTrustSchema
						.merge(z.object({ end_date: zodOptionalDate() }))
						.safeParse(data).data
				}
			/>

			<DataTableFunctions
				openSheet={open}
				setOpenSheet={setOpen}
				mode={mode}
				tableType={"TableEmployeeTrust"}
			/>
		</>
	);
}
