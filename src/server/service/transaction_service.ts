import { container, injectable } from "tsyringe";
import { z } from "zod";
import {} from "../api/types/parameters_input_type";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { select_value } from "./helper_function";
import { Transaction } from "../database/entity/SALARY/transaction";
import { EmployeeDataService } from "./employee_data_service";
import { EmployeePaymentService } from "./employee_payment_service";
import { CalculateService } from "./calculate_service";
import { EHRService } from "./ehr_service";
import { BonusSettingService } from "./bonus_setting_service";
import { EmployeeAccountService } from "./employee_acount_service";
import { EmployeeTrustService } from "./employee_trust_service";
import { AttendanceSettingService } from "./attendance_setting_service";
import { InsuranceRateSettingService } from "./insurance_rate_setting_service";
import { PayTypeEnumType } from "../api/types/pay_type_enum";
import { HolidaysTypeService } from "./holidays_type_service";
@injectable()
export class TransactionService {
	async createTransaction(
		emp_no: string,
		period_id: number,
		issue_date: string,
		pay_type: PayTypeEnumType,
		note: string
	) {
		// MARK: Service
		const employeeDataService = container.resolve(EmployeeDataService);
		const employeePaymentService = container.resolve(
			EmployeePaymentService
		);
		const ehrService = container.resolve(EHRService);
		const bonusSettingService = container.resolve(BonusSettingService);
		const employeeAccountService = container.resolve(
			EmployeeAccountService
		);
		const employeeTrustService = container.resolve(EmployeeTrustService);
		const attendanceSettingService = container.resolve(
			AttendanceSettingService
		);
		const insuranceRateSettingService = container.resolve(
			InsuranceRateSettingService
		);
		const holidaysTypeService = container.resolve(HolidaysTypeService);
		// MARK: Data
		const payset = (
			await ehrService.getPaysetByEmpNoList(period_id, [emp_no])
		)[0];
		const calculateService = container.resolve(CalculateService);
		const employee_data = await employeeDataService.getEmployeeDataByEmpNo(
			emp_no
		);
		const employee_payment =
			await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
				emp_no,
				period_id
			);
		const bonus_setting =
			await bonusSettingService.getCurrentBonusSetting();
		const employee_acount =
			await employeeAccountService.getEmployeeAccountByEmpNo(emp_no);
		const employee_trust =
			await employeeTrustService.getCurrentEmployeeTrustByEmpNo(
				emp_no,
				period_id
			);
		const attendance_setting =
			await attendanceSettingService.getCurrentAttendanceSetting(
				period_id
			);
		const overtime_list = (
			await ehrService.getOvertimeByEmpNoList(period_id, [emp_no])
		);
		const insurance_rate_setting =
			await insuranceRateSettingService.getCurrentInsuranceRateSetting(
				period_id
			);
		const holiday_list = (
			await ehrService.getHolidayByEmpNoList(period_id, [emp_no])
		);
		const full_attendance_bonus =
			await calculateService.getFullAttendanceBonus(period_id, emp_no);
		const holidays_type = await holidaysTypeService.getCurrentHolidaysType();
		const reissue_salary = await calculateService.getReissueSalary(
			period_id,
			emp_no
		)
		const operational_performance_bonus = await calculateService.getOperationalPerformanceBonus(
			period_id,
			emp_no
		)
		const other_addition_tax = await calculateService.getOtherAdditionTax(
			period_id,
			emp_no
		);
		// MARK: Calculated Results
		period_id = period_id;
		issue_date = issue_date;
		pay_type = pay_type;
		const department = employee_data!.department;
		emp_no = emp_no;
		const work_status = employee_data!.work_status;
		const position = employee_data!.position;
		const dependents = employee_data!.dependents;
		const healthcare_dependents = employee_data!.healthcare_dependents;
		const l_i = employee_payment!.l_i;
		const h_i = employee_payment!.h_i;
		const l_r = employee_payment!.l_r;
		const occupational_injury = employee_payment!.occupational_injury;
		const supervisor_allowance = employee_payment!.supervisor_allowance;
		const professional_cert_allowance =
			employee_payment!.professional_cert_allowance;
		const food_allowance = employee_payment!.food_allowance;
		const base_salary = employee_payment!.base_salary;
		const gross_salary = await calculateService.getGrossSalary(
			employee_payment!,
			payset!
		);
		const l_i_deduction = await calculateService.getLaborInsuranceDeduction(
			employee_data!,
			employee_payment!,
			payset!,
			insurance_rate_setting!
		);
		const h_i_deduction =
			await calculateService.getHealthInsuranceDeduction(
				employee_data!,
				employee_payment!,
				insurance_rate_setting!
			);
		const welfare_contribution = await calculateService.getWelfareDeduction(
			employee_data!,
			employee_payment!,
			full_attendance_bonus,
			operational_performance_bonus
		);
		const subsidy_allowance = employee_payment!.subsidy_allowance;
		const weekday_overtime_pay =
			await calculateService.getWeekdayOvertimePay(
				employee_data!,
				employee_payment!,
				overtime_list,
				payset!,
				insurance_rate_setting!,
				full_attendance_bonus,
			);
		const holiday_overtime_pay =
			await calculateService.getHolidayOvertimePay(
				employee_data!,
				employee_payment!,
				overtime_list,
				payset!,
				insurance_rate_setting!,
				full_attendance_bonus!
			); // change name
		const leave_deduction = await calculateService.getLeaveDeduction(
			employee_data!,
			employee_payment!,
			holiday_list!,
			payset!,
			holidays_type,
			insurance_rate_setting!,
			full_attendance_bonus
		);
		const exceed_overtime_pay = await calculateService.getExceedOvertimePay(
			employee_data!,
			employee_payment!,
			overtime_list!,
			payset!,
			insurance_rate_setting!,
			full_attendance_bonus
		);
		const salary_income_deduction = await calculateService.getSalaryIncomeDeduction(
			// employee_data!,
			employee_payment!,
			// payset!,
			reissue_salary!,
			full_attendance_bonus!,
			exceed_overtime_pay!,
			leave_deduction!,
			operational_performance_bonus,
			other_addition_tax,
		)
		const group_insurance_deduction =
			await calculateService.getGroupInsuranceDeduction( period_id, emp_no );
		// const retroactive_salary = await calculateService.getRetroactiveDeduction(gross_salary, payset!);
		const other_deduction = await calculateService.getOtherDeduction(
			period_id,
			emp_no
		);
		const other_addition = await calculateService.getOtherAddition(
			period_id,
			emp_no
		);
		const meal_deduction = await calculateService.getMealDeduction(
			// period_id,
			// emp_no
		);
		const taxable_income = await calculateService.getTaxableIncome(
			// period_id,
			// emp_no
		);
		const income_tax = await calculateService.getSalaryIncomeTax(
			employee_data!,
			new Date(issue_date),
			salary_income_deduction,
		);
		const bonus_tax = await calculateService.getBonusTax();
		const occupational_allowance = employee_payment!.occupational_allowance;
		const shift_allowance = employee_payment!.shift_allowance;
		const non_leave_compensation =
			await calculateService.getNonLeaveCompensation(
				period_id,
				emp_no,
			);
		const taxable_subtotal = await calculateService.getTaxableSubtotal(
			pay_type,
		);
		const non_taxable_subtotal =
			await calculateService.getNonTaxableSubtotal();
		const deduction_subtotal = await calculateService.getDeductionSubtotal(
			
		);
		const l_i_pay = await calculateService.getLaborInsurance(
			employee_payment!,
		);
		const salary_advance = await calculateService.getSalaryAdvance(
			// gross_salary,
			// payset!
		);
		const h_i_pay = await calculateService.getHealthInsurance(
			employee_payment!,
		);
		const group_insurance_pay = await calculateService.getGroupInsurancePay(
			employee_data!
		);
		const net_salary = await calculateService.getNetSalary(
			// gross_salary,
			// payset!
		);
		
