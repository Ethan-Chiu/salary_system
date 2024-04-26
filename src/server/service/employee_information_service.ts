import { container, injectable } from "tsyringe";
import { SyncService } from "./sync_service";

interface EmployeeInformation {
    month_pay: boolean;
}


@injectable()
export class EmployeeInformationService {
    /* constructor() {} */

    async addEmployeeInformation<T extends { emp_no: string }>(
        period: number,
        data: T[],
    ): Promise<(T & EmployeeInformation)[]> {
        const emp_no_list_month_pay = await this.getCurrentMonthPayEmpNo(period)
        return data.map(e => {
            return { ...e, month_pay: emp_no_list_month_pay.includes(e.emp_no) }
        })
    };

    async getCurrentMonthPayEmpNo(period: number): Promise<string[]> {
        const syncService = container.resolve(SyncService);
        const employees = await syncService.getCandPaidEmployees("month_salary", period);
        return employees.map((emp) => emp.emp_no);
    }
}
