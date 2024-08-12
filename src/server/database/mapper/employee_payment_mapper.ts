import { container, injectable } from "tsyringe";
import { z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import { EmployeePayment, EmployeePaymentFE } from "~/server/api/types/employee_payment_type";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { convertDatePropertiesToISOString } from "./helper_function";

@injectable()
export class EmployeePaymentMapper {
    async getEmployeePaymentFE(employee_payment: z.infer<typeof EmployeePayment>): Promise<z.infer<typeof EmployeePaymentFE>> {
        const employeeDataService = container.resolve(EmployeeDataService)
        const employee = await employeeDataService.getEmployeeDataByEmpNo(employee_payment.emp_no)
        if (employee == null) {
            throw new BaseResponseError("Employee does not exist")
        }

        const employeePaymentFE: z.infer<typeof EmployeePaymentFE> = {
            ...employee_payment,
            emp_name: employee.emp_name,
            department: employee.department,
        }

        return convertDatePropertiesToISOString(employeePaymentFE)
    }
}