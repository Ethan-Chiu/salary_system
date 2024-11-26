import { z } from "zod";

export const Id = z.object({
	id: z.number(),
});

export const dateAPI = z.object({
	start_date: z.date().nullable(),
	end_date: z.date().nullable(),
	create_by: z.string(),
	create_date: z.date(),
	update_by: z.string(),
	update_date: z.date(),
});

export const dateService = z.object({
	start_date: z.date().nullable(),
	end_date: z.date().nullable(),
});

export const empData = z.object({
	emp_name: z.string(),
	department: z.string(),
	position: z.number(),
	position_type: z.string(),
}).partial();

export const user = z.object({
	emp_no: z.string(),
	password: z.string(),
	auth_l: z.number(),
});
