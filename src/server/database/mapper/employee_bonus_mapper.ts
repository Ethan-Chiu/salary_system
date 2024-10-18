import { container, injectable } from "tsyringe";
import { type z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { convertDatePropertiesToISOString, deleteProperties } from "./helper_function";
import { CryptoHelper } from "~/lib/utils/crypto";
import { EmployeeBonus, EmployeeBonusFEType, EmployeeBonusType, updateEmployeeBonusAPI, updateEmployeeBonusService } from "~/server/api/types/employee_bonus_type";
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
                bud_effective_salary_enc: CryptoHelper.encrypt(employee_bonus.bud_effective_salary.toString()),
                bud_amount_enc: CryptoHelper.encrypt(employee_bonus.bud_amount.toString()),
                sup_performance_level_enc: CryptoHelper.encrypt((employee_bonus.sup_performance_level ?? "").toString()),
                sup_effective_salary_enc: CryptoHelper.encrypt((employee_bonus.sup_effective_salary ?? "").toString()),
                sup_amount_enc: CryptoHelper.encrypt((employee_bonus.sup_amount ?? "").toString()),
                app_performance_level_enc: CryptoHelper.encrypt((employee_bonus.app_performance_level ?? "").toString()),
                app_effective_salary_enc: CryptoHelper.encrypt((employee_bonus.app_effective_salary ?? "").toString()),
                app_amount_enc: CryptoHelper.encrypt((employee_bonus.app_amount ?? "").toString()),
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

        const total_amount = Number(CryptoHelper.decrypt(employeePayment.base_salary_enc)) +
            Number(CryptoHelper.decrypt(employeePayment.supervisor_allowance_enc)) +
            Number(CryptoHelper.decrypt(employeePayment.subsidy_allowance_enc)) +
            Number(CryptoHelper.decrypt(employeePayment.occupational_allowance_enc)) +
            Number(CryptoHelper.decrypt(employeePayment.food_allowance_enc)) +
            Number(CryptoHelper.decrypt(employeePayment.long_service_allowance_enc));

        const sup_performance_level = CryptoHelper.decrypt(employee_bonus.sup_performance_level_enc)
        const sup_effective_salary = CryptoHelper.decrypt(employee_bonus.sup_effective_salary_enc)
        const sup_amount = CryptoHelper.decrypt(employee_bonus.sup_amount_enc)
        const app_performance_level = CryptoHelper.decrypt(employee_bonus.app_performance_level_enc)
        const app_effective_salary = CryptoHelper.decrypt(employee_bonus.app_effective_salary_enc)
        const app_amount = CryptoHelper.decrypt(employee_bonus.app_amount_enc)


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
            bud_effective_salary: Number(CryptoHelper.decrypt(employee_bonus.bud_effective_salary_enc)),
            bud_amount: Number(CryptoHelper.decrypt(employee_bonus.bud_amount_enc)),
            sup_performance_level: sup_performance_level == "" ? null : sup_performance_level,
            sup_effective_salary: sup_effective_salary == "" ? null : Number(sup_effective_salary),
            sup_amount: sup_amount == "" ? null : Number(sup_amount),
            app_performance_level: app_performance_level == "" ? null : app_performance_level,
            app_effective_salary: app_effective_salary == "" ? null : Number(app_effective_salary),
            app_amount: app_amount == "" ? null : Number(app_amount),
        })

        return deleteProperties(employeeBonusFE, ["special_multiplier_enc", "multiplier_enc", "fixed_amount_enc", "bud_effective_salary_enc", "bud_amount_enc", "sup_performance_level_enc", "sup_effective_salary_enc", "sup_amount_enc", "app_performance_level_enc", "app_effective_salary_enc", "app_amount_enc"])
    }

    async getEmployeeBonusNullable(employee_bonus: z.infer<typeof updateEmployeeBonusAPI>): Promise<z.infer<typeof updateEmployeeBonusService>> {
        const employeeBonus: z.infer<typeof updateEmployeeBonusService> = updateEmployeeBonusService.parse(
            convertDatePropertiesToISOString({
                ...employee_bonus,
                period_id: employee_bonus.period_id != undefined ? employee_bonus.period_id : undefined,
                bonus_type: employee_bonus.bonus_type != undefined ? employee_bonus.bonus_type : undefined,
                emp_no: employee_bonus.emp_no != undefined ? employee_bonus.emp_no : undefined,
                special_multiplier_enc: employee_bonus.special_multiplier != undefined ? CryptoHelper.encrypt(employee_bonus.special_multiplier.toString()) : undefined,
                multiplier_enc: employee_bonus.multiplier != undefined ? CryptoHelper.encrypt(employee_bonus.multiplier.toString()) : undefined,
                fixed_amount_enc: employee_bonus.fixed_amount != undefined ? CryptoHelper.encrypt(employee_bonus.fixed_amount.toString()) : undefined,
                bud_effective_salary_enc: employee_bonus.bud_effective_salary != undefined ? CryptoHelper.encrypt(employee_bonus.bud_effective_salary.toString()) : undefined,
                bud_amount_enc: employee_bonus.bud_amount != undefined ? CryptoHelper.encrypt(employee_bonus.bud_amount.toString()) : undefined,
                sup_performance_level_enc: employee_bonus.sup_performance_level != undefined ? CryptoHelper.encrypt((employee_bonus.sup_performance_level ?? "").toString()) : undefined,
                sup_effective_salary_enc: employee_bonus.sup_effective_salary != undefined ? CryptoHelper.encrypt((employee_bonus.sup_effective_salary ?? "").toString()) : undefined,
                sup_amount_enc: employee_bonus.sup_amount != undefined ? CryptoHelper.encrypt((employee_bonus.sup_amount ?? "").toString()) : undefined,
                app_performance_level_enc: employee_bonus.app_performance_level != undefined ? CryptoHelper.encrypt((employee_bonus.app_performance_level ?? "").toString()) : undefined,
                app_effective_salary_enc: employee_bonus.app_effective_salary != undefined ? CryptoHelper.encrypt((employee_bonus.app_effective_salary ?? "").toString()) : undefined,
                app_amount_enc: employee_bonus.app_amount != undefined ? CryptoHelper.encrypt((employee_bonus.app_amount ?? "").toString()) : undefined,
            })
        )

        return employeeBonus
    }
}
