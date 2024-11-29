import React, { createContext, PropsWithChildren, useContext } from "react";
import { api } from "~/utils/api";
import { ParameterTableEnum } from "../../parameter_tables";
import {
	UseTRPCMutationResult,
	UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import periodContext from "~/components/context/period_context";

interface FunctionsApi {
	queryCurrentFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	queryFutureFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	updateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	createFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	deleteFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
}

export const parameterToolbarFunctionsContext = createContext<FunctionsApi>({
	queryCurrentFunction: undefined,
	queryFutureFunction: undefined,
	updateFunction: undefined,
	createFunction: undefined,
	deleteFunction: undefined,
});

interface ToolbarFunctionsProviderProps {
	selectedTableType: ParameterTableEnum;
	period_id: number;
}

export default function ParameterToolbarFunctionsProvider({
	children,
	selectedTableType,
	period_id,
}: PropsWithChildren<ToolbarFunctionsProviderProps>) {
	const ctx = api.useContext();

	//#region <AttendanceSetting>
	const getCurrentAttendanceSetting = () =>
		api.parameters.getCurrentAttendanceSetting.useQuery({ period_id });
	const getFutureAttendanceSetting = () =>
		api.parameters.getAllFutureAttendanceSetting.useQuery();
	const updateAttendanceSetting =
		api.parameters.updateAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
				ctx.parameters.getAllAttendanceSetting.invalidate();
				ctx.parameters.getAllFutureAttendanceSetting.invalidate();
			},
		});
	const createAttendanceSetting =
		api.parameters.createAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
				ctx.parameters.getAllAttendanceSetting.invalidate();
				ctx.parameters.getAllFutureAttendanceSetting.invalidate();
			},
		});
	const deleteAttendanceSetting =
		api.parameters.deleteAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
				ctx.parameters.getAllAttendanceSetting.invalidate();
				ctx.parameters.getAllFutureAttendanceSetting.invalidate();
			},
		});
	//#endregion

	//#region <BankSetting>
	const getBankSetting = () =>
		api.parameters.getCurrentBankSetting.useQuery({ period_id });
	const updateBankSetting = api.parameters.updateBankSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBankSetting.invalidate();
			ctx.parameters.getAllBankSetting.invalidate();
		},
	});
	const createBankSetting = api.parameters.createBankSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBankSetting.invalidate();
			ctx.parameters.getAllBankSetting.invalidate();
		},
	});
	const deleteBankSetting = api.parameters.deleteBankSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBankSetting.invalidate();
			ctx.parameters.getAllBankSetting.invalidate();
		},
	});
	//#endregion

	//#region <InsuranceSetting>
	const getInsuranceRateSetting = () =>
		api.parameters.getCurrentInsuranceRateSetting.useQuery({ period_id });
	const updateInsuranceRateSetting =
		api.parameters.updateInsuranceRateSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentInsuranceRateSetting.invalidate();
				ctx.parameters.getAllInsuranceRateSetting.invalidate();
			},
		});
	const createInsuranceRateSetting =
		api.parameters.createInsuranceRateSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentInsuranceRateSetting.invalidate();
				ctx.parameters.getAllInsuranceRateSetting.invalidate();
			},
		});
	const deleteInsuranceRateSetting =
		api.parameters.deleteInsuranceRateSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentInsuranceRateSetting.invalidate();
				ctx.parameters.getAllInsuranceRateSetting.invalidate();
			},
		});
	//#endregion

	//#region <TrustMoneySetting>
	const getTrustMoneySetting = () =>
		api.parameters.getCurrentTrustMoney.useQuery({ period_id });
	const updateTrustMoneySetting =
		api.parameters.updateTrustMoney.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentTrustMoney.invalidate();
				ctx.parameters.getAllTrustMoney.invalidate();
			},
		});
	const createTrustMoneySetting =
		api.parameters.createTrustMoney.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentTrustMoney.invalidate();
				ctx.parameters.getAllTrustMoney.invalidate();
			},
		});
	const deleteTrustMoneySetting =
		api.parameters.deleteTrustMoney.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentTrustMoney.invalidate();
				ctx.parameters.getAllTrustMoney.invalidate();
			},
		});
	//#endregion

	const getLevel = () => api.parameters.getCurrentLevel.useQuery({ period_id });
	const updateLevel = api.parameters.updateLevel.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevel.invalidate();
			ctx.parameters.getAllLevel.invalidate();
		},
	});
	const createLevel = api.parameters.createLevel.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevel.invalidate();
			ctx.parameters.getAllLevel.invalidate();
		},
	});
	const deleteLevel = api.parameters.deleteLevel.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevel.invalidate();
			ctx.parameters.getAllLevel.invalidate();
		},
	});
	const getLevelRange = () => api.parameters.getCurrentLevelRange.useQuery({ period_id });
	const updateLevelRange = api.parameters.updateLevelRange.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevelRange.invalidate();
			ctx.parameters.getAllLevelRange.invalidate();
		},
	});
	const createLevelRange = api.parameters.createLevelRange.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevelRange.invalidate();
			ctx.parameters.getAllLevelRange.invalidate();
		},
	});
	const deleteLevelRange = api.parameters.deleteLevelRange.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevelRange.invalidate();
			ctx.parameters.getAllLevelRange.invalidate();
		},
	});

	//#region <SalaryIncomeTax>
	const getSalaryIncomeTax = () =>
		api.parameters.getCurrentSalaryIncomeTax.useQuery({ period_id });
	const updateSalaryIncomeTax =
		api.parameters.updateSalaryIncomeTax.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentSalaryIncomeTax.invalidate();
				ctx.parameters.getAllSalaryIncomeTax.invalidate();
			},
		});
	const createSalaryIncomeTax =
		api.parameters.createSalaryIncomeTax.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentSalaryIncomeTax.invalidate();
				ctx.parameters.getAllSalaryIncomeTax.invalidate();
			},
		});
	const deleteSalaryIncomeTax =
		api.parameters.deleteSalaryIncomeTax.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentSalaryIncomeTax.invalidate();
				ctx.parameters.getAllSalaryIncomeTax.invalidate();
			},
		});
	//#endregion

	const functionsDictionary: Record<ParameterTableEnum, FunctionsApi> = {
		TableAttendance: {
			queryCurrentFunction: getCurrentAttendanceSetting,
			queryFutureFunction: getFutureAttendanceSetting,
			updateFunction: updateAttendanceSetting,
			createFunction: createAttendanceSetting,
			deleteFunction: deleteAttendanceSetting,
		},
		TableBankSetting: {
			queryFunction: getBankSetting,
			updateFunction: updateBankSetting,
			createFunction: createBankSetting,
			deleteFunction: deleteBankSetting,
		},
		TableInsurance: {
			queryFunction: getInsuranceRateSetting,
			updateFunction: updateInsuranceRateSetting,
			createFunction: createInsuranceRateSetting,
			deleteFunction: deleteInsuranceRateSetting,
		},
		TableTrustMoney: {
			queryFunction: getTrustMoneySetting,
			updateFunction: updateTrustMoneySetting,
			createFunction: createTrustMoneySetting,
			deleteFunction: deleteTrustMoneySetting,
		},
		TableLevel: {
			queryFunction: getLevel,
			updateFunction: updateLevel,
			createFunction: createLevel,
			deleteFunction: deleteLevel,
		},
		TableLevelRange: {
			queryFunction: getLevelRange,
			updateFunction: updateLevelRange,
			createFunction: createLevelRange,
			deleteFunction: deleteLevelRange,
		},
		TableSalaryIncomeTax: {
			queryFunction: getSalaryIncomeTax,
			updateFunction: updateSalaryIncomeTax,
			createFunction: createSalaryIncomeTax,
			deleteFunction: deleteSalaryIncomeTax,
		}
	};

	// Return the provider with the functions
	return (
		<parameterToolbarFunctionsContext.Provider
			value={functionsDictionary[selectedTableType]}
		>
			{children}
		</parameterToolbarFunctionsContext.Provider>
	);
}
