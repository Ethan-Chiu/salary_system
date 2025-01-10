import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
} from "~/components/ui/select";
import { type DropdownProps } from "react-day-picker";
import { cn } from "~/lib/utils";

export function CustomCalendarDropdown({
	value,
	onChange,
	children,
  className,
	...props
}: DropdownProps) {
	const options = React.Children.toArray(children) as React.ReactElement<
		React.HTMLProps<HTMLOptionElement>
	>[];
	const selected = options.find((child) => child.props.value === value);
	const handleChange = (value: string) => {
		const changeEvent = {
			target: { value },
		} as React.ChangeEvent<HTMLSelectElement>;
		onChange?.(changeEvent);
	};
	return (
		<Select
			value={value?.toString()}
			onValueChange={(value) => {
				handleChange(value);
			}}
		>
			<SelectTrigger className={cn("pr-1.5 focus:ring-0", className)}>
				<SelectValue>{selected?.props?.children}</SelectValue>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options.map((option, id: number) => (
						<SelectItem
							key={`${option.props.value?.toString()}-${id}`}
							value={option.props.value?.toString() ?? ""}
						>
							{option.props.children}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
