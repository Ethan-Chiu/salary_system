import { z } from "zod";
import { isDateType } from "./check_type";
import { Translate } from "./translation";

function getTranslate(key: string) {
	return Translate(key) ?? key;
}
function getRequiredError(key: string) {
	return { required_error: getTranslate(key) + " is required." };
}

export function zodRequiredDate(fieldName: string) {
	return z.preprocess((a) => {
		if (typeof a === "string") {
			return a === "" ? undefined : new Date(a);
		} else if (isDateType(a)) {
			return a;
		} else if (a === undefined) {
			return null;
		}
	}, z.coerce.date(getRequiredError(fieldName)));
}

export function zodOptionalDate() {
	return z.preprocess((d) => {
		if (d === "") {
			return undefined;
		} else if (d === undefined) {
			return null;
		} else {
			return d;
		}
	}, z.coerce.date().optional().nullable());
}
