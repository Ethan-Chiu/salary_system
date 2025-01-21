import { DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
} from "~/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { PencilLine } from "lucide-react";
import {
	type DataWithFunctions,
	type FunctionsItem,
} from "~/pages/parameters/components/context/data_table_context";
import { FunctionMenuOption } from "../table_functions/function_menu/function_menu_option";

export type FunctionsItemKey = keyof FunctionsItem;

interface FunctionsComponentProps<TMode, TData extends object> {
	setOpen: (open: boolean) => void;
	setMode: (mode: TMode) => void;
	data: TData & DataWithFunctions;
	setData: (data: TData & DataWithFunctions) => void;
}

export function FunctionsComponent<TMode, TData extends object>({
	setOpen,
	setMode,
	data,
	setData,
}: FunctionsComponentProps<TMode, TData>) {
	const funcKey: FunctionsItemKey[] = ["creatable", "updatable", "deletable"];

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="h-8 lg:flex">
					<PencilLine className="cursor-pointer stroke-[1.5]" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[120px]">
				{funcKey.map((key) => {
					const disabled = !(data?.functions[key] ?? false);
					const mode =
						key == "creatable"
							? "create"
							: key == "updatable"
							? "update"
							: "delete";
					return (
						<>
							{key == "creatable" && (
								<FunctionMenuOption.Create
									key={key}
									onClick={() => {
										setMode(mode as TMode);
										setData(data);
										setOpen(true);
									}}
									disabled={disabled}
								/>
							)}

							{key == "updatable" && (
								<FunctionMenuOption.Update
									key={key}
									onClick={() => {
										setMode(mode as TMode);
										setData(data);
										setOpen(true);
									}}
									disabled={disabled}
								/>
							)}

							{key == "deletable" && (
								<FunctionMenuOption.Delete
									key={key}
									onClick={() => {
										setMode(mode as TMode);
										setData(data);
										setOpen(true);
									}}
									disabled={disabled}
								/>
							)}
						</>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
