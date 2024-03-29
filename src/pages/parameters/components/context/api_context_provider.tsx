import React, { createContext, type PropsWithChildren } from "react";
import { api } from "~/utils/api";
import { type ParameterTableEnum } from "../../parameter_tables";
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
	selectedTableType: ParameterTableEnum;
}

export default function ApiFunctionsProvider({
	children,
	selectedTableType,
}: PropsWithChildren<ApiFunctionsProviderProps>) {
	const getAttendanceSetting = () =>
		api.parameters.getAllAttendanceSetting.useQuery();

	const getBankSetting = () => api.parameters.getAllBankSetting.useQuery();

	const getInsuranceRateSetting = () =>
		api.parameters.getAllInsuranceRateSetting.useQuery();

	const getBonusSetting = () => api.parameters.getAllBonusSetting.useQuery();

	const getBonusDepartment = () =>
		api.parameters.getAllBonusDepartment.useQuery();

	const getBonusPosition = () =>
		api.parameters.getAllBonusPosition.useQuery();

	const getBonusPositionType = () =>
		api.parameters.getAllBonusPositionType.useQuery();

	const getBonusSeniority = () =>
		api.parameters.getAllBonusSeniority.useQuery();

	const functionsDictionary: Record<ParameterTableEnum, QueryFunctionsApi> = {
		TableAttendance: {
			queryFunction: getAttendanceSetting,
		},
		TableBankSetting: {
			queryFunction: getBankSetting,
		},
		TableInsurance: {
			queryFunction: getInsuranceRateSetting,
		},
		TableBonusSetting: {
			queryFunction: getBonusSetting,
		},
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
