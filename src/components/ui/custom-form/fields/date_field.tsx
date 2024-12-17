import { Input } from "~/components/ui/input";
import { type FormFieldProps } from "../types";

export function DateField({ inputProps, error, id }: FormFieldProps) {
	return (
		<Input
			id={id}
			type="date"
			className={error ? "border-destructive" : ""}
			{...inputProps}
		/>
	);
}
