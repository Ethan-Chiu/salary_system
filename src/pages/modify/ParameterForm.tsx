import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import * as z from "zod";

export function SingleParameterSettings({ formSchema, original_data, updateFunction }: any) {
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
			}}
		>
			<AutoFormSubmit>Send now</AutoFormSubmit>
		</AutoForm>
	);
}
