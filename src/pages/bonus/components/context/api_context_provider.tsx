import React, { createContext, type PropsWithChildren } from "react";
import { api } from "~/utils/api";
import { type BonusTableEnum } from "../../bonus_tables";
import { type UseTRPCQueryResult } from "@trpc/react-query/shared";
import { type TRPCClientErrorLike } from "@trpc/client";

interface QueryFunctionsApi {
	queryFunction:
	| (() => UseTRPCQueryResult<any[], TRPCClientErrorLike<any>>)
	| undefined;
}

export const apiFunctionsContext = createContext<QueryFunctionsApi>({
	queryFunction: undefined,
});

interface ApiFunctionsProviderProps {
	selectedTableType: BonusTableEnum;
}

export default function ApiFunctionsProvider({
	children,
	selectedTableType,
}: PropsWithChildren<ApiFunctionsProviderProps>) {
	const getBonusDepartment = () =>
		api.parameters.getAllBonusDepartment.useQuery();

	const getBonusPosition = () =>
		api.parameters.getAllBonusPosition.useQuery();

	const getBonusPositionType = () =>
		api.parameters.getAllBonusPositionType.useQuery();

	const getBonusSeniority = () =>
		api.parameters.getAllBonusSeniority.useQuery();

	const functionsDictionary: Record<BonusTableEnum, QueryFunctionsApi> = {
		// TableBonusSetting: {
		// 	queryFunction: getBonusSetting,
		// },
		TableBonusDepartment: {
			queryFunction: getBonusDepartment,
		},
		TableBonusPosition: {
			queryFunction: getBonusPosition,
		},
		TableBonusPositionType: {
			queryFunction: getBonusPositionType,
		},
		TableBonusSeniority: {
			queryFunction: getBonusSeniority,
		},
		// TablePerformanceLevel: {
		// 	queryFunction: getPerformanceLevel,
		// },
	};

	// Return the provider with the functions
	return (
		<apiFunctionsContext.Provider
			value={functionsDictionary[selectedTableType]}
		>
			{children}
		</apiFunctionsContext.Provider>
	);
}
