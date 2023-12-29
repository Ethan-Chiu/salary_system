import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../select";
import { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";
import * as z from "zod";

export default function AutoFormEnum({
	label,
	isRequired,
	field,
	fieldConfigItem,
	zodItem,
}: AutoFormInputComponentProps) {
	const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)
		._def.values;
    
    const optionClassName = "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"

	const options = baseValues.map((v: any) => {
		return { value: v, label: v };
	}) 

	return (
		<FormItem>
			<FormLabel>
				{label}
				{isRequired && <span className="text-destructive"> *</span>}
			</FormLabel>
			<FormControl>
				<select
                    value={field.value}
                    defaultValue={""}
                    onChange={field.onChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value={""} disabled>
                        Select an option
                    </option>
					{options.map((option: any) => (
                        <>
						<option
                            key={option.value}
                            value={option.value}
                            className={optionClassName}
                        >
							{option.label}
						</option>
                        </>
					))}
				</select>
				{/* <Select
					onValueChange={field.onChange}
					defaultValue={field.value}
				>
					<SelectTrigger>
						<SelectValue
							className="w-full"
							placeholder={
								fieldConfigItem.inputProps?.placeholder
							}
						>
							{field.value
								? field.value
								: "Select an option"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{baseValues.map((value: any) => (
							<SelectItem value={value} key={value}>
								{value}
							</SelectItem>
						))}
					</SelectContent>
				</Select> */}
			</FormControl>
			{fieldConfigItem.description && (
				<FormDescription>{fieldConfigItem.description}</FormDescription>
			)}
			<FormMessage />
		</FormItem>
	);
}
