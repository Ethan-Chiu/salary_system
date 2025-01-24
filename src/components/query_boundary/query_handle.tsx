import { type UseQueryResult } from "@tanstack/react-query";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type InferrableClientTypes } from "@trpc/server/unstable-core-do-not-import";
import { LoadingSpinner } from "~/components/loading";
import { toast } from "~/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { type ReactNode } from "react";

interface QueryHandleDone<TData> {
	data: TData;
	isPending: false;
	content: undefined;
}
interface QueryHandleWait {
	data: undefined;
	isPending: true;
	content: ReactNode;
}

export function useQueryHandle<TData, TError extends InferrableClientTypes>(
	query: UseQueryResult<TData, TRPCClientErrorLike<TError>>
): QueryHandleDone<TData> | QueryHandleWait {
	const { data, isPending, isError, error } = query;

	if (isPending) {
		return {
			data: undefined,
			isPending: true,
			content: <LoadingSpinner />,
		};
	}

	if (isError) {
		return {
			data: undefined,
			isPending: true,
			content: <span>Error: {error.message}</span>,
		};
	}

	return { data: data, isPending: false, content: undefined };
}
