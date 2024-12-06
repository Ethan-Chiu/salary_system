import { z } from "zod";
import { dateAll, dateCreate, func, Id } from "./common_type";

const BankSettingBase = z.object({
    bank_code: z.string(),
    bank_name: z.string(),
    org_code: z.string(),
    org_name: z.string(),
});

export const createBankSettingAPI = BankSettingBase.merge(dateCreate);
export const createBankSettingService = BankSettingBase.merge(dateCreate);
export const updateBankSettingAPI = BankSettingBase.merge(dateAll).partial().merge(Id);
export const updateBankSettingService = BankSettingBase.merge(dateAll).partial().merge(Id);

export const bankSettingFE = z
    .object({
        id: z.number(),
    })
    .merge(BankSettingBase)
    .merge(dateAll)
    .merge(func);

export type BankSettingFEType = z.infer<typeof bankSettingFE>;