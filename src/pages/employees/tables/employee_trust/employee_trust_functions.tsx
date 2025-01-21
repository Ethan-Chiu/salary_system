import { useTrustFunctionContext } from "./employee_trust_provider";
import { FunctionMenu } from "~/components/table_functions/function_menu/function_menu";
import { FunctionMenuOption } from "~/components/table_functions/function_menu/function_menu_option";
import { ConfirmDialog } from "~/components/table_functions/confirm_dialog";
import { employeeTrustSchema } from "../../schemas/configurations/employee_trust_schema";
import { z } from "zod";
import { zodOptionalDate } from "~/lib/utils/zod_types";
import { api } from "~/utils/api";
import { TableFunctionSheet } from "~/components/table_functions/function_sheet/function_sheet";
import { StandardForm } from "~/components/form/default/form_standard";

export function EmployeeTrustFunctionMenu() {
	const { setMode } = useTrustFunctionContext();

	return (
		<FunctionMenu>
			<FunctionMenuOption.ExcelDownload
				onClick={() => setMode("excel_download")}
			/>
			<FunctionMenuOption.ExcelUpload onClick={() => setMode("excel_upload")} />
			<FunctionMenuOption.Initialize onClick={() => setMode("initialize")} />
			<FunctionMenuOption.AutoCalculate
				onClick={() => setMode("auto_calculate")}
			/>
		</FunctionMenu>
	);
}

export function EmployeeTrustFunctions() {
	const { data, open, setOpen, mode } = useTrustFunctionContext();

  // TODO: move
	const ctx = api.useUtils();
	const deleteEmployeeTrust =
		api.employeeTrust.deleteEmployeeTrust.useMutation({
			onSuccess: () => {
				void ctx.employeeTrust.invalidate();
			},
		});
  const updateEmployeeTrust =
		api.employeeTrust.updateEmployeeTrust.useMutation({
			onSuccess: () => {
				void ctx.employeeTrust.invalidate();
			},
		});
	const createEmployeeTrust =
		api.employeeTrust.createEmployeeTrust.useMutation({
			onSuccess: () => {
				void ctx.employeeTrust.invalidate();
			},
		});


	const schema =
		mode === "create"
			? employeeTrustSchema.omit({ id: true })
			: employeeTrustSchema;

	const onSubmit = (data: z.infer<typeof schema>) => {
		if (mode === "create") {
			createEmployeeTrust.mutate(data);
		} else if (mode === "update") {
			updateEmployeeTrust.mutate(data);
		}
		setOpen(false);
	};

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
			<TableFunctionSheet
				openSheet={open && mode !== "delete"}
				setOpenSheet={setOpen}
				mode={mode}
				tableType={"TableEmployeeTrust"}
			>
				<StandardForm
					formSchema={schema}
					formConfig={[{ key: "id", config: { hidden: true } }]}
          formSubmit={onSubmit}
					defaultValue={data}
					mode={mode}
					closeSheet={() => setOpen(false)}
				/>
			</TableFunctionSheet>
		</>
	);
}
