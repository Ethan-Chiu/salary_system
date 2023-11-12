import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { isNumber, isDate, isString } from "../develop_parameters/utils/checkType";

export function SingleParameterSettings({ formSchema, original_data, updateFunction, deleteFunction, returnPage }: any) {
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
			
			<Button
				variant={"destructive"}
				onClick={() => {
					console.log("delete data id = %d",original_data.id)
					deleteFunction({id: original_data.id});
				}}
			>
				Delete
			</Button>
			&nbsp; &nbsp; &nbsp;
			<AutoFormSubmit>Update</AutoFormSubmit>
		</AutoForm>
	);
}