		const other_deduction_tax = await calculateService.getOtherDeductionTax(
			period_id,
			emp_no
		);
		const income_tax_deduction = await calculateService.getIncomeTaxDeduction(
			
		);
		const l_r_self = employee_payment!.l_r_self;
		const parking_fee = await calculateService.getParkingFee(
			period_id,
			emp_no,
		);
		const brokerage_fee = await calculateService.getBrokerageFee(
			period_id,
			emp_no,
		);
		const salary_range = await calculateService.getSalaryRange(
			
		);
		const total_salary = await calculateService.getTotalSalary(
		
		);
		const dragon_boat_festival_bonus =
			await calculateService.getDragonBoatFestivalBonus(
				
			);
		const mid_autumn_festival_bonus =
			await calculateService.getMidAutumnFestivalBonus(
				
			);
		note = note;
		const bank_account_1 = employee_data!.bank_account;
		// const bank_account_2 = employee_acount![1]?.bank_account!;
		// const foreign_currency_account =
			""
		const bonus_ratio = bonus_setting!.fixed_multiplier;
		const annual_days_in_service = payset!.work_day!;
		const l_r_contribution =
			await calculateService.getLaborRetirementContribution(
				employee_data!
			);
		const old_l_r_contribution =
			await calculateService.getOldLaborRetirementContribution(
				
			);
		const seniority = 0;
		const assessment_rate = 0;
		const assessment_bonus = await calculateService.getAssessmentBonus(
			
		);
		const probation_period_over = false;
			
