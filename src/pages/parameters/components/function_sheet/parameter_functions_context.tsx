import React, { createContext, PropsWithChildren, useContext } from "react";
import { api } from "~/utils/api";
import { ParameterTableEnum } from "../../parameter_tables";
import {
	UseTRPCMutationResult,
	UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import periodContext from "~/components/context/period_context";

interface FunctionsApi {
	queryFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	updateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	createFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	deleteFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
}

export const parameterToolbarFunctionsContext = createContext<FunctionsApi>({
	queryFunction: undefined,
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
	const getAttendanceSetting = () =>
		api.parameters.getCurrentAttendanceSetting.useQuery({ period_id });
	const updateAttendanceSetting =
		api.parameters.updateAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
				ctx.parameters.getAllAttendanceSetting.invalidate();
			},
		});
	const createAttendanceSetting =
		api.parameters.createAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
				ctx.parameters.getAllAttendanceSetting.invalidate();
			},
		});
	const deleteAttendanceSetting =
		api.parameters.deleteAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
				ctx.parameters.getAllAttendanceSetting.invalidate();
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
		api.parameters.getCurrentTrustMoney.useQuery();
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

	//#region <BonusSetting>
	const getBonusSetting = () =>
		api.parameters.getCurrentBonusSetting.useQuery();
	const updateBonusSetting = api.parameters.updateBonusSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusSetting.invalidate();
			ctx.parameters.getAllBonusSetting.invalidate();
		},
	});
	const createBonusSetting = api.parameters.createBonusSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusSetting.invalidate();
			ctx.parameters.getAllBonusSetting.invalidate();
		},
	});
	const deleteBonusSetting = api.parameters.deleteBonusSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusSetting.invalidate();
			ctx.parameters.getAllBonusSetting.invalidate();
		},
	});
	//#endregion

	//#region <BonusDepartment>
	const getBonusDepartment = () =>
		api.parameters.getCurrentBonusDepartment.useQuery();
	const updateBonusDepartment =
		api.parameters.updateBonusDepartment.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusDepartment.invalidate();
				ctx.parameters.getAllBonusDepartment.invalidate();
			},
		});
	const createBonusDepartment =
		api.parameters.createBonusDepartment.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusDepartment.invalidate();
				ctx.parameters.getAllBonusDepartment.invalidate();
			},
		});
	const deleteBonusDepartment =
		api.parameters.deleteBonusDepartment.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusDepartment.invalidate();
				ctx.parameters.getAllBonusDepartment.invalidate();
			},
		});
	//#endregion

	//#region <BonusPosition>
	const getBonusPosition = () =>
		api.parameters.getCurrentBonusPosition.useQuery();
	const updateBonusPosition = api.parameters.updateBonusPosition.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusPosition.invalidate();
			ctx.parameters.getAllBonusPosition.invalidate();
		},
	});
	const createBonusPosition = api.parameters.createBonusPosition.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusPosition.invalidate();
			ctx.parameters.getAllBonusPosition.invalidate();
		},
	});
	const deleteBonusPosition = api.parameters.deleteBonusPosition.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusPosition.invalidate();
			ctx.parameters.getAllBonusPosition.invalidate();
		},
	});
	//#endregion

	//#region <BonusPositionType>
	const getBonusPositionType = () =>
		api.parameters.getCurrentBonusPositionType.useQuery();
	const updateBonusPositionType =
		api.parameters.updateBonusPositionType.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusPositionType.invalidate();
				ctx.parameters.getAllBonusPositionType.invalidate();
			},
		});
	const createBonusPositionType =
		api.parameters.createBonusPositionType.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusPositionType.invalidate();
				ctx.parameters.getAllBonusPositionType.invalidate();
			},
		});
	const deleteBonusPositionType =
		api.parameters.deleteBonusPositionType.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusPositionType.invalidate();
				ctx.parameters.getAllBonusPositionType.invalidate();
			},
		});
	//#endregion

	//#region <BonusSeniority>
	const getBonusSeniority = () =>
		api.parameters.getCurrentBonusSeniority.useQuery();
	const updateBonusSeniority =
		api.parameters.updateBonusSeniority.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusSeniority.invalidate();
				ctx.parameters.getAllBonusSeniority.invalidate();
			},
		});
	const createBonusSeniority =
		api.parameters.createBonusSeniority.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusSeniority.invalidate();
				ctx.parameters.getAllBonusSeniority.invalidate();
			},
		});
	const deleteBonusSeniority =
		api.parameters.deleteBonusSeniority.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusSeniority.invalidate();
				ctx.parameters.getAllBonusSeniority.invalidate();
			},
		});

	const getLevel = () => api.parameters.getCurrentLevel.useQuery();
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
	const getLevelRange = () => api.parameters.getCurrentLevelRange.useQuery();
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
	const getPerformanceLevel = () =>
		api.parameters.getCurrentPerformanceLevel.useQuery();
	const updatePerformanceLevel =
		api.parameters.updatePerformanceLevel.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentPerformanceLevel.invalidate();
				ctx.parameters.getAllPerformanceLevel.invalidate();
			},
		});
	const createPerformanceLevel =
		api.parameters.createPerformanceLevel.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentPerformanceLevel.invalidate();
				ctx.parameters.getAllPerformanceLevel.invalidate();
			},
		});
	const deletePerformanceLevel =
		api.parameters.deletePerformanceLevel.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentPerformanceLevel.invalidate();
				ctx.parameters.getAllPerformanceLevel.invalidate();
			},
		});

	const functionsDictionary: Record<ParameterTableEnum, FunctionsApi> = {
		TableAttendance: {
			queryFunction: getAttendanceSetting,
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
		TableBonusSetting: {
			queryFunction: getBonusSetting,
			updateFunction: updateBonusSetting,
			createFunction: createBonusSetting,
			deleteFunction: deleteBonusSetting,
		},
		TableBonusDepartment: {
			queryFunction: getBonusDepartment,
			updateFunction: updateBonusDepartment,
			createFunction: createBonusDepartment,
			deleteFunction: deleteBonusDepartment,
		},
		TableBonusPosition: {
			queryFunction: getBonusPosition,
			updateFunction: updateBonusPosition,
			createFunction: createBonusPosition,
			deleteFunction: deleteBonusPosition,
		},
		TableBonusPositionType: {
			queryFunction: getBonusPositionType,
			updateFunction: updateBonusPositionType,
			createFunction: createBonusPositionType,
			deleteFunction: deleteBonusPositionType,
		},
		TableBonusSeniority: {
			queryFunction: getBonusSeniority,
			updateFunction: updateBonusSeniority,
			createFunction: createBonusSeniority,
			deleteFunction: deleteBonusSeniority,
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
		TablePerformanceLevel: {
			queryFunction: getPerformanceLevel,
			updateFunction: updatePerformanceLevel,
			createFunction: createPerformanceLevel,
			deleteFunction: deletePerformanceLevel,
		},
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
