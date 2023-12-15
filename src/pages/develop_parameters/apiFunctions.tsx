import { api } from "~/utils/api";

import * as TN from "../table_names"
import { create } from "domain";
import { notFound } from "next/navigation";


const notFoundFunction = (d: any) => {console.log("not found")}

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

// Bonus api functions
export function getBonusSettingFunctions(func_name: string, getBonusSetting: any) {
    const updateBonusSetting = api.parameters.updateBonusSetting.useMutation({onSuccess: () => {getBonusSetting.refetch();},});
    const createBonusSetting = api.parameters.createBonusSetting.useMutation({onSuccess: () => {getBonusSetting.refetch();},});
    const deleteBonusSetting = api.parameters.deleteBonusSetting.useMutation({onSuccess: () => {getBonusSetting.refetch();},});
    if(func_name === "update")  return updateBonusSetting;
    else if(func_name === "create") return createBonusSetting;
    else if(func_name === "delete") return deleteBonusSetting;
    else    return notFoundFunction;
}


export function getBonusDepartmentFunctions(func_name: string, getBonusDepartment: any) {
    const updateBonusDepartment = api.parameters.updateBonusDepartment.useMutation({onSuccess: () => {getBonusDepartment.refetch();},});
    const createBonusDepartment = api.parameters.createBonusDepartment.useMutation({onSuccess: () => {getBonusDepartment.refetch();},});
    const deleteBonusDepartment = api.parameters.deleteBonusDepartment.useMutation({onSuccess: () => {getBonusDepartment.refetch();},});
    if(func_name === "update")  return updateBonusDepartment;
    else if(func_name === "create") return createBonusDepartment;
    else if(func_name === "delete") return deleteBonusDepartment;
    else    return notFoundFunction;
}

export function getBonusPositionFunctions(func_name: string, getBonusPosition: any) {
    const updateBonusPosition = api.parameters.updateBonusPosition.useMutation({onSuccess: () => {getBonusPosition.refetch();},});
    const createBonusPosition = api.parameters.createBonusPosition.useMutation({onSuccess: () => {getBonusPosition.refetch();},});
    const deleteBonusPosition = api.parameters.deleteBonusPosition.useMutation({onSuccess: () => {getBonusPosition.refetch();},});
    if(func_name === "update")  return updateBonusPosition;
    else if(func_name === "create") return createBonusPosition;
    else if(func_name === "delete") return deleteBonusPosition;
    else    return notFoundFunction;
}

export function getBonusPositionTypeFunctions(func_name: string, getBonusPositionType: any) {
    const updateBonusPositionType = api.parameters.updateBonusPositionType.useMutation({onSuccess: () => {getBonusPositionType.refetch();},});
    const createBonusPositionType = api.parameters.createBonusPositionType.useMutation({onSuccess: () => {getBonusPositionType.refetch();},});
    const deleteBonusPositionType = api.parameters.deleteBonusPositionType.useMutation({onSuccess: () => {getBonusPositionType.refetch();},});
    if(func_name === "update")  return updateBonusPositionType;
    else if(func_name === "create") return createBonusPositionType;
    else if(func_name === "delete") return deleteBonusPositionType;
    else    return notFoundFunction;
}


export function getBonusSeniorityFunctions(func_name: string, getBonusSeniority: any) {
    const updateBonusSeniority = api.parameters.updateBonusSeniority.useMutation({onSuccess: () => {getBonusSeniority.refetch();},});
    const createBonusSeniority = api.parameters.createBonusSeniority.useMutation({onSuccess: () => {getBonusSeniority.refetch();},});
    const deleteBonusSeniority = api.parameters.deleteBonusSeniority.useMutation({onSuccess: () => {getBonusSeniority.refetch();},});
    if(func_name === "update")  return updateBonusSeniority;
    else if(func_name === "create") return createBonusSeniority;
    else if(func_name === "delete") return deleteBonusSeniority;
    else    return notFoundFunction;
}

export function getInsuranceFunctions(func_name: string, getInsurance: any) {
    const updateInsuranceRateSetting = api.parameters.updateInsuranceRateSetting.useMutation({onSuccess: () => {getInsurance.refetch();},});
    const createInsuranceRateSetting = api.parameters.createInsuranceRateSetting.useMutation({onSuccess: () => {getInsurance.refetch();},});
    const deleteInsuranceRateSetting = api.parameters.deleteInsuranceRateSetting.useMutation({onSuccess: () => {getInsurance.refetch();},});
    if(func_name === "update")  return updateInsuranceRateSetting;
    else if(func_name === "create") return createInsuranceRateSetting;
    else if(func_name === "delete") return deleteInsuranceRateSetting;
    else    return notFoundFunction;
}