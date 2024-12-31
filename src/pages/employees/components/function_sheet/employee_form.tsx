import { type z } from "zod";
import { useContext } from "react";
import { type FunctionMode } from "./data_table_functions";
import { employeeToolbarFunctionsContext } from "./employee_functions_context";
import { StandardForm } from "~/components/form/default/form_standard";
import { type FormConfig } from "~/components/ui/custom-form/types";

interface EmployeeFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	formConfig?: FormConfig<SchemaType>;
	mode: FunctionMode;
	formSubmit?: (data: z.infer<SchemaType>) => void;
	closeSheet: () => void;
	columns: any;
}

export function EmployeeForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	formConfig,
	mode,
	columns,
	closeSheet,
}: EmployeeFormProps<SchemaType>) {
	const functions = useContext(employeeToolbarFunctionsContext);
	const updateFunction = functions.updateFunction!;
	const createFunction = functions.createFunction!;

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		if (mode === "create") {
			createFunction.mutate(data);
		} else if (mode === "update") {
			updateFunction.mutate(data);
		}
		closeSheet();
	};

	// Create or update an entry
	return (
		<StandardForm
			formSchema={formSchema}
			formConfig={formConfig}
			formSubmit={onSubmit}
			/* defaultValue={data} */
			button_text={mode}
			closeSheet={closeSheet}
		/>
	);
}
