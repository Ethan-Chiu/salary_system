import * as z from "zod";
import { useForm } from "react-hook-form";
import { FieldConfig, FieldConfigItem } from "../types";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../../accordion";
import {
	beautifyObjectName,
	getBaseSchema,
	getBaseType,
	zodToHtmlInputProps,
} from "../utils";
import { FormField } from "../../form";
import { DEFAULT_ZOD_HANDLERS, INPUT_COMPONENTS } from "../config";
import AutoFormArray from "./array";
import { Translate } from "~/lib/utils/translation";

function DefaultParent({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

export default function AutoFormObject<
	SchemaType extends z.ZodObject<any, any>
>({
	schema,
	form,
	fieldConfig,
	path = [],
}: {
	schema: SchemaType | z.ZodEffects<SchemaType>;
	form: ReturnType<typeof useForm>;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	path?: string[];
}) {
	const { shape } = getBaseSchema<SchemaType>(schema);

	return (
		<Accordion type="multiple" className="space-y-5">
			{Object.keys(shape).map((name) => {
				const item = shape[name] as z.ZodAny;
				const zodBaseType = getBaseType(item);
				const itemName =
					item._def.description ?? beautifyObjectName(name);
				const key = [...path, name].join(".");

				if (zodBaseType === "ZodObject") {
					return (
						<AccordionItem value={name} key={key}>
							<AccordionTrigger>{itemName}</AccordionTrigger>
							<AccordionContent className="p-2">
								<AutoFormObject
									schema={
										item as unknown as z.ZodObject<any, any>
									}
									form={form}
									fieldConfig={
										(fieldConfig?.[name] ??
											{}) as FieldConfig<
											z.infer<typeof item>
										>
									}
									path={[...path, name]}
								/>
							</AccordionContent>
						</AccordionItem>
					);
				}
				if (zodBaseType === "ZodArray") {
					return (
						<AutoFormArray
							key={key}
							name={name}
							item={item as unknown as z.ZodArray<any>}
							form={form}
							path={[...path, name]}
						/>
					);
				}

				const fieldConfigItem: FieldConfigItem =
					fieldConfig?.[name] ?? {};
				const zodInputProps = zodToHtmlInputProps(item);

				function getAllProps(s: any) {
					let x = [],
						y: any = [];
					if (s._def.typeName !== undefined) x.push(s._def.typeName);
					if (s._def.innerType) {
						y = x.concat(getAllProps(s._def.innerType));
					} else if (s._def.schema) {
						y = x.concat(getAllProps(s._def.schema));
					}
					return y;
				}
				let allprops = getAllProps((schema as any).shape[name]);
				// Pony's modification
				// const isRequired =
				//   zodInputProps.required ||
				//   fieldConfigItem.inputProps?.required ||
				//   false;
				const isRequired = true && !allprops.includes("ZodOptional");

				return (
					<FormField
						control={form.control}
						name={key}
						key={key}
						render={({ field }) => {
							const inputType =
								fieldConfigItem.fieldType ??
								DEFAULT_ZOD_HANDLERS[zodBaseType] ??
								"fallback";

							const InputComponent =
								typeof inputType === "function"
									? inputType
									: INPUT_COMPONENTS[inputType];
							const ParentElement =
								fieldConfigItem.renderParent ?? DefaultParent;

							return (
								<ParentElement key={`${key}.parent`}>
									<InputComponent
										zodInputProps={zodInputProps}
										field={field}
										fieldConfigItem={fieldConfigItem}
										label={Translate(itemName)}
										isRequired={isRequired}
										zodItem={item}
										fieldProps={{
											...zodInputProps,
											...field,
											...fieldConfigItem.inputProps,
											value: !fieldConfigItem.inputProps
												?.defaultValue
												? field.value ?? ""
												: undefined,
										}}
									/>
								</ParentElement>
							);
						}}
					/>
				);
			})}
		</Accordion>
	);
}
