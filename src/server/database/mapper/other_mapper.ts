import { injectable } from "tsyringe";
import { type OtherFEType } from "~/server/api/types/other_type";
import { CalculateService } from "~/server/service/calculate_service";
import { EHRService, type ExpenseWithType } from "~/server/service/ehr_service";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";

@injectable()
export class OtherMapper {
  constructor(
    private readonly calculateService: CalculateService,
    private readonly ehrService: EHRService,
    private readonly employeeDataService: EmployeeDataService,
    private readonly employeePaymentService: EmployeePaymentService
  ) {}
  
	async getOtherFE(
		period_id: number,
		expense_with_type_list: ExpenseWithType[],
		emp_no_list: string[]
	): Promise<OtherFEType[]> {
		const newOtherFE_list = await Promise.all(
			emp_no_list.map(async (emp_no) => {
				const employee_data =
					await this.employeeDataService.getEmployeeDataByEmpNo(emp_no);
				const employee_payment =
					await this.employeePaymentService.getCurrentEmployeePaymentByEmpNo(
						emp_no,
						period_id
					);
				const work_day =
					(
						await this.ehrService.getPaysetByEmpNoList(period_id, [
							emp_no,
						])
					)[0]?.work_day ?? 30;
				return {
					emp_no: emp_no,
					emp_name: employee_data!.emp_name,
					department: employee_data!.department,
					position: employee_data!.position,
					work_day: work_day,
					other_addition: await this.calculateService.getOtherAddition(
						period_id,
						emp_no
					),
					other_addition_tax:
						await this.calculateService.getOtherAdditionTax(
							period_id,
							emp_no
						),
					other_deduction: await this.calculateService.getOtherDeduction(
						period_id,
						emp_no
					),
					other_deduction_tax:
						await this.calculateService.getOtherDeductionTax(
							period_id,
							emp_no
						),
					dorm_deduction: await this.calculateService.getMealDeduction(
						period_id,
						emp_no
					),
					reissue_salary:
						await this.calculateService.getReissueSalary(
						period_id,
						emp_no
					),
					g_i_deduction_promotion:
						await this.calculateService.getGroupInsuranceDeductionPromotion(
							period_id,
							emp_no
						),
					g_i_deduction_family:
						expense_with_type_list.findLast(
							(e) =>
								e.emp_no === emp_no &&
								e.expense_type_name === "團保代扣-眷屬"
						)?.amount ?? 0,
					income_tax_deduction:
						await this.calculateService.getIncomeTaxDeduction(
							period_id,
							emp_no
						),
					l_r_self: await this.calculateService.getLRSelf(
						employee_payment!
					),
					parking_fee: await this.calculateService.getParkingFee(
						period_id,
						emp_no
					),
					brokerage_fee: await this.calculateService.getBrokerageFee(
						period_id,
						emp_no
					),
					retirement_income:
						await this.calculateService.getRetirementIncome(
							period_id,
							emp_no
						),
					l_i_disability_reduction:
						expense_with_type_list.findLast(
							(e) =>
								e.emp_no === emp_no &&
								e.expense_type_name === "勞保殘障減免"
						)?.amount ?? 0,
					h_i_subsidy:
						expense_with_type_list.findLast(
							(e) =>
								e.emp_no === emp_no &&
								e.expense_type_name === "健保補助"
						)?.amount ?? 0,
				};
			})
		);
		return newOtherFE_list;
	}
}
