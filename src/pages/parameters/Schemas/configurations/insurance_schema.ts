import { z } from "zod";

export const insuranceSchema = z.object({
  min_wage_rate: z.number(),
  l_i_accident_rate: z.number(),
  l_i_employment_premium_rate: z.number(),
  l_i_occupational_hazard_rate: z.number(),
  l_i_wage_replacement_rate: z.number(),
  h_i_standard_rate: z.number(),
  h_i_avg_dependents_count: z.number(),
  v2_h_i_supp_premium_rate: z.number(),
  v2_h_i_dock_tsx_thres: z.number(),
  start_date: z.date(),
  end_date: z.date().optional(),
});