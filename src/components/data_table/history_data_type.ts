import { type TRPCClientErrorLike } from "@trpc/client";
import { type UseTRPCQueryResult } from "@trpc/react-query/shared";
import { type DataWithFunctions } from "~/components/table_functions/table_functions_types";

export interface HistoryDataType extends DataWithFunctions{
	id: number;
	start_date: Date | null;
	end_date: Date | null;
	update_by: string;
}

type ParameterExtendableHistoryDataType<T> = T extends object
	? (HistoryDataType & T)[][]
	: HistoryDataType[][];

export type ParameterHistoryQueryFunctionType<T = Record<string, never>> =
	() => UseTRPCQueryResult<
		ParameterExtendableHistoryDataType<T>,
		TRPCClientErrorLike<any>
	>;

export type ParameterCalenderQueryFunctionType<T = Record<string, never>> =
	() => UseTRPCQueryResult<
		ParameterExtendableHistoryDataType<T>,
		TRPCClientErrorLike<any>
	>;

type EmployeeExtendableHistoryDataType<T> = T extends object
	? (HistoryDataType & T)[][]
	: HistoryDataType[][];

export type EmployeeHistoryQueryFunctionType<T = Record<string, never>> =
	() => UseTRPCQueryResult<
		EmployeeExtendableHistoryDataType<T>,
		TRPCClientErrorLike<any>
	>;

export type EmployeeCalenderQueryFunctionType<T = Record<string, never>> =
	() => UseTRPCQueryResult<
		EmployeeExtendableHistoryDataType<T>,
		TRPCClientErrorLike<any>
	>;
