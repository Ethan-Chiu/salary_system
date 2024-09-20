import { EmployeeBonusTable } from "./tables/employee_bonus_table";

export default function BonusBudget() {
    return (
        <EmployeeBonusTable period_id={127} bonus_type="project_bonus" />
    );
}