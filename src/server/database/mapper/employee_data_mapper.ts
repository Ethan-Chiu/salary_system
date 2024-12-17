import { container, injectable } from "tsyringe";
import { EmployeeDataDecType, EmployeeData, encEmployeeData, decEmployeeData } from "../entity/SALARY/employee_data";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { BaseMapper } from "./base_mapper";
import { SyncService } from "~/server/service/sync_service";
import { FunctionsEnum } from "~/server/api/types/functions_enum";
import { ZodEnum } from "zod";
import { MonthSalaryStatusEnum, MonthSalaryStatusEnumType } from "~/server/api/types/month_salary_status_enum";
import { WorkStatusEnum } from "~/server/api/types/work_status_enum";

interface EmployeeInformation {
    month_salary_status: MonthSalaryStatusEnumType;
}
@injectable()
export class EmployeeDataMapper extends BaseMapper<
	EmployeeData,
	EmployeeDataDecType
> {
	constructor() {
		super(encEmployeeData, decEmployeeData, [
		]);
	}

	async getEmployeeDataWithInfo(
		dec: EmployeeDataDecType[],
        period_id: number
	) {
		const EmployeeDataFE = await this.addEmployeeInformation(period_id,dec);
		// const EmployeeDataFE = await Promise.all(list.map(async (e) => {
		// 	return {
		// 		...e,
				
		// 	}
		// }))
		return EmployeeDataFE;
	}
    async addEmployeeInformation(
        period: number,
        data: EmployeeDataDecType[],
    ): Promise<(EmployeeDataDecType & EmployeeInformation)[]> {
        const emp_no_list_month_salary = await this.getCurrentMonthPayEmpNo(period)
        return data.map(e => {
            let month_salary_status: MonthSalaryStatusEnumType
            if (emp_no_list_month_salary.includes(e.emp_no)) {
                month_salary_status = MonthSalaryStatusEnum.Enum.未發放月薪
            } else {
                if (e.work_status === WorkStatusEnum.Enum.離職人員) {
                    month_salary_status = MonthSalaryStatusEnum.Enum.離職人員
                } else {
                    month_salary_status = MonthSalaryStatusEnum.Enum.已發放月薪
                }
            }
            return { ...e, month_salary_status: month_salary_status }
        })
    };

    async getCurrentMonthPayEmpNo(period: number): Promise<string[]> {
        const syncService = container.resolve(SyncService);
        const employees = await syncService.getCandPaidEmployees(FunctionsEnum.enum.month_salary, period);
        return employees.map((emp) => emp.emp_no);
    }

}
