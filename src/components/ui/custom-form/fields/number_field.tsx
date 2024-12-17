import { Input } from "~/components/ui/input";
import { type FormFieldProps } from "../types";

export function NumberField({ inputProps, error, id }: FormFieldProps) {
	return (
		<Input
			id={id}
			type="number"
			className={error ? "border-destructive" : ""}
			{...inputProps}
		/>
	);
}
