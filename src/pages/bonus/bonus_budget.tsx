import { useContext } from "react";
import { EmployeeBonusTable } from "./tables/employee_bonus_table_budget";
import periodContext from "~/components/context/period_context";
import dataTableContext from "./components/context/data_table_context";
import { useTranslation } from "react-i18next";

export default function BonusBudget() {
    const { selectedPeriod } = useContext(periodContext)
    const { selectedBonusType } = useContext(dataTableContext);
    const { t } = useTranslation(["common"]);

    if (!selectedPeriod) {
        return <p>{t("others.select_period")}</p>;
    }

    return (
        <EmployeeBonusTable period_id={selectedPeriod.period_id} bonus_type={selectedBonusType} />
    );
}