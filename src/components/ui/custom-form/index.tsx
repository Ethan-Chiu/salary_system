"use client";

import React, { PropsWithChildren } from "react";
import { z } from "zod";
import { Form } from "../form";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../button";
import { cn } from "~/lib/utils";

import {
	ZodObjectOrWrapped,
} from "./utils";
import { parseSchema } from "./parser";
import { AutoFormField } from "./field";

export function AutoFormSubmit({ children }: { children?: React.ReactNode }) {
	return <Button type="submit">{children ?? "Submit"}</Button>;
}

/* interface FormConfig<T extends z.AnyZodObject> { */
/* 	schema: T; */
/* 	form_fields: { */
/* 		name: FieldPath<z.infer<T>>; */
/* 		label?: string; */
/* 		placeholder?: string; */
/* 		description?: string; */
/* 		render?: ControllerProps<z.infer<T>, FieldPath<z.infer<T>>>["render"]; */
/* 	}[]; */
/* 	display_fields?: { */
/* 		label?: string; */
/* 		placeholder?: string; */
/* 		description?: string; */
/* 		render: () => React.ReactNode; */
/* 	}[]; */
/* } */

interface CustomFormProps<SchemaType extends ZodObjectOrWrapped>
	extends PropsWithChildren {
	formSchema: SchemaType;
	values?: Partial<z.infer<SchemaType>>;
	onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
	onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
	onSubmit?: (values: z.infer<SchemaType>) => void;
	/* fieldConfig?: FieldConfig<z.infer<SchemaType>>; */
	className?: string;
}

export default function CustomForm<SchemaType extends ZodObjectOrWrapped>({
	formSchema,
	values: valuesProp,
	onValuesChange: onValuesChangeProp,
	onParsedValuesChange,
	onSubmit: onSubmitProp,
	/* fieldConfig, */
	children,
	className,
}: CustomFormProps<SchemaType>) {
	const parsedSchema = parseSchema(formSchema);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		values: valuesProp,
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		const parsedValues = formSchema.safeParse(values);
		if (parsedValues.success) {
			onSubmitProp?.(parsedValues.data);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					void form.handleSubmit(onSubmit)(e);
				}}
				onChange={() => {
					const values = form.getValues();
					onValuesChangeProp?.(values);
					const parsedValues = formSchema.safeParse(values);
					if (parsedValues.success) {
						onParsedValuesChange?.(parsedValues.data);
					}
				}}
				className={cn("space-y-5", className)}
				id="parameter_form"
			>
				{parsedSchema.fields.map((field) => (
					<AutoFormField
						key={field.key}
						field={field}
						path={[field.key]}
					/>
				))}
				{children}
			</form>
		</Form>
	);
}
