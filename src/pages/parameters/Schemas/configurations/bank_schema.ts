import { z } from "zod";
import { isDateType } from "~/lib/utils/check_type";
import { Translate } from "~/lib/utils/translation";

function getTranslate(key: string) {
	return Translate(key) ?? key
}
function getRequiredError(key: string) {
	return { required_error: getTranslate(key) + " is required."}
}

export const bankSchema = z.object({
	bank_code: z
		.string()
		.min(3)
		.max(3)
		.refine((val) => /^\d+$/.test(val), {
			message: "bank_code must be a 3-digit number",
		}),
	bank_name: z.string(),
	org_code: z
		.string()
		.min(3)
		.max(3)
		.refine((val) => /^\d+$/.test(val), {
			message: "org_code must be a 3-digit number",
		}),
	org_name: z.string(),
	start_date: z.preprocess((a) => {
    if (typeof a === "string") {
      return (a === "") ? undefined : new Date(a);
    }
    else if (isDateType(a)) {
      return a;
    }
    else if (a === undefined) {					
      return null;
    }
  }, z.coerce.date(getRequiredError("start_date"))),
	end_date: z.preprocess((d) => {
		if (d === "") {
			return undefined;
		} else if (d === undefined) {
			return null;
		} else {
			return d;
		}
	}, z.coerce.date().optional().nullable()),
});
