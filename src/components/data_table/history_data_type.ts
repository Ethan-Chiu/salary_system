import { type TRPCClientErrorLike } from "@trpc/client";
import { type UseTRPCQueryResult } from "@trpc/react-query/shared";

export interface HistoryDataType {
	id: number;
	start_date: Date;
	end_date: Date | null;
	update_by: string;
}

type ExtendableHistoryDataType<T> = T extends object
	? (HistoryDataType & T)[]
	: HistoryDataType[];

export type HistoryQueryFunctionType<T = Record<string, never>> =
	() => UseTRPCQueryResult<
		ExtendableHistoryDataType<T>,
		TRPCClientErrorLike<any>
	>;