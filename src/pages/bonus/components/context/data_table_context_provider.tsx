import React, { useState, type PropsWithChildren } from "react";
import dataTableContext from "./data_table_context";
import {
	type BonusTableEnum,
	BonusTableEnumValues,
} from "../../bonus_tables";
import { type Table } from "@tanstack/react-table";
import { BonusTypeEnum, BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";

interface DataTableContextProviderProps { }

export type TableObject = {
	table: Table<any>;
};

export default function DataTableContextProvider({
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTableType, setSelectedTableType] =
		useState<BonusTableEnum>(BonusTableEnumValues[0]);
	const [selectedBonusType, setSelectedBonusType] = useState<BonusTypeEnumType>(
		Object.values(BonusTypeEnum.Enum)[0]!
	);
	const [selectedTable, setSelectedTable] = useState<TableObject | null>(
		null
	);

	return (
		<dataTableContext.Provider
			value={{
				selectedTableType,
				setSelectedTableType,
				selectedBonusType,
				setSelectedBonusType,
				selectedTable,
				setSelectedTable,
			}}
		>
			{children}
		</dataTableContext.Provider>
	);
}
