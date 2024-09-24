import { type TRPCClientErrorLike } from "@trpc/client";
import { type UseTRPCQueryResult } from "@trpc/react-query/shared";

export interface HistoryDataType {
  id: number;
  start_date: string;
  end_date: string;
  update_by: string;
}

export type HistoryQueryFunctionType = () => UseTRPCQueryResult<HistoryDataType[], TRPCClientErrorLike<any>>;
