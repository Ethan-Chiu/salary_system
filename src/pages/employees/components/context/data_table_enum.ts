export const TableEnumValues = [
	"TableEmployeePayment",
	"TableEmployeeTrust",
] as const;

export type TableEnum = (typeof TableEnumValues)[number];

function getTableName(table: TableEnum) {
	switch (table) {
		case "TableEmployeePayment":
			return "employeePayment";
		case "TableEmployeeTrust":
			return "employeeTrust";
	}
}

export function getTableNameKey(table: TableEnum) {
  return `table_name.${getTableName(table)}`
}
