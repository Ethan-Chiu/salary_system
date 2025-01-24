import { FunctionMenu } from "~/components/table_functions/function_menu/function_menu";
import { usePaymentFunctionContext } from "./employee_payment_provider";
import { FunctionMenuOption } from "~/components/table_functions/function_menu/function_menu_option";
import { api } from "~/utils/api";
import { employeePaymentSchema } from "../../schemas/configurations/employee_payment_schema";
import { z } from "zod";
import { ConfirmDialog } from "~/components/table_functions/confirm_dialog";
import { TableFunctionSheet } from "~/components/table_functions/function_sheet/function_sheet";
import {
	buildStandardFormProps,
	StandardForm,
} from "~/components/form/default/form_standard";
import { zodOptionalDate } from "~/lib/utils/zod_types";

export function EmployeePaymentFunctionMenu() {
	const { setMode } = usePaymentFunctionContext();

	return (
		<FunctionMenu>
			<FunctionMenuOption.ExcelDownload
				onClick={() => setMode("excel_download")}
			/>
			<FunctionMenuOption.ExcelUpload
				onClick={() => setMode("excel_upload")}
			/>
			<FunctionMenuOption.Initialize
				onClick={() => setMode("initialize")}
			/>
			<FunctionMenuOption.AutoCalculate
				onClick={() => setMode("auto_calculate")}
			/>
		</FunctionMenu>
	);
}

export function EmployeePaymentFunctions() {
	const { data, open, setOpen, mode } = usePaymentFunctionContext();

	// TODO: move
	const ctx = api.useUtils();
	const updateEmployeePayment =
		api.employeePayment.updateEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.invalidate();
			},
		});
	const createEmployeePayment =
		api.employeePayment.createEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.invalidate();
			},
		});
	const deleteEmployeePayment =
		api.employeePayment.deleteEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.invalidate();
			},
		});

	const createFormSchema = employeePaymentSchema.omit({ id: true });
	const createForm = buildStandardFormProps({
		formSchema: createFormSchema,
		formSubmit: (d) => {
			createEmployeePayment.mutate(d);
			setOpen(false);
		},
		buttonText: "create",
		defaultValue: data ? createFormSchema.safeParse(data).data : undefined,
		closeSheet: () => setOpen(false),
	});

	const updateForm = buildStandardFormProps({
		formSchema: employeePaymentSchema,
		formConfig: [{ key: "id", config: { hidden: true } }],
		formSubmit: (d) => {
			updateEmployeePayment.mutate(d);
			setOpen(false);
		},
		buttonText: "update",
		defaultValue: data
			? employeePaymentSchema.safeParse(data).data
			: undefined,
		closeSheet: () => setOpen(false),
	});

	return (
		<>
			<ConfirmDialog
				open={open && mode === "delete"}
				onOpenChange={setOpen}
				onClick={() =>
					data && deleteEmployeePayment.mutate({ id: data.id })
				}
				data={
					employeePaymentSchema
						.merge(z.object({ end_date: zodOptionalDate() }))
						.safeParse(data).data
				}
			/>
			<TableFunctionSheet
				openSheet={open && mode !== "delete"}
				setOpenSheet={setOpen}
				mode={mode}
				tableType={"TableEmployeePayment"}
			>
				{mode === "create" ? (
					<StandardForm {...createForm} />
				) : (
					<StandardForm {...updateForm} />
				)}
			</TableFunctionSheet>
		</>
	);
}