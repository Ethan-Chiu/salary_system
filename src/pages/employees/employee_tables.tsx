import { type TableEnum } from "./components/context/data_table_enum";


export type EmployeeTableEnum = Extract<
	TableEnum,
	(typeof EmployeeTableEnumValues)[number]
>;

export const EmployeeTableEnumValues = [
	"TableEmployeePayment",
	"TableEmployeeTrust",
] as const;
