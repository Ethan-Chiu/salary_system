import { createContext, type PropsWithChildren } from "react";
import { api } from "~/utils/api";
import {
	type UseTRPCMutationResult,
	type UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import { type EmployeeTableEnum } from "../../employee_tables";

interface FunctionsApi {
	queryFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	updateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	createFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	deleteFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	autoCalculateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
}

export const employeeToolbarFunctionsContext = createContext<FunctionsApi>({
	queryFunction: undefined,
	updateFunction: undefined,
	createFunction: undefined,
	deleteFunction: undefined,
	autoCalculateFunction: undefined,
});

interface ToolbarFunctionsProviderProps {
	tableType: EmployeeTableEnum;
	period_id: number;
}

export default function EmployeeToolbarFunctionsProvider({
	children,
	tableType,
	period_id,
}: PropsWithChildren<ToolbarFunctionsProviderProps>) {
	const ctx = api.useUtils();

	//#region <EmployeePayment>
	const getEmployeePayment = () =>
		api.employeePayment.getCurrentEmployeePayment.useQuery({ period_id });
	const updateEmployeePayment =
		api.employeePayment.updateEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.getCurrentEmployeePayment.invalidate();
				void ctx.employeePayment.getAllEmployeePayment.invalidate();
			},
		});
	const createEmployeePayment =
		api.employeePayment.createEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.getCurrentEmployeePayment.invalidate();
				void ctx.employeePayment.getAllEmployeePayment.invalidate();
			},
		});
	const deleteEmployeePayment =
		api.employeePayment.deleteEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.getCurrentEmployeePayment.invalidate();
				void ctx.employeePayment.getAllEmployeePayment.invalidate();
			},
		});
	const autoCalculateEmployeePayment =
		api.employeePayment.autoCalculateEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.getCurrentEmployeePayment.invalidate();
				void ctx.employeePayment.getAllEmployeePayment.invalidate();
			},
		});
	//#endregion

	//#region <EmployeeTrust>
	const getEmployeeTrust = () =>
		api.employeeTrust.getCurrentEmployeeTrust.useQuery({ period_id });
	const updateEmployeeTrust =
		api.employeeTrust.updateEmployeeTrust.useMutation({
			onSuccess: () => {
				void ctx.employeeTrust.getCurrentEmployeeTrust.invalidate();
				void ctx.employeeTrust.getAllEmployeeTrust.invalidate();
			},
		});
	const createEmployeeTrust =
		api.employeeTrust.createEmployeeTrust.useMutation({
			onSuccess: () => {
				void ctx.employeeTrust.getCurrentEmployeeTrust.invalidate();
				void ctx.employeeTrust.getAllEmployeeTrust.invalidate();
			},
		});
	const deleteEmployeeTrust =
		api.employeeTrust.deleteEmployeeTrust.useMutation({
			onSuccess: () => {
				void ctx.employeeTrust.getCurrentEmployeeTrust.invalidate();
				void ctx.employeeTrust.getAllEmployeeTrust.invalidate();
			},
		});
	const autoCalculateEmployeeTrust =
		api.employeeTrust.autoCalculateEmployeeTrust.useMutation({
			onSuccess: () => {
				void ctx.employeeTrust.getCurrentEmployeeTrust.invalidate();
				void ctx.employeeTrust.getAllEmployeeTrust.invalidate();
			},
		});
	//#endregion

	const functionsDictionary: Record<EmployeeTableEnum, FunctionsApi> = {
		TableEmployeePayment: {
			queryFunction: getEmployeePayment,
			updateFunction: updateEmployeePayment,
			createFunction: createEmployeePayment,
			deleteFunction: deleteEmployeePayment,
			autoCalculateFunction: autoCalculateEmployeePayment,
		},
		TableEmployeeTrust: {
			queryFunction: getEmployeeTrust,
			updateFunction: updateEmployeeTrust,
			createFunction: createEmployeeTrust,
			deleteFunction: deleteEmployeeTrust,
			autoCalculateFunction: autoCalculateEmployeeTrust,
		},
	};

	// Return the provider with the functions
	return (
		<employeeToolbarFunctionsContext.Provider
			value={functionsDictionary[tableType]}
		>
			{children}
		</employeeToolbarFunctionsContext.Provider>
	);
}
