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
function createOneKeySchema(data: any, defaultValue?: any) {
	let schema = undefined;
	if(data.required === false) {
		if(data.type === "string") schema = z.coerce.string().optional();
		if(data.type === "number") schema = z.coerce.number().optional();
		if(data.type === "date") schema = z.coerce.date().optional();
	}
	else {
		if(data.type === "string") 
			schema = z.coerce.string(getRequiredError(data.key));
		if(data.type === "number") schema = z.coerce.number(getRequiredError(data.key));
		if(data.type === "date") schema = z.coerce.date(getRequiredError(data.key));
	}

	schema = (schema as any).describe(getTranslate(data.key));
	
	if(defaultValue || defaultValue === 0) {
		if(data.type === "date")
			schema = (schema as any).default(new Date(defaultValue));
		else if(data.type === "number")	{
			console.log(data);
			console.log(defaultValue);
			schema = (schema as any).default(defaultValue);
		}
		else if(data.type === "string")
			schema = (schema as any).default(defaultValue);
	}
	return schema;
}

export function createSchema(config: any, defaultValues?: any) {
	let schemas: any = {};
  
	for (const c of config) {
	  const schema = (c.key in defaultValues)
		? createOneKeySchema(c, defaultValues[c.key])
		: createOneKeySchema(c);
  
	  schemas[c.key] = schema;
	}
	
	console.log(schemas);

	return z.object(schemas);
  }
  
