import { z } from "zod";
import { ParsedField } from "./types";

// TODO: This should support recursive ZodEffects but TypeScript doesn't allow circular type definitions.
export type ZodObjectOrWrapped =
	| z.ZodObject<any, any>
	| z.ZodEffects<z.ZodObject<any, any>>;

/**
 * Get the best label to use for a field.
 * This will use user-provided labels, descriptions from the schema, or the field key.
 *
 * @param field Parsed field
 * @returns Label for the field
 */
export function getLabel(field: ParsedField) {
	return (
		field.fieldConfig?.label ??
		field.description ??
		beautifyLabel(field.key)
	);
}

function beautifyLabel(label: string) {
	if (!label) {
		return "";
	}

	let output = label.replace(/([A-Z])/g, " $1");
	output = output.charAt(0) + output.slice(1);

	// Never return a number for the label
	// This primarily important for array fields so we don't get "0" as a label
	if (!isNaN(Number(output))) {
		return "";
	}

	// Ignore labels for arrays of non-objects
	if (output === "*") {
		return "";
	}

	return output;
}

export function getPathInObject<T extends object>(
	obj: T,
	path: string[]
): { message: string } | undefined {
	let current = obj;
	for (const key of path) {
		if (current !== undefined && key in current) {
      current = current[key as keyof typeof current];
		} else {
			return undefined;
		}
	}

  // Ensure the final result has a structure { message: string }
	if (current !== undefined && typeof current === 'object' && 'message' in current) {
		if (typeof current.message === 'string') {
			return current as { message: string };
		}
	}
	return undefined;
}
