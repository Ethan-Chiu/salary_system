import { ReactElement, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";

export interface PopoverSelectorDataType {
	key: string;
	value: string;
	option: ReactElement;
}

interface PopoverSelectorProps {
	data: PopoverSelectorDataType[];
	selectedKeys: Set<string>;
	setSelectedKeys: (key: Set<string>) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	placeholder: string;
	emptyPlaceholder: string;
}

export function PopoverMultiSelector({
	data,
	selectedKeys,
	setSelectedKeys,
	open,
	setOpen,
	placeholder,
	emptyPlaceholder,
}: PopoverSelectorProps) {

	const { t } = useTranslation(["common"]);

	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				{/* Trigger */}
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
					>
						{selectedKeys.size > 0
							? `${t("sync_page.selected")} ${selectedKeys.size}`
							: placeholder}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				{/* Employee list */}
				<PopoverContent className="p-0">
					<Command className="max-h-[40vh]">
						<CommandInput placeholder={placeholder} />
						<CommandList>
							<CommandEmpty>{emptyPlaceholder}</CommandEmpty>
							<CommandGroup>
								{data.map((d) => (
									<CommandItem
										key={d.key}
										value={d.value}
										onSelect={() => {
											const newSet = new Set(
												selectedKeys
											);
											if (selectedKeys.has(d.key)) {
												newSet.delete(d.key);
											} else {
												newSet.add(d.key);
											}
											setSelectedKeys(newSet);
										}}
										className="aria-selected:bg-none"
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedKeys.has(d.key)
													? "opacity-100"
													: "opacity-0"
											)}
										/>
										{d.option}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
