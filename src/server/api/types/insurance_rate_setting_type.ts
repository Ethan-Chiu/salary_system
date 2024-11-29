import { z } from "zod";
import { dateAPI, dateService, Id } from "./common_type";
const InsuranceRateSettingBase = z.object({
	min_wage_rate: z.number(),
	l_i_accident_rate: z.number(),
	l_i_employment_pay_rate: z.number(),
	l_i_occupational_injury_rate: z.number(),
	l_i_wage_replacement_rate: z.number(),
	h_i_standard_rate: z.number(),
	h_i_avg_dependents_count: z.number(),
	v2_h_i_supp_pay_rate: z.number(),
	v2_h_i_deduction_tsx_thres: z.number(),
	v2_h_i_multiplier: z.number(),
});
export const createInsuranceRateSettingAPI = InsuranceRateSettingBase.merge(
	dateService
).omit({ end_date: true });
export const createInsuranceRateSettingService =
	InsuranceRateSettingBase.merge(dateService);
export const updateInsuranceRateSettingAPI = InsuranceRateSettingBase.merge(
	dateAPI
)
	.partial()
	.merge(Id);
export const updateInsuranceRateSettingService = InsuranceRateSettingBase.merge(
	dateAPI
)
	.partial()
	.merge(Id);
// Frontend Types
export const insuranceRateSettingFE = z
	.object({
		id: z.number(),
	})
	.merge(InsuranceRateSettingBase)
	.merge(dateAPI);

export type InsuranceRateSettingFEType = z.infer<typeof insuranceRateSettingFE>;