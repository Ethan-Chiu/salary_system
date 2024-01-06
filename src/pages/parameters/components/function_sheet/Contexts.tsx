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

	useEffect(() => {
		// Refetch the data when the component mounts
		getAttendanceSetting.refetch();
		getBankSetting.refetch();
	}, []);

	const F: FunctionsObject = {
		[TN.TABLE_ATTENDANCE]: {
			queryFunction: getAttendanceSetting,
			updateFunction: updateAttendanceSetting, // Use mutate for mutations
			createFunction: createAttendanceSetting, // Use mutate for mutations
            deleteFunction: deleteAttendanceSetting, // Use mutate for mutations
		},
		[TN.TABLE_BANK_SETTING]: {
			queryFunction: getBankSetting,
			updateFunction: updateBankSetting,
			createFunction: createBankSetting,
			deleteFunction: deleteBankSetting,
		}
	};

	// Optional: Show a loading indicator while data is still loading
	if (getAttendanceSetting.isLoading) {
		return <div>Loading...</div>;
	}

	// Return the provider with the functions
	return (
		<FunctionsContext.Provider value={F}>
			{children}
		</FunctionsContext.Provider>
	);
}
