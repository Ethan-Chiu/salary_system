import React, { createContext, PropsWithChildren, useContext } from "react";
import { api } from "~/utils/api";
import { BonusTableEnum } from "../../bonus_tables";
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

export const bonusToolbarFunctionsContext = createContext<FunctionsApi>({
	queryFunction: undefined,
	updateFunction: undefined,
	createFunction: undefined,
	deleteFunction: undefined,
});

interface ToolbarFunctionsProviderProps {
	selectedTableType: BonusTableEnum;
	period_id: number;
}

export default function BonusToolbarFunctionsProvider({
	children,
	selectedTableType,
	period_id,
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
		api.parameters.getCurrentBonusWorkType.useQuery();
	const updateBonusWorkType = api.parameters.updateBonusWorkType.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusWorkType.invalidate();
			ctx.parameters.getAllBonusWorkType.invalidate();
		},
	});
	const createBonusWorkType = api.parameters.createBonusWorkType.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusWorkType.invalidate();
			ctx.parameters.getAllBonusWorkType.invalidate();
		},
	});
	const deleteBonusWorkType = api.parameters.deleteBonusWorkType.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusWorkType.invalidate();
			ctx.parameters.getAllBonusWorkType.invalidate();
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

	const functionsDictionary: Record<BonusTableEnum, FunctionsApi> = {
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
		// TablePerformanceLevel: {
		// 	queryFunction: getPerformanceLevel,
		// 	updateFunction: updatePerformanceLevel,
		// 	createFunction: createPerformanceLevel,
		// 	deleteFunction: deletePerformanceLevel,
		// },
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
