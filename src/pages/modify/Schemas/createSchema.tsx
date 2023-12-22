import * as z from "zod";
import { Translate } from "~/pages/develop_parameters/utils/translation";

function getTranslate(key: string) {
	return Translate(key) ?? "Not found"
}

function getRequiredError(key: string) {
	return {required_error: getTranslate(key) + " is required."}
}

// input: [{key = key1, type = "string" | "number" | "date" required = true}, {}, {}]
export function createOneKeySchema(data: any) {
	let schema;
	if(data.required === false) {
		if(data.type === "string") schema = z.coerce.string();
		if(data.type === "number") schema = z.coerce.number();
		if(data.type === "date") schema = z.coerce.date();
	}
	else {
		if(data.type === "string") 
			schema = z.coerce.string(getRequiredError(data.key));
		if(data.type === "number") schema = z.coerce.number(getRequiredError(data.key));
		if(data.type === "date") schema = z.coerce.date(getRequiredError(data.key));
	}
	schema = schema!.describe(getTranslate(data.key));
	return schema;
}




// const x = [
// 	{ key: "personal_leave_dock", type: "number" },
// 	{ key: "sick_leave_dock", type: "number" },
// 	{ key: "rate_of_unpaid_leave", type: "number" },
// 	{ key: "unpaid_leave_compensatory_1", type: "number" },
// 	{ key: "unpaid_leave_compensatory_2", type: "number" },
// 	{ key: "unpaid_leave_compensatory_3", type: "number" },
// 	{ key: "unpaid_leave_compensatory_4", type: "number" },
// 	{ key: "unpaid_leave_compensatory_5", type: "number" },
// 	{ key: "overtime_by_foreign_workers_1", type: "number" },
// 	{ key: "overtime_by_foreign_workers_2", type: "number" },
// 	{ key: "overtime_by_foreign_workers_3", type: "number" },
// 	{ key: "overtime_by_local_workers_1", type: "number" },
// 	{ key: "overtime_by_local_workers_2", type: "number" },
// 	{ key: "overtime_by_local_workers_3", type: "number" },
// 	{ key: "local_worker_holiday", type: "number" },
// 	{ key: "foreign_worker_holiday", type: "number" },
// 	{ key: "start date", type: "number" },
//   ];
  

// export const attendanceSchema = (data: any) => {
// 	const allSchema = x.reduce((acc: any, curr: any) => {
// 		acc[curr.key] = createOneKeySchema(curr);
//   		return acc;
// 	}, {})

// }
