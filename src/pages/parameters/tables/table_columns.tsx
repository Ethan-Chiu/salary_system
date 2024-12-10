import { type ColumnDef } from "@tanstack/react-table";
import { type ParameterTableEnum } from "../parameter_tables";
import { attendanceMapper, attendance_columns } from "./attendance_table";
import { bankSettingMapper, bank_columns } from "./bank_table";
import {
	insuranceRateMapper,
	insurance_rate_columns,
} from "./insurance_rate_table";
import { trustMoneyMapper, trust_money_columns } from "./trust_money_table";
import { levelMapper, level_columns } from "./level_table";
import { levelRangeMapper, level_range_columns } from "./level_range_table";
import { salary_income_tax_columns, salaryIncomeTaxMapper } from "./salary_income_tax_table";
import { type TFunction } from "i18next";
import { FunctionMode } from "../components/function_sheet/data_table_functions";

export function getTableColumn(
	selectedTableType: ParameterTableEnum,
	t: TFunction<[string], undefined>,
	period_id: number,
	open: boolean,
	setOpen: (open: boolean) => void,
	mode: FunctionMode,
	setMode: (mode: FunctionMode) => void
): ColumnDef<any, any>[] {
	switch (selectedTableType) {
		case "TableAttendance":
			return attendance_columns({ t });
		case "TableBankSetting":
			return bank_columns({ t, period_id, open, setOpen, mode, setMode });
		case "TableInsurance":
			return insurance_rate_columns({ t });
		case "TableTrustMoney":
			return trust_money_columns({ t, period_id, open, setOpen, mode, setMode });
		case "TableLevelRange":
			return level_range_columns({ t, period_id, open, setOpen, mode, setMode });
		case "TableLevel":
			return level_columns({ t, period_id, open, setOpen, mode, setMode });
		case "TableSalaryIncomeTax":
			return salary_income_tax_columns({ t, period_id, open, setOpen, mode, setMode });
	}
}

export function getTableMapper(selectedTableType: ParameterTableEnum) {
	switch (selectedTableType) {
		case "TableAttendance":
			return attendanceMapper;
		case "TableBankSetting":
			return bankSettingMapper;
		case "TableInsurance":
			return insuranceRateMapper;
		case "TableTrustMoney":
			return trustMoneyMapper;
		case "TableLevelRange":
			return levelRangeMapper;
		case "TableLevel":
			return levelMapper;
		case "TableSalaryIncomeTax":
			return salaryIncomeTaxMapper;
	}
}
