import { create } from "domain";
import { api } from "~/utils/api";

export type tableFunctions = {
	queryFunction: any;
	createFunction: any;
	updateFunction: any;
	deleteFunction: any;
};

function createTableFunctions(
	queryFunction: any,
	createFunction: any,
	updateFunction: any,
	deleteFunction: any,
) {
    return {
        queryFunction: queryFunction,
        createFunction: createFunction,
        updateFunction: updateFunction,
        deleteFunction: deleteFunction,
    }
}

export const createInstance = () => {
	return {
        "bank_setting": createTableFunctions(
            api.parameters.getBankSetting.useQuery(),
            api.parameters.createBankSetting.useMutation({
                onSuccess: () => {api.parameters.getBankSetting.useQuery().refetch();}
            }),
            api.parameters.updateBankSetting.useMutation({
                onSuccess: () => {api.parameters.getBankSetting.useQuery().refetch();}
            }),
            api.parameters.deleteBankSetting.useMutation({
                onSuccess: () => {api.parameters.getBankSetting.useQuery().refetch();}
            })
        )
	};
};
