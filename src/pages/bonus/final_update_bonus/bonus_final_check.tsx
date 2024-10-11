import { useContext } from "react";
import periodContext from "~/components/context/period_context";
import dataTableContext from "../components/context/data_table_context";
import { EmployeeBonusTable } from "../tables/employee_bonus_table_final";

export default function BonusFinalCheck() {
    const { selectedPeriod } = useContext(periodContext)
    const { selectedBonusType } = useContext(dataTableContext);
    return (
        selectedPeriod ? <EmployeeBonusTable period_id={selectedPeriod.period_id} bonus_type={selectedBonusType} viewOnly={true} /> : <></>
    );
}