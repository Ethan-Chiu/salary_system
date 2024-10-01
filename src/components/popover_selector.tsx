import { useState } from "react";
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
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";

export interface PopoverSelectorDataType {
	key: string;
	value: string;
}

interface PopoverSelectorProps {
	data: PopoverSelectorDataType[];
	selectedKey: string | null;
	setSelectedKey: (key: string) => void;
}

export function PopoverSelector({
	data,
	selectedKey,
	setSelectedKey,
}: PopoverSelectorProps) {
	const [open, setOpen] = useState(false);

	const { t } = useTranslation(["common"]);

	return (
		<div className="p-2">
			<Popover open={open} onOpenChange={setOpen}>
				{/* Trigger */}
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
					>
						{selectedKey ? (
							<>
								{`${selectedKey} ${
									data.find((d) => d.key === selectedKey)
										?.value ?? t("others.search_employee")
								}`}
							</>
						) : (
							<> {t("others.search_employee")} </>
						)}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				{/* Employee list */}
				<PopoverContent className="p-0">
					<Command className="max-h-[40vh]">
						<CommandInput
							placeholder={t("others.search_employee")}
						/>
						<CommandList>
							<CommandEmpty>
								{t("others.no_employee_found")}
							</CommandEmpty>
							<CommandGroup>
								{data.map((d) => (
									<CommandItem
										key={d.key}
										value={d.value}
										onSelect={() => {
											setSelectedKey(d.key);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedKey === d.key
													? "opacity-100"
													: "opacity-0"
											)}
										/>
										{d.value}
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
