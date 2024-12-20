import { useContext } from "react";
import { useTranslation } from "react-i18next";
import dataTableContext from "../context/data_table_context";
import { FunctionsComponent } from "~/components/data_table/functions_component";

export function DataTableFunctions() {
	const { t } = useTranslation(['common', 'nav']);
	const { setOpen, setMode, functionsItem } = useContext(dataTableContext);

	return (
		<FunctionsComponent
			t={t}
			setOpen={setOpen}
			setMode={setMode}
			functionsItem={functionsItem}
		/>
	);
}
