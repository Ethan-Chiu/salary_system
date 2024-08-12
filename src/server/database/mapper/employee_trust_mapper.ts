import { container, injectable } from "tsyringe";
import { z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import { EmployeeTrust, EmployeeTrustFE } from "~/server/api/types/employee_trust";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { convertDatePropertiesToISOString } from "./helper_function";

@injectable()
export class EmployeeTrustMapper {
    async getEmployeeTrustFE(employee_trust: z.infer<typeof EmployeeTrust>): Promise<z.infer<typeof EmployeeTrustFE>> {
        const employeeDataService = container.resolve(EmployeeDataService)
        const employee = await employeeDataService.getEmployeeDataByEmpNo(employee_trust.emp_no)
        if (employee == null) {
            throw new BaseResponseError("Employee does not exist")
        }

        const employeeTrustFE: z.infer<typeof EmployeeTrustFE> = {
            ...employee_trust,
            emp_name: employee.emp_name,
            department: employee.department,
        }

        return convertDatePropertiesToISOString(employeeTrustFE)
    }
}