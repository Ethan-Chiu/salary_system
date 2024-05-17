import { container, injectable } from "tsyringe";
import { FunctionsEnum, SyncService } from "./sync_service";

interface EmployeeInformation {
    month_salary: boolean;
}


@injectable()
export class EmployeeInformationService {
    /* constructor() {} */

    async addEmployeeInformation<T extends { emp_no: string }>(
        period: number,
        data: T[],
    ): Promise<(T & EmployeeInformation)[]> {
        const emp_no_list_month_salary = await this.getCurrentMonthPayEmpNo(period)
        return data.map(e => {
            return { ...e, month_salary: emp_no_list_month_salary.includes(e.emp_no) }
        })
    };

    async getCurrentMonthPayEmpNo(period: number): Promise<string[]> {
        const syncService = container.resolve(SyncService);
        const employees = await syncService.getCandPaidEmployees(FunctionsEnum.enum.month_salary, period);
        return employees.map((emp) => emp.emp_no);
    }
}
