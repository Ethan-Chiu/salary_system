import { z } from "zod";
export const bankInput = z.object({bank_code : z.string(), bank_name : z.string(), org_code: z.string(), org_name: z.string(), start_date: z.date(), end_date: z.date().nullable()})
export const attendanceInput = z.object({})