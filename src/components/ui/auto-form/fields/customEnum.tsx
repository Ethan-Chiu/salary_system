import { isNumber } from "~/lib/utils/checkType";
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
	const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)
		._def.values;
	const options = baseValues.map((v: any) => {
		return { value: v, label: v };
	});
	const selectRef = useRef<HTMLSelectElement>(null);

	return (
		<FormItem>
			<FormLabel>
				{label}
				{isRequired && <span className="text-destructive"> *</span>}
			</FormLabel>
			<FormControl>
				<select
					ref={selectRef}
					value={field.value}
					defaultValue={""}
					onChange={(e) => {
						console.log(e.target.value);
						field.onChange(e);
					}}
					className="hidden"
				>
					<option value={""} disabled className="hidden">
						Select an option
					</option>
					{options.map((option: any, index: number) => (
						<option
							key={option.value + index.toString()}
							value={option.value}
							className={
								"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							}
						>
							{option.label}
						</option>
					))}
				</select>
			</FormControl>
			<CustomSelect
				options={baseValues}
				onSelect={(selectedOption) => {
					// Handle the selected option and update the hidden select/option
					// if (selectRef.current) {
						selectRef.current!.value = selectedOption;
						const event = new Event('change', { bubbles: true });
						selectRef.current!.dispatchEvent(event);
					// field.onChange({
					// 	target: { value: selectedOption },
					// } as React.ChangeEvent<HTMLSelectElement>);
					// console.log(field.value);
					// }
				}}
				defaultValue={
					isNumber(field.value) ? field.value.toString() : field.value
				}
			/>
			{fieldConfigItem.description && (
				<FormDescription>{fieldConfigItem.description}</FormDescription>
			)}
			<FormMessage />
		</FormItem>
	);
}

interface CustomSelectProps {
	options: string[];
	onSelect: (selectedOption: string) => void; // Callback to handle the selected option
	defaultValue?: string;
}

function CustomSelect({ options, onSelect, defaultValue }: CustomSelectProps) {
	const [selectedOption, setSelectedOption] = useState<string>(
	  defaultValue || "Select an option"
	);
	const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const selectContainerRef = useRef<HTMLDivElement>(null);
  
	const toggleDropdown = () => {
	  setDropdownOpen(!isDropdownOpen);
	};
  
	const selectOption = (option: string) => {
	  setSelectedOption(option);
	  setDropdownOpen(false);
	  onSelect(option); // Call the callback function to handle the selected option
	};
  
	const handleClickOutside = (event: MouseEvent) => {
	  if (
		selectContainerRef.current &&
		!selectContainerRef.current.contains(event.target as Node)
	  ) {
		setDropdownOpen(false);
	  }
	};
  
	useEffect(() => {
	  // Update selectedOption when defaultValue changes
	  setSelectedOption(defaultValue || "Select an option");
	}, [defaultValue]);
  
	useEffect(() => {
	  document.addEventListener("mousedown", handleClickOutside);
  
	  return () => {
		document.removeEventListener("mousedown", handleClickOutside);
	  };
	}, []);
  
	return (
	  <div ref={selectContainerRef} className="relative">
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
			  <svg
				className="-mr-1 ml-2 h-5 w-5"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			  >
				<path
				  fillRule="evenodd"
				  d="M10 12l-8-8 1.5-1.5L10 9l6.5-6.5L18 4l-8 8z"
				  clipRule="evenodd"
				/>
			  </svg>
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