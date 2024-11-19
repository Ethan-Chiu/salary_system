import { container } from "tsyringe";
import { NewOtherFEType } from "~/server/api/types/other_type";
import { CalculateService } from "~/server/service/calculate_service";
import { EHRService, ExpenseWithType } from "~/server/service/ehr_service";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";

export class OtherMapper {
	async getNewOther(
		period_id: number,
		expense_with_type_list: ExpenseWithType[],
		emp_no_list: string[]
	): Promise<NewOtherFEType[]> {
		const calculate_service = container.resolve(CalculateService);
		const employee_data_service = container.resolve(EmployeeDataService);
        const ehr_service = container.resolve(EHRService);
		const employee_payment_service = container.resolve(
			EmployeePaymentService
		);
		const newOtherFE_list = await Promise.all(
			emp_no_list.map(async (emp_no) => {
				const employee_data =
					await employee_data_service.getEmployeeDataByEmpNo(emp_no);
				const employee_payment =
					await employee_payment_service.getCurrentEmployeePaymentByEmpNo(
						emp_no,
						period_id
					);
                const work_day = (await ehr_service.getPaysetByEmpNoList(period_id, [emp_no]))[0]?.work_day??30;
				return {
					emp_no: emp_no,
					emp_name: employee_data!.emp_name,
					department: employee_data!.department,
					position: employee_data!.position,
                    work_day: work_day,
					other_addition: await calculate_service.getOtherAddition(
						period_id,
						emp_no
					),
					other_addition_tax:
						await calculate_service.getOtherAdditionTax(
							period_id,
							emp_no
						),
					other_deduction: await calculate_service.getOtherDeduction(
						period_id,
						emp_no
					),
					other_deduction_tax:
						await calculate_service.getOtherDeductionTax(
							period_id,
							emp_no
						),
					dorm_deduction: await calculate_service.getMealDeduction(
						period_id,
						emp_no
					),
					g_i_deduction_promotion:
						await calculate_service.getGroupInsuranceDeductionPromotion(
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
						await calculate_service.getIncomeTaxDeduction(
							period_id,
							emp_no
						),
					l_r_self: await calculate_service.getLRSelf(
						employee_payment!
					),
					parking_fee: await calculate_service.getParkingFee(
						period_id,
						emp_no
					),
					brokerage_fee: await calculate_service.getBrokerageFee(
						period_id,
						emp_no
					),
					retirement_income:
						await calculate_service.getRetirementIncome(
							period_id,
							emp_no
						),
					l_i_disability_reduction: expense_with_type_list.findLast(
						(e) =>
							e.emp_no === emp_no &&
							e.expense_type_name === "勞保殘障減免"
					)?.amount ?? 0,
					h_i_subsidy: expense_with_type_list.findLast(
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
