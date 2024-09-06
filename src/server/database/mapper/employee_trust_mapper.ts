import { container, injectable } from "tsyringe";
import { z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import { EmployeeTrust, EmployeeTrustFE, updateEmployeeTrustAPI, updateEmployeeTrustService } from "~/server/api/types/employee_trust";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { convertDatePropertiesToISOString, deleteProperties } from "./helper_function";
import { CryptoHelper } from "~/lib/utils/crypto";

@injectable()
export class EmployeeTrustMapper {
    async getEmployeeTrust(employee_trust: z.infer<typeof EmployeeTrustFE>): Promise<z.infer<typeof EmployeeTrust>> {
        const employeeTrust: z.infer<typeof EmployeeTrust> = EmployeeTrust.parse(
            convertDatePropertiesToISOString({
                emp_trust_reserve_enc: CryptoHelper.encrypt(employee_trust.emp_trust_reserve.toString()),
                org_trust_reserve_enc: CryptoHelper.encrypt(employee_trust.org_trust_reserve.toString()),
                emp_special_trust_incent_enc: CryptoHelper.encrypt(employee_trust.emp_special_trust_incent.toString()),
                org_special_trust_incent_enc: CryptoHelper.encrypt(employee_trust.org_special_trust_incent.toString()),
                ...employee_trust,
            })
        )

        return employeeTrust
    }

    async getEmployeeTrustFE(employee_trust: z.infer<typeof EmployeeTrust>): Promise<z.infer<typeof EmployeeTrustFE>> {
        const employeeDataService = container.resolve(EmployeeDataService)
        const employee = await employeeDataService.getEmployeeDataByEmpNo(employee_trust.emp_no)
        if (employee == null) {
            throw new BaseResponseError("Employee does not exist")
        }

        const employeeTrustFE: z.infer<typeof EmployeeTrustFE> = convertDatePropertiesToISOString({
            emp_name: employee.emp_name,
            position: employee.position,
            position_type: employee.position_type,
            department: employee.department,
            emp_trust_reserve: Number(CryptoHelper.decrypt(employee_trust.emp_trust_reserve_enc)),
            org_trust_reserve: Number(CryptoHelper.decrypt(employee_trust.org_trust_reserve_enc)),
            emp_special_trust_incent: Number(CryptoHelper.decrypt(employee_trust.emp_special_trust_incent_enc)),
            org_special_trust_incent: Number(CryptoHelper.decrypt(employee_trust.org_special_trust_incent_enc)),
            ...employee_trust,
        })

        return deleteProperties(employeeTrustFE, ["emp_trust_reserve_enc", "org_trust_reserve_enc", "emp_special_trust_incent_enc", "org_special_trust_incent_enc"])
    }

    async getEmployeeTrustNullable(employee_trust: z.infer<typeof updateEmployeeTrustAPI>): Promise<z.infer<typeof updateEmployeeTrustService>> {
        const employeeTrust: z.infer<typeof updateEmployeeTrustService> = updateEmployeeTrustService.parse(
            convertDatePropertiesToISOString({
                emp_trust_reserve_enc: employee_trust.emp_trust_reserve != undefined ? CryptoHelper.encrypt(employee_trust.emp_trust_reserve.toString()) : undefined,
                org_trust_reserve_enc: employee_trust.org_trust_reserve != undefined ? CryptoHelper.encrypt(employee_trust.org_trust_reserve.toString()) : undefined,
                emp_special_trust_incent_enc: employee_trust.emp_special_trust_incent != undefined ? CryptoHelper.encrypt(employee_trust.emp_special_trust_incent.toString()) : undefined,
                org_special_trust_incent_enc: employee_trust.org_special_trust_incent != undefined ? CryptoHelper.encrypt(employee_trust.org_special_trust_incent.toString()) : undefined,
                ...employee_trust,
            })
        )

        return employeeTrust
    }
}