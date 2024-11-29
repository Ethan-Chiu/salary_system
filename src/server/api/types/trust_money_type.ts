import { z } from "zod";
import { dateAPI, dateService, Id } from "./common_type";
const TrustMoneyBase = z.object({
	position: z.number(),
	position_type: z.string(),
	org_trust_reserve_limit: z.number(),
	org_special_trust_incent_limit: z.number()
});
export const createTrustMoneyAPI = TrustMoneyBase.merge(
	dateService
).omit({ end_date: true });
export const createTrustMoneyService =
	TrustMoneyBase.merge(dateService);
export const updateTrustMoneyAPI = TrustMoneyBase.merge(
	dateAPI
)
	.partial()
	.merge(Id);
export const updateTrustMoneyService = TrustMoneyBase.merge(
	dateAPI
)
	.partial()
	.merge(Id);
// Frontend Types
export const TrustMoneyFE = z
	.object({
		id: z.number(),
	})
	.merge(TrustMoneyBase)
	.merge(dateAPI);

export type TrustMoneyFEType = z.infer<typeof TrustMoneyFE>;