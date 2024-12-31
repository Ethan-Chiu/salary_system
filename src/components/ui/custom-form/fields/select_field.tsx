import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { type FormFieldProps } from "../types";

export function SelectField({
	field,
	value,
	inputProps,
	error,
	id,
}: FormFieldProps) {
	const { onChange }: { onChange: (event: any) => any } = inputProps;

	const onValueChange = (v: string) => {
		const event = {
			target: {
				name: field.key,
				value: v,
			},
		};
		onChange?.(event);
	};

	return (
		<Select
			{...inputProps}
			onValueChange={onValueChange}
			defaultValue={value}
		>
			<SelectTrigger
				id={id}
				className={error ? "border-destructive" : ""}
			>
				<SelectValue placeholder="Select an option" />
			</SelectTrigger>
			<SelectContent>
				{(field.options ?? []).map(([key, label]) => (
					<SelectItem key={key} value={key}>
						{label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
