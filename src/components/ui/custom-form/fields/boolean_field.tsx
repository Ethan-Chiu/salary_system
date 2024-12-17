import { Checkbox } from "~/components/ui/checkbox";
import { type FormFieldProps } from "../types";
import { Label } from "~/components/ui/label";

export function BooleanField({
	field,
	label,
	id,
	inputProps,
	value,
}: FormFieldProps) {
	const { onChange }: { onChange: (event: any) => any } = inputProps;

	return (
		<div className="flex items-center space-x-2">
			<Checkbox
				id={id}
				onCheckedChange={(checked) => {
					// react-hook-form expects an event object
					const event = {
						target: {
							name: field.key,
							value: checked,
						},
					};
					!onChange ?? onChange(event);
				}}
				checked={value}
			/>
			<Label htmlFor={id}>
				{label}
				{field.required && <span className="text-destructive"> *</span>}
			</Label>
		</div>
	);
}
