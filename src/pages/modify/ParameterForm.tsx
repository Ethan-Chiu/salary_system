import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import * as z from "zod";
import { isNumber, isDate, isString } from "../develop_parameters/utils/checkType";

export function SingleParameterSettings({ formSchema, original_data, updateFunction, returnPage }: any) {
    console.log(original_data);
	return (
		<AutoForm
			formSchema={formSchema}
			onSubmit={(data) => {
                console.log(original_data);
				console.log(data);
                updateFunction(
                    {
                        ...data,
                        id: original_data.id,
                    }
                )
                returnPage(0);
			}}
		>
			<AutoFormSubmit>Send now</AutoFormSubmit>
		</AutoForm>
	);
}
