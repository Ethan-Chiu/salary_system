import { container, injectable } from "tsyringe";
import { type z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { convertDatePropertiesToISOString, deleteProperties } from "./helper_function";
import { CryptoHelper } from "~/lib/utils/crypto";
import { EmployeeBonus, EmployeeBonusFEType, EmployeeBonusType } from "~/server/api/types/employee_bonus_type";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";

@injectable()
export class EmployeeBonusMapper {
    async getEmployeeBonus(employee_bonus: EmployeeBonusFEType): Promise<EmployeeBonusType> {
        const employeeBonus: z.infer<typeof EmployeeBonus> = EmployeeBonus.parse(
            convertDatePropertiesToISOString({
                ...employee_bonus,
                period_id: employee_bonus.period_id,
                bonus_type: employee_bonus.bonus_type,
                emp_no: employee_bonus.emp_no,
                special_multiplier_enc: CryptoHelper.encrypt(employee_bonus.special_multiplier.toString()),
                multiplier_enc: CryptoHelper.encrypt(employee_bonus.multiplier.toString()),
                fixed_amount_enc: CryptoHelper.encrypt(employee_bonus.fixed_amount.toString()),
                bud_effective_salary_enc: CryptoHelper.encrypt(employee_bonus.budget_effective_salary.toString()),
                bud_amount_enc: CryptoHelper.encrypt(employee_bonus.budget_amount.toString()),
                sup_performance_level_enc: CryptoHelper.encrypt((employee_bonus.supervisor_performance_level ?? "").toString()),
                sup_effective_salary_enc: CryptoHelper.encrypt((employee_bonus.supervisor_effective_salary ?? "").toString()),
                sup_amount_enc: CryptoHelper.encrypt((employee_bonus.supervisor_amount ?? "").toString()),
                app_performance_level_enc: CryptoHelper.encrypt((employee_bonus.approved_performance_level ?? "").toString()),
                app_effective_salary_enc: CryptoHelper.encrypt((employee_bonus.approved_effective_salary ?? "").toString()),
                app_amount_enc: CryptoHelper.encrypt((employee_bonus.approved_amount ?? "").toString()),
                disabled: employee_bonus.disabled,
            })
        )

        return employeeBonus
    }

    async getEmployeeBonusFE(employee_bonus: EmployeeBonusType): Promise<EmployeeBonusFEType> {
        const employeeDataService = container.resolve(EmployeeDataService)
        const employeePaymentService = container.resolve(EmployeePaymentService)
        const employee = await employeeDataService.getEmployeeDataByEmpNo(employee_bonus.emp_no)
        const employeePayment = await employeePaymentService.getEmployeePaymentByEmpNo(employee_bonus.emp_no)

        if (employee == null) throw new BaseResponseError("Employee does not exist")
        if (employeePayment == null) throw new BaseResponseError("Employee Payment does not exist")

        const total_amount =    Number(CryptoHelper.decrypt(employeePayment.base_salary_enc)) +
                                Number(CryptoHelper.decrypt(employeePayment.supervisor_allowance_enc)) +
                                Number(CryptoHelper.decrypt(employeePayment.subsidy_allowance_enc)) +
                                Number(CryptoHelper.decrypt(employeePayment.occupational_allowance_enc)) +
                                Number(CryptoHelper.decrypt(employeePayment.food_allowance_enc)) +
                                Number(CryptoHelper.decrypt(employeePayment.long_service_allowance_enc));
        

        const employeeBonusFE: EmployeeBonusFEType = convertDatePropertiesToISOString({
            period_id: employee_bonus.period_id,
            bonus_type: employee_bonus.bonus_type,
            department: employee.department,
            emp_no: employee_bonus.emp_no,
            emp_name: employee.emp_name,
            registration_date: employee.registration_date,
            seniority: 0,
            position_position_type: `${employee.position}${employee.position_type}`,
            work_status: employee.work_status,
            base_salary: Number(CryptoHelper.decrypt(employeePayment.base_salary_enc)),
            supervisor_allowance: Number(CryptoHelper.decrypt(employeePayment.supervisor_allowance_enc)),
            subsidy_allowance: Number(CryptoHelper.decrypt(employeePayment.subsidy_allowance_enc)),
            occupational_allowance: Number(CryptoHelper.decrypt(employeePayment.occupational_allowance_enc)),
            food_allowance: Number(CryptoHelper.decrypt(employeePayment.food_allowance_enc)),
            long_service_allowance: Number(CryptoHelper.decrypt(employeePayment.long_service_allowance_enc)),
            total: total_amount,
            special_multiplier: Number(CryptoHelper.decrypt(employee_bonus.special_multiplier_enc)),
            multiplier: Number(CryptoHelper.decrypt(employee_bonus.multiplier_enc)),
            fixed_amount: Number(CryptoHelper.decrypt(employee_bonus.fixed_amount_enc)),
            budget_effective_salary: Number(CryptoHelper.decrypt(employee_bonus.bud_effective_salary_enc)), // 預算績效比率
            budget_amount: Number(CryptoHelper.decrypt(employee_bonus.bud_amount_enc)),
            supervisor_performance_level: CryptoHelper.decrypt(employee_bonus.sup_performance_level_enc),
            supervisor_effective_salary: Number(CryptoHelper.decrypt(employee_bonus.sup_effective_salary_enc)),
            supervisor_amount: Number(CryptoHelper.decrypt(employee_bonus.sup_amount_enc)),
            approved_performance_level: CryptoHelper.decrypt(employee_bonus.app_performance_level_enc),
            approved_effective_salary: Number(CryptoHelper.decrypt(employee_bonus.app_effective_salary_enc)),
            approved_amount: Number(CryptoHelper.decrypt(employee_bonus.app_amount_enc)),
            disabled: employee_bonus.disabled,
        })

        return employeeBonusFE
        // return deleteProperties(employeePaymentFE, ["base_salary_enc", "supervisor_allowance_enc", "occupational_allowance_enc", "subsidy_allowance_enc", "food_allowance_enc", "long_service_allowance_enc", "l_r_self_enc", "l_i_enc", "h_i_enc", "l_r_enc", "occupational_injury_enc"])
    }

    // async getEmployeePaymentNullable(employee_payment: z.infer<typeof updateEmployeePaymentAPI>): Promise<z.infer<typeof updateEmployeePaymentService>> {
    //     const employeePayment: z.infer<typeof updateEmployeePaymentService> = updateEmployeePaymentService.parse(
    //         convertDatePropertiesToISOString({
    //             base_salary_enc: employee_payment.base_salary != undefined ? CryptoHelper.encrypt(employee_payment.base_salary.toString()) : undefined,
    //             food_allowance_enc: employee_payment.food_allowance != undefined ? CryptoHelper.encrypt(employee_payment.food_allowance.toString()) : undefined,
    //             supervisor_allowance_enc: employee_payment.supervisor_allowance != undefined ? CryptoHelper.encrypt(employee_payment.supervisor_allowance.toString()) : undefined,
    //             occupational_allowance_enc: employee_payment.occupational_allowance != undefined ? CryptoHelper.encrypt(employee_payment.occupational_allowance.toString()) : undefined,
    //             subsidy_allowance_enc: employee_payment.subsidy_allowance != undefined ? CryptoHelper.encrypt(employee_payment.subsidy_allowance.toString()) : undefined,
    //             long_service_allowance_enc: employee_payment.long_service_allowance != undefined ? CryptoHelper.encrypt(employee_payment.long_service_allowance.toString()) : undefined,
    //             l_r_self_enc: employee_payment.l_r_self != undefined ? CryptoHelper.encrypt(employee_payment.l_r_self.toString()) : undefined,
    //             l_i_enc: employee_payment.l_i != undefined ? CryptoHelper.encrypt(employee_payment.l_i.toString()) : undefined,
    //             h_i_enc: employee_payment.h_i != undefined ? CryptoHelper.encrypt(employee_payment.h_i.toString()) : undefined,
    //             l_r_enc: employee_payment.l_r != undefined ? CryptoHelper.encrypt(employee_payment.l_r.toString()) : undefined,
    //             occupational_injury_enc: employee_payment.occupational_injury != undefined ? CryptoHelper.encrypt(employee_payment.occupational_injury.toString()) : undefined,
    //             ...employee_payment,
    //         })
    //     )

    //     return employeePayment
    // }
}
