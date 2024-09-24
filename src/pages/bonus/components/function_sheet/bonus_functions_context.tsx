import React, { createContext, PropsWithChildren, useContext } from "react";
import { api } from "~/utils/api";
import {
	UseTRPCMutationResult,
	UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { TableEnum } from "../context/data_table_enum";

interface FunctionsApi {
	queryFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	updateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	createFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	deleteFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	autoCalculateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
}

export const bonusToolbarFunctionsContext = createContext<FunctionsApi>({
	queryFunction: undefined,
	updateFunction: undefined,
	createFunction: undefined,
	deleteFunction: undefined,
	autoCalculateFunction: undefined,
});

interface ToolbarFunctionsProviderProps {
	selectedTableType: TableEnum;
	period_id: number;
	bonus_type: BonusTypeEnumType;
}

export default function BonusToolbarFunctionsProvider({
	children,
	selectedTableType,
	period_id,
	bonus_type,
}: PropsWithChildren<ToolbarFunctionsProviderProps>) {
	const ctx = api.useUtils();

	// //#region <BonusSetting>
	// const getBonusSetting = () =>
	// 	api.parameters.getCurrentBonusSetting.useQuery();
	// const updateBonusSetting = api.parameters.updateBonusSetting.useMutation({
	// 	onSuccess: () => {
	// 		ctx.parameters.getCurrentBonusSetting.invalidate();
	// 		ctx.parameters.getAllBonusSetting.invalidate();
	// 	},
	// });
	// const createBonusSetting = api.parameters.createBonusSetting.useMutation({
	// 	onSuccess: () => {
	// 		ctx.parameters.getCurrentBonusSetting.invalidate();
	// 		ctx.parameters.getAllBonusSetting.invalidate();
	// 	},
	// });
	// const deleteBonusSetting = api.parameters.deleteBonusSetting.useMutation({
	// 	onSuccess: () => {
	// 		ctx.parameters.getCurrentBonusSetting.invalidate();
	// 		ctx.parameters.getAllBonusSetting.invalidate();
	// 	},
	// });
	// //#endregion

	//#region <BonusWorkType>
	const getBonusWorkType = () =>
		api.bonus.getBonusWorkType.useQuery({ period_id, bonus_type });
	const updateBonusWorkType = api.bonus.updateBonusWorkType.useMutation({
		onSuccess: () => {
			ctx.bonus.getBonusWorkType.invalidate();
		},
	});
	const createBonusWorkType = api.bonus.createBonusWorkType.useMutation({
		onSuccess: () => {
			ctx.bonus.getBonusWorkType.invalidate();
		},
	});
	const deleteBonusWorkType = api.bonus.deleteBonusWorkType.useMutation({
		onSuccess: () => {
			ctx.bonus.getBonusWorkType.invalidate();
		},
	});
	//#endregion

	//#region <BonusDepartment>
	const getBonusDepartment = () =>
		api.bonus.getBonusDepartment.useQuery({ period_id, bonus_type });
	const updateBonusDepartment =
		api.bonus.updateBonusDepartment.useMutation({
			onSuccess: () => {
				ctx.bonus.getBonusDepartment.invalidate();
			},
		});
	const createBonusDepartment =
		api.bonus.createBonusDepartment.useMutation({
			onSuccess: () => {
				ctx.bonus.getBonusDepartment.invalidate();
			},
		});
	const deleteBonusDepartment =
		api.bonus.deleteBonusDepartment.useMutation({
			onSuccess: () => {
				ctx.bonus.getBonusDepartment.invalidate();
			},
		});
	//#endregion

	//#region <BonusPosition>
	const getBonusPosition = () =>
		api.bonus.getBonusPosition.useQuery({ period_id, bonus_type });
	const updateBonusPosition = api.bonus.updateBonusPosition.useMutation({
		onSuccess: () => {
			ctx.bonus.getBonusPosition.invalidate();
		},
	});
	const createBonusPosition = api.bonus.createBonusPosition.useMutation({
		onSuccess: () => {
			ctx.bonus.getBonusPosition.invalidate();
		},
	});
	const deleteBonusPosition = api.bonus.deleteBonusPosition.useMutation({
		onSuccess: () => {
			ctx.bonus.getBonusPosition.invalidate();
		},
	});
	//#endregion

	//#region <BonusPositionType>
	const getBonusPositionType = () =>
		api.bonus.getBonusPositionType.useQuery({ period_id, bonus_type });
	const updateBonusPositionType =
		api.bonus.updateBonusPositionType.useMutation({
			onSuccess: () => {
				ctx.bonus.getBonusPositionType.invalidate();
			},
		});
	const createBonusPositionType =
		api.bonus.createBonusPositionType.useMutation({
			onSuccess: () => {
				ctx.bonus.getBonusPositionType.invalidate();
			},
		});
	const deleteBonusPositionType =
		api.bonus.deleteBonusPositionType.useMutation({
			onSuccess: () => {
				ctx.bonus.getBonusPositionType.invalidate();
			},
		});
	//#endregion

	//#region <BonusSeniority>
	const getBonusSeniority = () =>
		api.bonus.getBonusSeniority.useQuery({ period_id, bonus_type });
	const updateBonusSeniority =
		api.bonus.updateBonusSeniority.useMutation({
			onSuccess: () => {
				ctx.bonus.getBonusSeniority.invalidate();
			},
		});
	const createBonusSeniority =
		api.bonus.createBonusSeniority.useMutation({
			onSuccess: () => {
				ctx.bonus.getBonusSeniority.invalidate();
			},
		});
	const deleteBonusSeniority =
		api.bonus.deleteBonusSeniority.useMutation({
			onSuccess: () => {
				ctx.bonus.getBonusSeniority.invalidate();
			},
		});
	//#endregion

	// //#region <PerformanceLevel>
	// const getPerformanceLevel = () =>
	// 	api.parameters.getCurrentPerformanceLevel.useQuery();
	// const updatePerformanceLevel =
	// 	api.parameters.updatePerformanceLevel.useMutation({
	// 		onSuccess: () => {
	// 			ctx.parameters.getCurrentPerformanceLevel.invalidate();
	// 			ctx.parameters.getAllPerformanceLevel.invalidate();
	// 		},
	// 	});
	// const createPerformanceLevel =
	// 	api.parameters.createPerformanceLevel.useMutation({
	// 		onSuccess: () => {
	// 			ctx.parameters.getCurrentPerformanceLevel.invalidate();
	// 			ctx.parameters.getAllPerformanceLevel.invalidate();
	// 		},
	// 	});
	// const deletePerformanceLevel =
	// 	api.parameters.deletePerformanceLevel.useMutation({
	// 		onSuccess: () => {
	// 			ctx.parameters.getCurrentPerformanceLevel.invalidate();
	// 			ctx.parameters.getAllPerformanceLevel.invalidate();
	// 		},
	// 	});
	// //#endregion

	//#region <EmployeeBonus>
	const getEmployeeBonus = () =>
		api.bonus.getEmployeeBonus.useQuery({ period_id, bonus_type });
	const updateEmployeeBonus = api.bonus.updateEmployeeBonus.useMutation({
		onSuccess: () => {
			ctx.bonus.getEmployeeBonus.invalidate();
		},
	});
	const createEmployeeBonus = api.bonus.createEmployeeBonus.useMutation({
		onSuccess: () => {
			ctx.bonus.getEmployeeBonus.invalidate();
		},
	});
	const deleteEmployeeBonus = api.bonus.deleteEmployeeBonus.useMutation({
		onSuccess: () => {
			ctx.bonus.getEmployeeBonus.invalidate();
		},
	});
	const autoCalculateEmployeeBonus = api.bonus.autoCalculateEmployeeBonus.useMutation({
		onSuccess: () => {
			ctx.bonus.getEmployeeBonus.invalidate();
		},
	});
	//#endregion

	const functionsDictionary: Record<TableEnum, FunctionsApi> = {
		// TableBonusSetting: {
		// 	queryFunction: getBonusSetting,
		// 	updateFunction: updateBonusSetting,
		// 	createFunction: createBonusSetting,
		// 	deleteFunction: deleteBonusSetting,
		// },
		TableBonusWorkType: {
			queryFunction: getBonusWorkType,
			updateFunction: updateBonusWorkType,
			createFunction: createBonusWorkType,
			deleteFunction: deleteBonusWorkType,
			autoCalculateFunction: undefined,
		},
		TableBonusDepartment: {
			queryFunction: getBonusDepartment,
			updateFunction: updateBonusDepartment,
			createFunction: createBonusDepartment,
			deleteFunction: deleteBonusDepartment,
			autoCalculateFunction: undefined,
		},
		TableBonusPosition: {
			queryFunction: getBonusPosition,
			updateFunction: updateBonusPosition,
			createFunction: createBonusPosition,
			deleteFunction: deleteBonusPosition,
			autoCalculateFunction: undefined,
		},
		TableBonusPositionType: {
			queryFunction: getBonusPositionType,
			updateFunction: updateBonusPositionType,
			createFunction: createBonusPositionType,
			deleteFunction: deleteBonusPositionType,
			autoCalculateFunction: undefined,
		},
		TableBonusSeniority: {
			queryFunction: getBonusSeniority,
			updateFunction: updateBonusSeniority,
			createFunction: createBonusSeniority,
			deleteFunction: deleteBonusSeniority,
			autoCalculateFunction: undefined,
		},
		// TablePerformanceLevel: {
		// 	queryFunction: getPerformanceLevel,
		// 	updateFunction: updatePerformanceLevel,
		// 	createFunction: createPerformanceLevel,
		// 	deleteFunction: deletePerformanceLevel,
		// },
		TableEmployeeBonus: {
			queryFunction: getEmployeeBonus,
			updateFunction: updateEmployeeBonus,
			createFunction: createEmployeeBonus,
			deleteFunction: deleteEmployeeBonus,
			autoCalculateFunction: autoCalculateEmployeeBonus,
		}
	};

	// Return the provider with the functions
	return (
		<bonusToolbarFunctionsContext.Provider
			value={functionsDictionary[selectedTableType]}
		>
			{children}
		</bonusToolbarFunctionsContext.Provider>
	);
}
