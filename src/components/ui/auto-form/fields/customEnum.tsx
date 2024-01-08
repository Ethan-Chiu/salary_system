import { isNumber } from "~/pages/develop_parameters/utils/checkType";
import { Check, ChevronDown } from "lucide-react";
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../form";
import { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import React, { forwardRef, ReactNode } from "react";
import { cn } from "~/lib/utils";
import Select from "react-select";

export default function AutoFormEnum({
	label,
	isRequired,
	field,
	fieldConfigItem,
	zodItem,
}: AutoFormInputComponentProps) {
	const [selectedValue, setSelectedValue] = useState<(typeof baseValues)[0]>(
		field.value
	);

	const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)
		._def.values;

	const optionClassName =
		"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

	const options = baseValues.map((v: any) => {
		return { value: v, label: v };
	});

	return (
		<FormItem>
			<FormLabel>
				{label}
				{isRequired && <span className="text-destructive"> *</span>}
			</FormLabel>
			<FormControl>
				{/* <select
					value={field.value}
					defaultValue={""}
					onChange={field.onChange}
					className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{console.log(options)}
					<option value={""} disabled className="hidden">
						Select an option
					</option>
					{options.map((option: any, index: number) => (
						<>
							<option
								key={option.value + index.toString()}
								value={option.value}
								// className={optionClassName}
								className={
									"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								}
							>
								{option.label}
							</option>
						</>
					))}
				</select> */}
				<CustomSelect options={baseValues} onChange={field.onChange} />
			</FormControl>
			{fieldConfigItem.description && (
				<FormDescription>{fieldConfigItem.description}</FormDescription>
			)}
			<FormMessage />
		</FormItem>
	);
}

interface CustomSelectProps {
	options: string[];
	onChange: (selectedOption: string) => void;
}

function CustomSelect({ options, onChange }: CustomSelectProps) {
	const [selectedOption, setSelectedOption] = useState<string>("Select an option");
	const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const selectRef = useRef<HTMLDivElement>(null);
  
	const toggleDropdown = () => {
	  setDropdownOpen(!isDropdownOpen);
	};
  
	const selectOption = (option: string) => {
	  setSelectedOption(option);
	  setDropdownOpen(false);
	  onChange(option);
	};
  
	const handleClickOutside = (event: MouseEvent) => {
	  if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
		setDropdownOpen(false);
	  }
	};
  
	useEffect(() => {
	  document.addEventListener("mousedown", handleClickOutside);
  
	  return () => {
		document.removeEventListener("mousedown", handleClickOutside);
	  };
	}, []);
  
	return (
	  <div ref={selectRef} className="relative">
		<div>
		  <span className="rounded-md shadow-sm">
			<button
			  type="button"
			  onClick={toggleDropdown}
			  className="inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			  id="options-menu"
			  aria-haspopup="true"
			  aria-expanded="true"
			>
			  {selectedOption}
			  <ChevronDown className="h-4 w-4 opacity-50" />
			</button>
		  </span>
		</div>
  
		{isDropdownOpen && (
		  <div className="absolute left-0 z-10 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
			<div
			  className="py-1"
			  role="menu"
			  aria-orientation="vertical"
			  aria-labelledby="options-menu"
			>
			  {options.map((option: string, index: number) => (
				<div
				  key={index}
				  onClick={() => selectOption(option)}
				  className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				  role="menuitem"
				  style={{ width: "100%" }}
				>
				  {option}
				</div>
			  ))}
			</div>
		  </div>
		)}
	  </div>
	);
  }
  