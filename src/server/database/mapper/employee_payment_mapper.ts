import { container, injectable } from "tsyringe";
import { z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import { EmployeePayment, EmployeePaymentFE, updateEmployeePaymentAPI, updateEmployeePaymentService } from "~/server/api/types/employee_payment_type";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { convertDatePropertiesToISOString, deleteProperties } from "./helper_function";
import { CryptoHelper } from "~/lib/utils/crypto";

@injectable()
export class EmployeePaymentMapper {
    async getEmployeePayment(employee_payment: z.infer<typeof EmployeePaymentFE>): Promise<z.infer<typeof EmployeePayment>> {
        const employeePayment: z.infer<typeof EmployeePayment> = convertDatePropertiesToISOString({
            base_salary_enc: CryptoHelper.encrypt(employee_payment.base_salary.toString()),
            food_allowance_enc: CryptoHelper.encrypt(employee_payment.food_allowance.toString()),
            supervisor_allowance_enc: CryptoHelper.encrypt(employee_payment.supervisor_allowance.toString()),
            occupational_allowance_enc: CryptoHelper.encrypt(employee_payment.occupational_allowance.toString()),
            subsidy_allowance_enc: CryptoHelper.encrypt(employee_payment.subsidy_allowance.toString()),
            l_r_self_enc: CryptoHelper.encrypt(employee_payment.l_r_self.toString()),
            l_i_enc: CryptoHelper.encrypt(employee_payment.l_i.toString()),
            h_i_enc: CryptoHelper.encrypt(employee_payment.h_i.toString()),
            l_r_enc: CryptoHelper.encrypt(employee_payment.l_r.toString()),
            occupational_injury_enc: CryptoHelper.encrypt(employee_payment.occupational_injury.toString()),
            ...employee_payment,
        })

        return employeePayment
    }

    async getEmployeePaymentFE(employee_payment: z.infer<typeof EmployeePayment>): Promise<z.infer<typeof EmployeePaymentFE>> {
        const employeeDataService = container.resolve(EmployeeDataService)
        const employee = await employeeDataService.getEmployeeDataByEmpNo(employee_payment.emp_no)
        if (employee == null) {
            throw new BaseResponseError("Employee does not exist")
        }

        const employeePaymentFE: z.infer<typeof EmployeePaymentFE> = convertDatePropertiesToISOString({
            emp_name: employee.emp_name,
            position: employee.position,
            position_type: employee.position_type,
            department: employee.department,
            base_salary: Number(CryptoHelper.decrypt(employee_payment.base_salary_enc)),
            food_allowance: Number(CryptoHelper.decrypt(employee_payment.food_allowance_enc)),
            supervisor_allowance: Number(CryptoHelper.decrypt(employee_payment.supervisor_allowance_enc)),
            occupational_allowance: Number(CryptoHelper.decrypt(employee_payment.occupational_allowance_enc)),
            subsidy_allowance: Number(CryptoHelper.decrypt(employee_payment.subsidy_allowance_enc)),
            l_r_self: Number(CryptoHelper.decrypt(employee_payment.l_r_self_enc)),
            l_i: Number(CryptoHelper.decrypt(employee_payment.l_i_enc)),
            h_i: Number(CryptoHelper.decrypt(employee_payment.h_i_enc)),
            l_r: Number(CryptoHelper.decrypt(employee_payment.l_r_enc)),
            occupational_injury: Number(CryptoHelper.decrypt(employee_payment.occupational_injury_enc)),
            ...employee_payment,
        })

        return deleteProperties(employeePaymentFE, ["base_salary_enc", "supervisor_allowance_enc", "occupational_allowance_enc", "subsidy_allowance_enc", "food_allowance_enc", "l_r_self_enc", "l_i_enc", "h_i_enc", "l_r_enc", "occupational_injury_enc"])
    }

    async getEmployeePaymentNullable(employee_payment: z.infer<typeof updateEmployeePaymentAPI>): Promise<z.infer<typeof updateEmployeePaymentService>> {
        const employeePayment: z.infer<typeof EmployeePayment> = convertDatePropertiesToISOString({
            base_salary_enc: employee_payment.base_salary != undefined ? CryptoHelper.encrypt(employee_payment.base_salary.toString()) : undefined,
            food_allowance_enc: employee_payment.food_allowance != undefined ? CryptoHelper.encrypt(employee_payment.food_allowance.toString()) : undefined,
            supervisor_allowance_enc: employee_payment.supervisor_allowance != undefined ? CryptoHelper.encrypt(employee_payment.supervisor_allowance.toString()) : undefined,
            occupational_allowance_enc: employee_payment.occupational_allowance != undefined ? CryptoHelper.encrypt(employee_payment.occupational_allowance.toString()) : undefined,
            subsidy_allowance_enc: employee_payment.subsidy_allowance != undefined ? CryptoHelper.encrypt(employee_payment.subsidy_allowance.toString()) : undefined,
            l_r_self_enc: employee_payment.l_r_self != undefined ? CryptoHelper.encrypt(employee_payment.l_r_self.toString()) : undefined,
            l_i_enc: employee_payment.l_i != undefined ? CryptoHelper.encrypt(employee_payment.l_i.toString()) : undefined,
            h_i_enc: employee_payment.h_i != undefined ? CryptoHelper.encrypt(employee_payment.h_i.toString()) : undefined,
            l_r_enc: employee_payment.l_r != undefined ? CryptoHelper.encrypt(employee_payment.l_r.toString()) : undefined,
            occupational_injury_enc: employee_payment.occupational_injury != undefined ? CryptoHelper.encrypt(employee_payment.occupational_injury.toString()) : undefined,
            ...employee_payment,
        })

        return employeePayment
    }
}