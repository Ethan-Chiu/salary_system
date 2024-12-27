import { type z } from "zod";
import { useContext } from "react";
import { parameterToolbarFunctionsContext } from "./parameter_functions_context";
import { type FormConfig } from "~/components/ui/custom-form/types";
import dataTableContext, { type FunctionMode } from "../context/data_table_context";
import { StandardForm } from "~/components/form/default/form_standard";

interface ParameterFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	formConfig?: FormConfig<SchemaType>;
	formSubmit?: (data: z.infer<SchemaType>) => void;
	mode: FunctionMode;
	closeSheet: () => void;
}

export function ParameterForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	formConfig,
	formSubmit,
	mode,
	closeSheet,
}: ParameterFormProps<SchemaType>) {
	const functions = useContext(parameterToolbarFunctionsContext);
	const { data } = useContext(dataTableContext);
	const createFunction = functions.createFunction!;
	const updateFunction = functions.updateFunction!;

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		console.log(mode, data);
		if (mode === "create") {
			createFunction.mutate(data);
		} else if (mode === "update") {
			console.log(data);
			updateFunction.mutate({
				...data,
				id: data.id,
			});
		}
		closeSheet();
	};

	return (
		<StandardForm
			formSchema={formSchema}
			formConfig={formConfig}
			formSubmit={onSubmit}
			defaultValue={data}
			button_text={mode}
			closeSheet={closeSheet}
		/>
	);
}
