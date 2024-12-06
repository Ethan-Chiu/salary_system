import { z } from "zod";

export const dateStringF = z.object({
	start_date: z.string(),
	end_date: z.string().nullable(),
});

export const dateCreateF = z.object({
	create_date: z.date(),
	update_date: z.date(),
})

export const dateF = z.object({
	start_date: z.date(),
	end_date: z.date().nullable(),
	create_date: z.date(),
	update_date: z.date(),
});

export const systemF = z.object({
	id: z.number(),
	create_date: z.date(),
	update_date: z.date(),
});

export const systemKeys: { id: true; create_date: true; update_date: true } = {
	id: true,
	create_date: true,
	update_date: true,
};
