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

	useEffect(() => {
		// Refetch the data when the component mounts
		getAttendanceSetting.refetch();
		getBankSetting.refetch();
		getInsuranceRateSetting.refetch();
		getBonusSetting.refetch();
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
		}
	};

	// Return the provider with the functions
	return (
		<FunctionsContext.Provider value={F}>
			{children}
		</FunctionsContext.Provider>
	);
}
