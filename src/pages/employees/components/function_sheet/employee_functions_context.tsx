import React, { createContext, PropsWithChildren, useContext } from "react";
import { api } from "~/utils/api";
import {
	UseTRPCMutationResult,
	UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import { EmployeeTableEnum } from "../../employee_tables";

interface FunctionsApi {
	queryFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	updateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	createFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	deleteFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
}

export const employeeToolbarFunctionsContext = createContext<FunctionsApi>({
	queryFunction: undefined,
	updateFunction: undefined,
	createFunction: undefined,
	deleteFunction: undefined,
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
	const ctx = api.useContext();

	//#region <EmployeePayment>
	const getEmployeePayment = () =>
		api.employeePayment.getCurrentEmployeePayment.useQuery({ period_id });
	const updateEmployeePayment =
		api.employeePayment.updateEmployeePayment.useMutation({
			onSuccess: () => {
				ctx.employeePayment.getCurrentEmployeePayment.invalidate();
				ctx.employeePayment.getAllEmployeePayment.invalidate();
			},
		});
	const createEmployeePayment =
		api.employeePayment.createEmployeePayment.useMutation({
			onSuccess: () => {
				ctx.employeePayment.getCurrentEmployeePayment.invalidate();
				ctx.employeePayment.getAllEmployeePayment.invalidate();
			},
		});
	const deleteEmployeePayment =
		api.employeePayment.deleteEmployeePayment.useMutation({
			onSuccess: () => {
				ctx.employeePayment.getCurrentEmployeePayment.invalidate();
				ctx.employeePayment.getAllEmployeePayment.invalidate();
			},
		});
	//#endregion

	//#region <EmployeeTrust>
	const getEmployeeTrust = () =>
		api.employeeTrust.getCurrentEmployeeTrust.useQuery({ period_id });
	const updateEmployeeTrust = api.employeeTrust.updateEmployeeTrust.useMutation({
		onSuccess: () => {
			ctx.employeeTrust.getCurrentEmployeeTrust.invalidate();
			ctx.employeeTrust.getAllEmployeeTrust.invalidate();
		},
	});
	const createEmployeeTrust = api.employeeTrust.createEmployeeTrust.useMutation({
		onSuccess: () => {
			ctx.employeeTrust.getCurrentEmployeeTrust.invalidate();
			ctx.employeeTrust.getAllEmployeeTrust.invalidate();
		},
	});
	const deleteEmployeeTrust = api.employeeTrust.deleteEmployeeTrust.useMutation({
		onSuccess: () => {
			ctx.employeeTrust.getCurrentEmployeeTrust.invalidate();
			ctx.employeeTrust.getAllEmployeeTrust.invalidate();
		},
	});
	//#endregion

	const functionsDictionary: Record<EmployeeTableEnum, FunctionsApi> = {
		TableEmployeePayment: {
			queryFunction: getEmployeePayment,
			updateFunction: updateEmployeePayment,
			createFunction: createEmployeePayment,
			deleteFunction: deleteEmployeePayment,
		},
		TableEmployeeTrust: {
			queryFunction: getEmployeeTrust,
			updateFunction: updateEmployeeTrust,
			createFunction: createEmployeeTrust,
			deleteFunction: deleteEmployeeTrust,
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
