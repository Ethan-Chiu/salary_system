import { z } from "zod";
import { dateToString, dateToStringNullable, stringToDate, stringToDateNullable } from "~/server/api/types/z_utils";

export const dateStringF = z.object({
	start_date: z.string(),
	end_date: z.string().nullable()
})

export const dateF = z.object({
	start_date: z.date(),
	end_date: z.date().nullable()
})

export const decDate = z.object({
	start_date: stringToDate,
	end_date: stringToDateNullable,
});

export const encDate = z.object({
	start_date: dateToString,
	end_date: dateToStringNullable,
});
