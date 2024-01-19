import React, { createContext, PropsWithChildren, useEffect } from "react";
import { api } from "~/utils/api";
import { ShowTableEnum } from "../../shown_tables";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";

interface QueryFunctionsApi {
	queryFunction: (() => UseTRPCQueryResult<any[], any>) | undefined;
}

export const apiFunctionsContext = createContext<QueryFunctionsApi>({
	queryFunction: undefined,
});

interface ApiFunctionsProviderProps {
	selectedTable: ShowTableEnum;
}

export default function ApiFunctionsProvider({
	children,
	selectedTable,
}: PropsWithChildren<ApiFunctionsProviderProps>) {

	const getAttendanceSetting = () =>
		api.parameters.getAllAttendanceSetting.useQuery();

	const getBankSetting = () =>
		api.parameters.getAllBankSetting.useQuery();

	const getInsuranceRateSetting = () =>
		api.parameters.getAllInsuranceRateSetting.useQuery();

	const getBonusSetting = () =>
		api.parameters.getAllBonusSetting.useQuery();

	const getBonusDepartment = () =>
		api.parameters.getAllBonusDepartment.useQuery();

    const getBonusPosition = () =>
		api.parameters.getAllBonusPosition.useQuery();
	
    const getBonusPositionType = () =>
		api.parameters.getAllBonusPositionType.useQuery();

	const getBonusSeniority = () =>
		api.parameters.getAllBonusSeniority.useQuery();

	const functionsDictionary: Record<ShowTableEnum, QueryFunctionsApi> = {
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
			value={functionsDictionary[selectedTable]}
		>
			{children}
		</apiFunctionsContext.Provider>
	);
}