		const disabilty_level = employee_data!.disabilty_level;
		const retirement_income = await calculateService.getRetirementIncome(
			
		);
		const received_elderly_benefits =
			false;
		const v_2_h_i =
			await calculateService.getSecondGenerationHealthInsurance(
				
			);
		const has_trust = true; // todo
		const emp_trust_reserve = employee_trust!.emp_trust_reserve;
		const emp_special_trust_incent =
			employee_trust!.emp_special_trust_incent;
		const org_trust_reserve = employee_trust!.org_trust_reserve;
		const org_special_trust_incent =
			employee_trust!.org_special_trust_incent;
		const g_i_deduction_promotion =
			await calculateService.getGroupInsuranceDeductionPromotion(
				
			);
		const special_leave_deduction =
			await calculateService.getSpecialLeaveDeduction(
				employee_data!,
			);
		const special_leave = 0;
		const full_attendance_special_leave =
			0;
		const full_attendance_sick_leave =
			0;
		const newTransaction = await Transaction.create({
			period_id,
			issue_date, // 發薪日期
			pay_type, // 發薪別
			department, // 部門
			emp_no, // 員工編號
			work_status, // 工作形態
			position, // 職等
			dependents, // 扶養人數
			healthcare_dependents, // 健保眷口數
			// 勞工相關信息
			l_i, // 勞保
			h_i, // 健保
			l_r, // 勞退
			occupational_injury, // 職災
			supervisor_allowance, // 主管津貼
			professional_cert_allowance, // 專業証照津貼
			base_salary, // 底薪
			food_allowance, // 伙食津貼
			gross_salary, // 應發底薪
			l_i_deduction, // 勞保扣除額
			h_i_deduction, // 健保扣除額
			welfare_contribution, // 福利金提撥
			subsidy_allowance, // 補助津貼
			weekday_overtime_pay, // 平日加班費
			holiday_overtime_pay, // 假日加班費
			leave_deduction, // 請假扣款
			exceed_overtime_pay, // 超時加班
			full_attendance_bonus, // 全勤獎金
			group_insurance_deduction, // 團保費代扣
			// retroactive_salary, // 補發薪資
			other_deduction, // 其他減項
			other_addition, // 其他加項
			meal_deduction, // 伙食扣款
			taxable_income, // 課稅所得
			income_tax, // 薪資所得稅
			bonus_tax, // 獎金所得稅
			occupational_allowance, // 職務津貼
			shift_allowance, // 輪班津貼
			// non_leave, // 不休假
			// non_leave_hours, // 不休假時數
			non_leave_compensation, // 不休假代金
			salary_income_deduction, // 薪資所得扣繳總額
			taxable_subtotal, // 課稅小計
			non_taxable_subtotal, // 非課稅小計
			deduction_subtotal, // 減項小計
			l_i_pay, // 勞保費
			salary_advance, // 工資墊償
			h_i_pay, // 健保費
			group_insurance_pay, // 團保費
			net_salary, // 實發金額
			// additional_l_i, // 勞保追加
			// additional_h_i, // 健保追加
			other_addition_tax, // 其他加項稅
			other_deduction_tax, // 其他減項稅
			income_tax_deduction, // 所得稅代扣
			l_r_self, // 勞退金自提
			parking_fee, // 停車費
			brokerage_fee, // 仲介費
			salary_range, // 薪資區隔
			total_salary, // 薪資總額
			dragon_boat_festival_bonus, // 端午獎金
			mid_autumn_festival_bonus, // 中秋獎金
			note, // 備註
			bank_account_1, // 帳號1
			// bank_account_2, // 帳號2
			// foreign_currency_account, // 外幣帳號
			bonus_ratio, // 獎金比率
			annual_days_in_service, // 年度在職天數
			l_r_contribution, // 勞退金提撥
			old_l_r_contribution, // 勞退金提撥_舊制
			seniority, // 年資
			assessment_rate, // 考核比率
			assessment_bonus, // 考核獎金
			probation_period_over, // 試用期滿
			disabilty_level, // 殘障等級
			retirement_income, // 退職所得
			received_elderly_benefits, // 已領老年給付
			v_2_h_i, // 二代健保
			has_trust, // 持股信託_YN
			emp_trust_reserve, // 員工信託提存金
			emp_special_trust_incent, // 特別信託獎勵金_員工
			org_trust_reserve, // 公司獎勵金
			org_special_trust_incent, // 特別信託獎勵金_公司
			g_i_deduction_promotion, // 團保費代扣_升等
			special_leave_deduction, // 特別事假扣款
			special_leave, // 特別事假
			full_attendance_personal_leave: full_attendance_special_leave, // 有全勤事假
			full_attendance_sick_leave, // 有全勤病假
			create_by: "system",
			update_by: "system",
		});
		return newTransaction;
	}
	async getTransactionByEmpNo(emp_no: string, period_id: number): Promise<Transaction | null> {
		const transaction = await Transaction.findOne({
			where: {
				emp_no: emp_no,
				period_id: period_id,
			},
		});
		return transaction;
	}
	async getAllTransaction(period_id: number): Promise<Transaction[] | null> {
		const transactions = await Transaction.findAll({
			where: {
				period_id: period_id,
			},
		});
		return transactions;
	}
}
