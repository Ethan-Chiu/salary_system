import { type FormFieldProps } from "../types";
import { DatePicker } from "../../date-picker";

export function DateField({
	field,
	inputProps,
	error,
	id,
	value,
}: FormFieldProps) {
	const { onChange }: { onChange: (event: any) => any } = inputProps;

	return (
		<DatePicker
			date={value}
			setDate={(date: Date | undefined) => {
				const event = {
					target: {
						name: field.key,
						value: date,
					},
				};
				onChange?.(event);
			}}
		/>
	);
}

/* className={error ? "border-destructive" : ""} */
