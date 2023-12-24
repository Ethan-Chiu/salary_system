import { randomInt } from "crypto";
import * as z from "zod";
import { isNumber, isDate, isString } from "~/pages/develop_parameters/utils/checkType";
import { Translate } from "~/pages/develop_parameters/utils/translation";

function getTranslate(key: string) {
	return Translate(key) ?? "Not found"
}

function getRequiredError(key: string) {
	return {required_error: getTranslate(key) + " is required."};
}

// input: [{key = key1, type = "string" | "number" | "date" required = true}, {}, {}]
function createOneKeySchema(key: string, config: any, defaultValue?: any) {
	let schema = undefined;
	let type = config.type;

	// required prop
	if(config.required === false) {
		if(type === "string") schema = z.coerce.string().optional();
		if(type === "number") schema = z.coerce.number().optional();
		if(type === "date") schema = z.coerce.date().optional();
	}
	else {
		if(type === "string") schema = z.coerce.string(getRequiredError(key));
		if(type === "number") {
			schema = z.preprocess(
				(a) => parseInt(a as string, 10),
				z.coerce.number(getRequiredError(key))
			);
		}
		if(type === "date") schema = z.coerce.date(getRequiredError(key));
			
	}

	// set min
	if(config.min !== undefined) {
		if(type === "number") schema = (schema as any).refine((a: number) => (a>=config.min), "min value: " + config.min.toString());
		if(type === "string") schema = (schema as any).refine((s: string) => (s.length>=config.min), "min length: " + config.min.toString());
		if(type === "date") schema = (schema as any).refine((d: Date) => (d >= new Date(config.min)), "min date: " + (new Date(config.min)).toISOString().split("T")[0]);
	}

	// set description
	schema = (!config.description)?
		(schema as any).describe(getTranslate(key))
		:(schema as any).describe(config.description);




	// set default value
	if(defaultValue !== undefined) {
		if(type === "date")	schema = (schema as any).default(new Date(defaultValue));
		if(type === "number")	schema = (schema as any).default(defaultValue);
		if(type === "string")	schema = (schema as any).default(defaultValue);
	}

	return schema;
}

export function createSchema(config: any, defaultValues?: any) {
	let schemas: any = {};
	Object.keys(config).forEach(function(key) {
		const schema = (key in defaultValues)
		? createOneKeySchema(key, config[key], defaultValues[key])
		: createOneKeySchema(key, config[key]);
  
	  	schemas[key] = schema;
	})

	return z.object(schemas);
}
  
