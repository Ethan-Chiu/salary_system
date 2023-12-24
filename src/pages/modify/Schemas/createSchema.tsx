import { randomInt } from "crypto";
import * as z from "zod";
import {
	isNumber,
	isDate,
	isString,
} from "~/pages/develop_parameters/utils/checkType";

import { Translate } from "~/pages/develop_parameters/utils/translation";

function getTranslate(key: string) {
	return Translate(key) ?? "Not found";
}

function getRequiredError(key: string) {
	return { required_error: getTranslate(key) + " is required." };
}

// input: [{key = key1, type = "string" | "number" | "date" required = true}, {}, {}]
function createOneKeySchema(key: string, config: any, defaultValue?: any) {
	let schema = undefined;
	let type = config.type;

	// required prop (default: required = true)
	if (config.required === false || config.optional === true) {
		if (type === "string") schema = z.string().nullable().optional();
		if (type === "number") schema = z.coerce.number().optional();
		if (type === "date") {
			schema = z.preprocess((d) => {
				if(d === "") {
					return undefined;
				} else {
					return d;
				}
			}
				, z.coerce.date().optional().nullable()
			);
		}
	} else {
		if (type === "string") {
			// schema = z.string({required_error: "test"});
			schema = z.preprocess((a) => {
				if (a === "") {
					return null;
				} 
				else if(typeof a === "string") {
					return a;
				}
				else {
					return undefined;
				}
			}, z.string(getRequiredError(key)));
		}
		if (type === "number") {
			schema = z.preprocess((a) => {
				if (typeof a === "string") {
					return parseInt(a, 10);
				} else if (typeof a === "number") {
					return a;
				} else {
					return undefined;
				}
			}, z.coerce.number(getRequiredError(key)));
			// z.coerce.number(getRequiredError(key))
		}
		if (type === "date") {
			schema = z.preprocess((a) => {
				if (typeof a === "string") {
					return (a === "") ? undefined : new Date(a);
				}
				else if (isDate(a)) {
					return a;
				}
				else if (a === undefined) {					
					return null;
				}
			}, z.coerce.date(getRequiredError(key)));
		}
	}

	function checkString(sss: string) {
		return /^[0-9]*$/.test(sss);
	}
	if(config.isNumber && type === "string") {
		console.log("here");
		schema = (schema as any).refine((val: string) => checkString(val), {
			message: "Should be a number string",
		})
	}

	// set min
	if (config.min !== undefined) {
		if (type === "number")
			schema = (schema as any).refine(
				(a: number) => a >= config.min,
				"min value: " + config.min.toString()
			);
		if (type === "string")
			schema = (schema as any).refine(
				(s: string) => s.length >= config.min,
				"min length: " + config.min.toString()
			);
		if (type === "date")
			schema = (schema as any).refine(
				(d: Date) => d >= new Date(config.min),
				"min date: " + new Date(config.min).toISOString().split("T")[0]
			);
	}

	// set max
	if (config.max !== undefined) {
		if (type === "number")
			schema = (schema as any).refine(
				(a: number) => a <= config.max,
				"max value: " + config.max.toString()
			);
		if (type === "string")
			schema = (schema as any).refine(
				(s: string) => s.length <= config.max,
				"max length: " + config.max.toString()
			);
		if (type === "date")
			schema = (schema as any).refine(
				(d: Date) => d <= new Date(config.max),
				"max date: " + new Date(config.max).toISOString().split("T")[0]
			);
	}

	// set description
	schema = !config.description
		? (schema as any).describe(getTranslate(key))
		: (schema as any).describe(config.description);

	// set default value
	if (defaultValue !== undefined && defaultValue !== null) {
		if (type === "date")
			schema = (schema as any).default(defaultValue);
		if (type === "number") schema = (schema as any).default(defaultValue);
		if (type === "string") schema = (schema as any).default(defaultValue);
	}

	return schema;
}

export function createSchema(config: any, defaultValues?: any) {
	let schemas: any = {};
	Object.keys(config).forEach(function (key) {
		const schema =
			key in defaultValues
				? createOneKeySchema(key, config[key], defaultValues[key])
				: createOneKeySchema(key, config[key]);

		schemas[key] = schema;
	});

	return z.object(schemas);
}
