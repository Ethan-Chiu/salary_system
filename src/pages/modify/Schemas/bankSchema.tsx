import * as z from "zod";

export const bankSchema = (data: any) => {
	return z.object({
		bank_code: 
			z.string()
			.refine(x => x !== "", {
				message: "bank_code is required",
			})
			.describe("bank_code")
			.default(data.bank_code),
		bank_name: 
			z.string()
			.refine(x => x !== "", {
				message: "bank_name is required",
			})
			.describe("bank_name")
			.default(data.bank_name),
		org_code: 
			z.string()
			.refine(x => x !== "", {
				message: "org_code is required",
			})
			.describe("org_code")
			.default(data.org_code),
		org_name: 
			z.string()
			.refine(x => x !== "", {
				message: "org_name is required",
			})
			.describe("org_name")
			.default(data.org_name),
		start_date: z.coerce.date().describe("start date").default(new Date(data.start_date)),
		// end_date: z.coerce.date().describe("end date").default(data.end_date).optional(),
	});
};
