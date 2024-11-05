import { z } from "zod";
import { dateToString, dateToStringNullable } from "~/server/api/types/z_utils";

export const encDate = z.object({
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
})

export const decDate = z.object({
	start_date: dateToString,
	end_date: dateToStringNullable, 
})

