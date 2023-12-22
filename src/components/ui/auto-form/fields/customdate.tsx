import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../form";

import { Input } from "../../input";
import { AutoFormInputComponentProps } from "../types";

export default function AutoFormDate({
	label,
	isRequired,
	field,
	fieldConfigItem,
	fieldProps,
}: AutoFormInputComponentProps) {
    function convertDate(inputDate: any){
        let ans = null;
        try {
            ans = inputDate.toISOString().split("T")[0] ?? "";
        }
        catch {
            ans = inputDate;
        }   
        return ans;
    }
	return (
		<FormItem>
			<FormLabel>
				{label}
				{isRequired && <span className="text-destructive"> *</span>}
			</FormLabel>
			<FormControl>
				<Input
					type="date"
					onChange={field.onChange}
					defaultValue={convertDate(field.value)}
				/>
				{/* <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    {...fieldProps}
                /> */}
			</FormControl>
			{fieldConfigItem.description && (
				<FormDescription>{fieldConfigItem.description}</FormDescription>
			)}
			<FormMessage />
		</FormItem>
	);
}
