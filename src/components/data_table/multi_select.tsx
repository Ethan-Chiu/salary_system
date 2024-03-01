import * as React from "react";
import { X } from "lucide-react";
import { Command, CommandGroup, CommandItem } from "~/components/ui/command";
import { Badge } from "~/components/ui/badge";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "~/lib/utils";

export type OptionType = {
	label: string;
	value: string;
};

interface MultiSelectProps {
	options: OptionType[];
	onChange: React.Dispatch<React.SetStateAction<string[]>>;
	className?: string;
}

export function MultiSelect({
	options,
	onChange,
	className,
}: MultiSelectProps) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [selected, setSelected] = React.useState<OptionType[]>([]);
	const [inputValue, setInputValue] = React.useState("");

	const handleUnselect = React.useCallback(
		(opt: OptionType) => {
			setSelected((prev) => {
				const newSelected = prev.filter((s) => s.value !== opt.value);
				const values = newSelected.map((opt) => opt.value);
				onChange(values);
				return newSelected;
			});
		},
		[onChange]
	);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (input) {
				if (e.key === "Delete" || e.key === "Backspace") {
					if (input.value === "") {
						setSelected((prev) => {
							const newSelected = [...prev];
							newSelected.pop();
							const values = newSelected.map((opt) => opt.value);
							onChange(values);
							return newSelected;
						});
					}
				}
				// This is not a default behaviour of the <input /> field
				if (e.key === "Escape") {
					input.blur();
				}
			}
		},
		[onChange]
	);

	const selectables = options.filter(
		(opt) => !selected.some((sel) => sel.value === opt.value)
	);

	return (
		<Command
			onKeyDown={handleKeyDown}
			className={cn("overflow-visible bg-transparent", className)}
		>
			<div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
				<div className="flex flex-wrap gap-1">
					{selected.map((opt) => {
						return (
							<Badge key={opt.value} variant="secondary">
								{opt.label}
								<button
									className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleUnselect(opt);
										}
									}}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={() => handleUnselect(opt)}
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						);
					})}
					{/* Avoid having the "Search" Icon */}
					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder="Select frameworks..."
						className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
					/>
				</div>
			</div>
			<div className="relative mt-2">
				{open && selectables.length > 0 ? (
					<div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
						<CommandGroup className="h-full overflow-auto">
							{selectables.map((opt) => {
								return (
									<CommandItem
										key={opt.value}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onSelect={(_) => {
											setInputValue("");
											setSelected((prev) => {
												const newSelected = [
													...prev,
													opt,
												];
												const values = newSelected.map(
													(opt) => opt.value
												);
												onChange(values);
												return newSelected;
											});
										}}
										className={"cursor-pointer"}
									>
										{opt.label}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</div>
				) : null}
			</div>
		</Command>
	);
}

// function MultiSelect({ options, selected, onChange, className, ...props }: MultiSelectProps) {

//     const [open, setOpen] = React.useState(false)

//     const handleUnselect = (item: string) => {
//         onChange(selected.filter((i) => i !== item))
//     }

//     return (
//         <Popover open={open} onOpenChange={setOpen} {...props}>
//             <PopoverTrigger asChild>
//                 <Button
//                     variant="outline"
//                     role="combobox"
//                     aria-expanded={open}
//                     className={`w-full justify-between ${selected.length > 1 ? "h-full" : "h-10"}`}
//                     onClick={() => setOpen(!open)}
//                 >
//                     <div className="flex gap-1 flex-wrap">
//                         {selected.map((item) => (
//                             <Badge
//                                 variant="secondary"
//                                 key={item}
//                                 className="mr-1 mb-1"
//                                 onClick={() => handleUnselect(item)}
//                             >
//                                 {item}
//                                 <button
//                                     className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
//                                     onKeyDown={(e) => {
//                                         if (e.key === "Enter") {
//                                             handleUnselect(item);
//                                         }
//                                     }}
//                                     onMouseDown={(e) => {
//                                         e.preventDefault();
//                                         e.stopPropagation();
//                                     }}
//                                     onClick={() => handleUnselect(item)}
//                                 >
//                                     <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
//                                 </button>
//                             </Badge>
//                         ))}
//                     </div>
//                     <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-full p-0">
//                 <Command className={className}>
//                     <CommandInput placeholder="Search ..." />
//                     <CommandEmpty>No item found.</CommandEmpty>
//                     <CommandGroup className='max-h-64 overflow-auto'>
//                         {options.map((option) => (
//                             <CommandItem
//                                 key={option.value}
//                                 onSelect={() => {
//                                     onChange(
//                                         selected.includes(option.value)
//                                             ? selected.filter((item) => item !== option.value)
//                                             : [...selected, option.value]
//                                     )
//                                     setOpen(true)
//                                 }}
//                             >
//                                 <Check
//                                     className={cn(
//                                         "mr-2 h-4 w-4",
//                                         selected.includes(option.value) ?
//                                             "opacity-100" : "opacity-0"
//                                     )}
//                                 />
//                                 {option.label}
//                             </CommandItem>
//                         ))}
//                     </CommandGroup>
//                 </Command>
//             </PopoverContent>
//         </Popover>
//     )
// }

// export { MultiSelect }
