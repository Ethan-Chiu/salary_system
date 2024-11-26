import { createContext, type PropsWithChildren } from "react";
import { api } from "~/utils/api";
import {
	type UseTRPCMutationResult,
	type UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import { type EmployeeTableEnum } from "../../employee_tables";

interface FunctionsApi {
	queryCurrentFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	queryFutureFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	updateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	createFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	deleteFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	autoCalculateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
}

export const employeeToolbarFunctionsContext = createContext<FunctionsApi>({
	queryCurrentFunction: undefined,
	queryFutureFunction: undefined,
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
	const getCurrentEmployeePayment = () =>
		api.employeePayment.getCurrentEmployeePayment.useQuery({ period_id });
	const getFutureEmployeePayment = () =>
		api.employeePayment.getAllFutureEmployeePayment.useQuery();
	const updateEmployeePayment =
		api.employeePayment.updateEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.getCurrentEmployeePayment.invalidate();
				void ctx.employeePayment.getAllEmployeePayment.invalidate();
				void ctx.employeePayment.getAllFutureEmployeePayment.invalidate();
			},
		});
	const createEmployeePayment =
		api.employeePayment.createEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.getCurrentEmployeePayment.invalidate();
				void ctx.employeePayment.getAllEmployeePayment.invalidate();
				void ctx.employeePayment.getAllFutureEmployeePayment.invalidate();
			},
		});
	const deleteEmployeePayment =
		api.employeePayment.deleteEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.getCurrentEmployeePayment.invalidate();
				void ctx.employeePayment.getAllEmployeePayment.invalidate();
				void ctx.employeePayment.getAllFutureEmployeePayment.invalidate();
			},
		});
	const autoCalculateEmployeePayment =
		api.employeePayment.autoCalculateEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.getCurrentEmployeePayment.invalidate();
				void ctx.employeePayment.getAllEmployeePayment.invalidate();
				void ctx.employeePayment.getAllFutureEmployeePayment.invalidate();
			},
		});
	//#endregion

	//#region <EmployeeTrust>
	const getCurrentEmployeeTrust = () =>
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
	// const autoCalculateEmployeeTrust =
	// 	api.employeeTrust.autoCalculateEmployeeTrust.useMutation({
	// 		onSuccess: () => {
	// 			void ctx.employeeTrust.getCurrentEmployeeTrust.invalidate();
	// 			void ctx.employeeTrust.getAllEmployeeTrust.invalidate();
	// 		},
	// 	});
	//#endregion

	const functionsDictionary: Record<EmployeeTableEnum, FunctionsApi> = {
		TableEmployeePayment: {
			queryCurrentFunction: getCurrentEmployeePayment,
			queryFutureFunction: getFutureEmployeePayment,
			updateFunction: updateEmployeePayment,
			createFunction: createEmployeePayment,
			deleteFunction: deleteEmployeePayment,
			autoCalculateFunction: autoCalculateEmployeePayment,
		},
		TableEmployeeTrust: {
			queryCurrentFunction: getCurrentEmployeeTrust,
			queryFutureFunction: undefined,
			updateFunction: undefined,
			createFunction: createEmployeeTrust,
			deleteFunction: undefined,
			autoCalculateFunction: undefined,
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
