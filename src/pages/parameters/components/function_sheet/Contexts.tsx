import React, { createContext, PropsWithChildren, useEffect } from "react";
import * as TN from "~/pages/table_names";
import { api } from "~/utils/api";

export interface Functions {
	queryFunction?: any;
	updateFunction?: any;
	createFunction?: any;
	deleteFunction?: any;
}

export interface FunctionsObject {
	[key: string]: Functions;
}

export const FunctionsContext = createContext<FunctionsObject | null>(null);

export default function FunctionsProvider({ children }: PropsWithChildren<{}>) {

	//#region <AttendanceSetting>
	const getAttendanceSetting =
		api.parameters.getCurrentAttendanceSetting.useQuery();
	const updateAttendanceSetting =
		api.parameters.updateAttendanceSetting.useMutation({
			onSuccess: () => {
				getAttendanceSetting.refetch();
			},
		});
	const createAttendanceSetting =
		api.parameters.createAttendanceSetting.useMutation({
			onSuccess: () => {
				getAttendanceSetting.refetch();
			},
		});
	const deleteAttendanceSetting =
		api.parameters.deleteAttendanceSetting.useMutation({
			onSuccess: () => {
				getAttendanceSetting.refetch();
			},
		});
	//#endregion

	//#region <BankSetting>
	const getBankSetting = 
		api.parameters.getCurrentBankSetting.useQuery();
	const updateBankSetting = 
		api.parameters.updateBankSetting.useMutation({
			onSuccess: () => getBankSetting.refetch()
		})
	const createBankSetting = 
		api.parameters.createBankSetting.useMutation({
			onSuccess: () => getBankSetting.refetch()
		})
	const deleteBankSetting = 
		api.parameters.deleteBankSetting.useMutation({
			onSuccess: () => getBankSetting.refetch()
		})
	//#endregion

	//#region <InsuranceSetting>
	const getInsuranceRateSetting =
		api.parameters.getCurrentInsuranceRateSetting.useQuery();
	const updateInsuranceRateSetting =
		api.parameters.updateInsuranceRateSetting.useMutation({
			onSuccess: () => {
				getInsuranceRateSetting.refetch();
			},
		});
	const createInsuranceRateSetting =
		api.parameters.createInsuranceRateSetting.useMutation({
			onSuccess: () => {
				getInsuranceRateSetting.refetch();
			},
		});
	const deleteInsuranceRateSetting =
		api.parameters.deleteInsuranceRateSetting.useMutation({
			onSuccess: () => {
				getInsuranceRateSetting.refetch();
			},
		});
	//#endregion

	//#region <BonusSetting>
	const getBonusSetting =
		api.parameters.getCurrentBonusSetting.useQuery();
	const updateBonusSetting =
		api.parameters.updateBonusSetting.useMutation({
			onSuccess: () => {
				getBonusSetting.refetch();
			},
		});
	const createBonusSetting =
		api.parameters.createBonusSetting.useMutation({
			onSuccess: () => {
				getBonusSetting.refetch();
			},
		});
	const deleteBonusSetting =
		api.parameters.deleteBonusSetting.useMutation({
			onSuccess: () => {
				getBonusSetting.refetch();
			},
		});
	//#endregion

	//#region <BonusDepartment>
	const getBonusDepartment =
		api.parameters.getCurrentBonusDepartment.useQuery();
	const updateBonusDepartment =
		api.parameters.updateBonusDepartment.useMutation({
			onSuccess: () => {
				getBonusDepartment.refetch();
			},
		});
	const createBonusDepartment =
		api.parameters.createBonusDepartment.useMutation({
			onSuccess: () => {
				getBonusDepartment.refetch();
			},
		});
	const deleteBonusDepartment =
		api.parameters.deleteBonusDepartment.useMutation({
			onSuccess: () => {
				getBonusDepartment.refetch();
			},
		});
	//#endregion

	//#region <BonusPosition>
	const getBonusPosition =
		api.parameters.getCurrentBonusPosition.useQuery();
	const updateBonusPosition =
		api.parameters.updateBonusPosition.useMutation({
			onSuccess: () => {
				getBonusPosition.refetch();
			},
		});
	const createBonusPosition =
		api.parameters.createBonusPosition.useMutation({
			onSuccess: () => {
				getBonusPosition.refetch();
			},
		});
	const deleteBonusPosition =
		api.parameters.deleteBonusPosition.useMutation({
			onSuccess: () => {
				getBonusPosition.refetch();
			},
		});
	//#endregion

	//#region <BonusPositionType>
	const getBonusPositionType =
		api.parameters.getCurrentBonusPositionType.useQuery();
	const updateBonusPositionType =
		api.parameters.updateBonusPositionType.useMutation({
			onSuccess: () => {
				getBonusPositionType.refetch();
			},
		});
	const createBonusPositionType =
		api.parameters.createBonusPositionType.useMutation({
			onSuccess: () => {
				getBonusPositionType.refetch();
			},
		});
	const deleteBonusPositionType =
		api.parameters.deleteBonusPositionType.useMutation({
			onSuccess: () => {
				getBonusPositionType.refetch();
			},
		});
	//#endregion

	//#region <BonusSeniority>
	const getBonusSeniority =
		api.parameters.getCurrentBonusSeniority.useQuery();
	const updateBonusSeniority =
		api.parameters.updateBonusSeniority.useMutation({
			onSuccess: () => {
				getBonusSeniority.refetch();
			},
		});
	const createBonusSeniority =
		api.parameters.createBonusSeniority.useMutation({
			onSuccess: () => {
				getBonusSeniority.refetch();
			},
		});
	const deleteBonusSeniority =
		api.parameters.deleteBonusSeniority.useMutation({
			onSuccess: () => {
				getBonusSeniority.refetch();
			},
		});
	//#endregion

	useEffect(() => {
		// Refetch the data when the component mounts
		getAttendanceSetting.refetch();
		getBankSetting.refetch();
		getInsuranceRateSetting.refetch();
		getBonusSetting.refetch();
		getBonusDepartment.refetch();
		getBonusPosition.refetch();
		getBonusPositionType.refetch();
		getBonusSeniority.refetch();
	}, []);

	const F: FunctionsObject = {
		[TN.TABLE_ATTENDANCE]: {
			queryFunction: getAttendanceSetting,
			updateFunction: updateAttendanceSetting, 
			createFunction: createAttendanceSetting, 
            deleteFunction: deleteAttendanceSetting, 
		},
		[TN.TABLE_BANK_SETTING]: {
			queryFunction: getBankSetting,
			updateFunction: updateBankSetting,
			createFunction: createBankSetting,
			deleteFunction: deleteBankSetting,
		},
		[TN.TABLE_INSURANCE]: {
			queryFunction: getInsuranceRateSetting,
			updateFunction: updateInsuranceRateSetting, 
			createFunction: createInsuranceRateSetting, 
            deleteFunction: deleteInsuranceRateSetting, 
		},
		[TN.TABLE_BONUS_SETTING]: {
			queryFunction: getBonusSetting,
			updateFunction: updateBonusSetting, 
			createFunction: createBonusSetting, 
            deleteFunction: deleteBonusSetting, 
		},
		[TN.TABLE_BONUS_DEPARTMENT]: {
			queryFunction: getBonusDepartment,
			updateFunction: updateBonusDepartment,
			createFunction: createBonusDepartment,
			deleteFunction: deleteBonusDepartment,
		},
		[TN.TABLE_BONUS_POSITION]: {
			queryFunction: getBonusPosition,
			updateFunction: updateBonusPosition,
			createFunction: createBonusPosition,
			deleteFunction: deleteBonusPosition,
		},
		[TN.TABLE_BONUS_POSITION_TYPE]: {
			queryFunction: getBonusPositionType,
			updateFunction: updateBonusPositionType,
			createFunction: createBonusPositionType,
			deleteFunction: deleteBonusPositionType,
		},
		[TN.TABLE_BONUS_SENIORITY]: {
			queryFunction: getBonusSeniority,
			updateFunction: updateBonusSeniority,
			createFunction: createBonusSeniority,
			deleteFunction: deleteBonusSeniority,
		},
	};

	// Return the provider with the functions
	return (
		<FunctionsContext.Provider value={F}>
			{children}
		</FunctionsContext.Provider>
	);
}
