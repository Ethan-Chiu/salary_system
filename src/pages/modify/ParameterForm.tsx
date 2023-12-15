import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { isNumber, isDate, isString } from "../develop_parameters/utils/checkType";
import { useRouter } from 'next/router';


export function SingleParameterSettings({ formSchema, original_data, updateFunction, createFunction, deleteFunction, returnPage, mode, disabled }: any) {
	const router = useRouter();
	console.log(mode);
	return (
		<AutoForm
			formSchema={formSchema}
			onSubmit={(data) => {
				if(mode === "create") {
					console.log(mode)
				}
				else {
					console.log(original_data);
					console.log(data);
					updateFunction(
						{
							...data,
							id: original_data.id,
						}
					)
					returnPage(0);	
				}
			}}
		>
			{(mode === "create")?(<>
				<Button
					variant={"destructive"}
					onClick={() => {
						console.log("Cancel");
						router.back();
					}}
				>
					Cancel
				</Button>
				&nbsp; &nbsp; &nbsp;
				<AutoFormSubmit>Create</AutoFormSubmit>
			</>):(<>
				<Button
					variant={"destructive"}
					onClick={() => {
						console.log("delete data id = %d",original_data.id)
						deleteFunction({id: original_data.id});
					}}
					disabled = {disabled}
				>
					Delete
				</Button>
				&nbsp; &nbsp; &nbsp;
				<AutoFormSubmit>Update</AutoFormSubmit>
			</>)}
			
		</AutoForm>
	);
}
