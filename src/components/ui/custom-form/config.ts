import { BooleanField } from "./fields/boolean_field";
import { DateField } from "./fields/date_field";
import { NumberField } from "./fields/number_field";
import { SelectField } from "./fields/select_field";
import { StringField } from "./fields/string_field";

export const FIELD_COMPONENTS = {
  string: StringField,
  number: NumberField,
  boolean: BooleanField,
  date: DateField,
  select: SelectField,

	fallback: StringField,
} as const;

export type FieldTypes = keyof typeof FIELD_COMPONENTS;
