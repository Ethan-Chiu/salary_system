import { api } from "~/utils/api";

import * as TN from "../table_names"
import { create } from "domain";
import { notFound } from "next/navigation";


// Attendance api functions
export function getAttendanceFunctions(func_name: string, getAttendanceSetting: any) {
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
    if(func_name === "create")  return createAttendanceSetting;
    else if(func_name === "update") return updateAttendanceSetting;
    else    return notFoundFunction;
}

// Bank api functions
export function getBankFunctions(func_name: string, getBankSetting: any) {
    const updateBankSetting = api.parameters.updateBankSetting.useMutation({onSuccess: () => {getBankSetting.refetch();},});
    const createBankSetting = api.parameters.createBankSetting.useMutation({onSuccess: () => {getBankSetting.refetch();},});
    const deleteBankSetting = api.parameters.deleteBankSetting.useMutation({onSuccess: async() => {await getBankSetting.refetch();},});
    if(func_name === "update")  return updateBankSetting;
    else if(func_name === "create") return createBankSetting;
    else if(func_name === "delete") return deleteBankSetting;
    else    return notFoundFunction;
}

// 


const notFoundFunction = (d: any) => {console.log("not found")}



