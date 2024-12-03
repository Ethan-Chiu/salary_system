import { z } from "zod";

export const overtimeFE=z.object({
    department: z.string(),
    emp_no: z.string(),
    emp_name: z.string(),
    position: z.number(),
    work_day: z.number(),
    // period_id: number;
	// pay: number;
	// type_id: number;
	// days_radio: string;
	// type_name: string;
	// pay_period: number | null;
	// period_name: string | null;
	// pay_delay: number | null;
	hours_1: z.number(),
	hours_134: z.number(),
	hours_167: z.number(),
	hours_267: z.number(),
	hours_2: z.number(),
	hours_134_TAX: z.number(),
	hours_167_TAX: z.number(),
	hours_267_TAX: z.number(),
	hours_2_TAX: z.number()
})

export type OvertimeFEType = z.infer<typeof overtimeFE>
