import { z } from "zod";
import { dateToString, dateToStringNullable } from "~/server/api/types/z_utils";

export const encDate = z.object({
	start_date: z.string().pipe(z.coerce.date()),
	end_date: z
		.string()
		.nullable()
		.transform((value) => (value === null ? null : new Date(value)))
		.pipe(z.date().nullable()),
});

export const decDate = z.object({
	start_date: dateToString,
	end_date: dateToStringNullable,
});
