import { type PropsWithChildren, useContext } from "react";
import {
	createTableFunctionContext,
	useTableFunctionState,
} from "~/components/table_functions/context/table_functions_context";
import { Sheet } from "~/components/ui/sheet";
import { type EmployeeTrustFEType } from "~/server/api/types/employee_trust_type";

export type TrustRowItem = EmployeeTrustFEType;
export type TrustRowItemKey = keyof TrustRowItem;
export type TrustFunctionModes = "none" | "create" | "update" | "delete";

const employeeTrustFunctionContext = createTableFunctionContext<
	TrustFunctionModes,
	TrustRowItem
>();

export function EmployeeTrustFunctionContextProvider({ children }: PropsWithChildren) {
	const { open, setOpen, mode, setMode, data, setData } =
		useTableFunctionState<TrustFunctionModes, TrustRowItem>("none");

	return (
		<employeeTrustFunctionContext.Provider
			value={{
				open,
				setOpen,
				mode,
				setMode,
				data,
				setData,
			}}
		>
			<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
				{children}
			</Sheet>
		</employeeTrustFunctionContext.Provider>
	);
}

export function useTrustFunctionContext() {
	const context = useContext(employeeTrustFunctionContext);
	if (context === null) {
		throw new Error(
			"useTrustFunctionContext must be used within a EmployeeTrustFunctionContextProvider"
		);
	}
	return context;
}
