import { z } from "zod";

export const Id = z.object({
	id: z.number(),
});

export const DateAPI = z.object({
	start_date: z.date().nullable() || z.string().nullable(),
	end_date: z.date().nullable() || z.string().nullable(),
});

export const DateService = z.object({
	start_date: z.string().nullable(),
	end_date: z.string().nullable(),
});

export const EmpData = z.object({
	emp_name: z.string(),
	department: z.string(),
	position: z.number(),
	position_type: z.string(),
}).partial();

export const User = z.object({
	emp_no: z.string(),
	password: z.string(),
	auth_l: z.number(),
});
