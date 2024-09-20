import { useContext } from "react";
import { EmployeeBonusTable } from "./tables/employee_bonus_table";
import periodContext from "~/components/context/period_context";
import dataTableContext from "./components/context/data_table_context";

export default function BonusBudget() {
    const { selectedPeriod } = useContext(periodContext)
    const { selectedBonusType } = useContext(dataTableContext);
    return (
        selectedPeriod ? <EmployeeBonusTable period_id={selectedPeriod.period_id} bonus_type={selectedBonusType} /> : <></>
    );
}