import { z } from "zod";

export const PayTypeEnum = z.enum([
	"month_salary",
	"foreign_15_bonus",
	"Q1_performance",
	"Q2_performance",
	"Q3_performance",
	"Q4_performance",
]);
export type PayTypeEnumType = z.infer<typeof PayTypeEnum>;
export function payTypeLabel(pay_type: PayTypeEnumType): string {
    switch (pay_type) {
		case "month_salary":
			return "月薪"
		case "foreign_15_bonus":
			return "外勞15日獎金"
		case "Q1_performance":
			return "Q1績效"
		case "Q2_performance":
			return "Q2績效"
		case "Q3_performance":
			return "Q3績效"
		case "Q4_performance":
			return "Q4績效"
    }
}