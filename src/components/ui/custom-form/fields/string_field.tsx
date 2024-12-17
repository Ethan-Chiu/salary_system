import { Input } from "~/components/ui/input";
import { type FormFieldProps } from "../types";

export function StringField({ inputProps, error, id }: FormFieldProps) {
	return (
		<Input
			id={id}
			className={error ? "border-destructive" : ""}
			{...inputProps}
		/>
	);
}
