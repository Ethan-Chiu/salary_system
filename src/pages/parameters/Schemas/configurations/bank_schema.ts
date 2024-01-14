import { z } from "zod";

export const bankSchema = z.object({
  bank_code: z.string().min(3).max(3).refine((val) => /^\d+$/.test(val), {
    message: "bank_code must be a 3-digit number",
  }),
  bank_name: z.string(),
  org_code: z.string().min(3).max(3).refine((val) => /^\d+$/.test(val), {
    message: "org_code must be a 3-digit number",
  }),
  org_name: z.string(),
  start_date: z.date(),
  end_date: z.date().optional(),
});