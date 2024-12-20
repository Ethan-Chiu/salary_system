import { z } from "zod";
import { ParsedField, ParsedSchema } from "./types";
import { inferFieldType } from "./infer-field-type";

export type ZodObjectOrWrapped =
	| z.ZodObject<any, any>
	| z.ZodEffects<z.ZodObject<any, any>>;

function parseField(
	key: string,
	schema: z.ZodAny | z.AnyZodObject
): ParsedField {
	const baseSchema = getBaseSchema(schema);
	/* const fieldConfig = getFieldConfigInZodStack(schema); */
	const type = inferFieldType(baseSchema);
	/* const defaultValue = getDefaultValueInZodStack(schema); */

  console.log(baseSchema)
	// Enums
	const options = baseSchema._def.values;
	let optionValues: [string, string][] = [];
	if (options) {
		if (!Array.isArray(options)) {
			optionValues = Object.entries(options);
		} else {
			optionValues = options.map((value) => [value, value]);
		}
	}

	// Arrays and objects
	let subSchema: ParsedField[] = [];
	if (baseSchema instanceof z.ZodObject) {
		subSchema = Object.entries(baseSchema.shape).map(([key, field]) =>
			parseField(key, field as z.ZodTypeAny)
		);
	}
	if (baseSchema instanceof z.ZodArray) {
		subSchema = [parseField("0", baseSchema._def.type)];
	}

	return {
		key,
		type,
		required: !schema.isOptional(),
		/* default: defaultValue, */
		description: baseSchema.description,
		/* fieldConfig, */
		options: optionValues,
		schema: subSchema,
	};
}

/**
 * Get the lowest level Zod type.
 * This will unpack optionals, refinements, etc.
 */
function getBaseSchema<ChildType extends z.ZodAny | z.AnyZodObject = z.ZodAny>(
	schema: ChildType | z.ZodEffects<ChildType>
): ChildType {
	if ("innerType" in schema._def) {
		return getBaseSchema(schema._def.innerType as ChildType);
	}
	if ("schema" in schema._def) {
		return getBaseSchema(schema._def.schema);
	}

	return schema as ChildType;
}

export function parseSchema(schema: ZodObjectOrWrapped): ParsedSchema {
	const objectSchema =
		schema instanceof z.ZodEffects ? schema.innerType() : schema;

	const shape: z.infer<typeof objectSchema> = objectSchema.shape;

	const fields: ParsedField[] = Object.entries(shape).map(([key, field]) =>
		parseField(key, field as z.ZodAny)
	);

	return { fields };
}
