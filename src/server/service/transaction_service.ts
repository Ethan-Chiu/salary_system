import { container, injectable } from "tsyringe";
import { type z } from "zod";
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
export enum PayType {
    month_pay = "月薪",
    foreign_15_bonus = "外勞15日獎金",
    Q1_performance = "Q1績效",
    Q2_performance = "Q2績效",
    Q3_performance = "Q3績效",
    Q4_performance = "Q4績效",
}
@injectable()
export class TransactionService {
	async createTransaction(
		emp_no: string,
		period_id: number,
		issue_date: string,
        pay_type: PayType,
		note: string,
	) {
		// Service
        const employeeDataService = container.resolve(EmployeeDataService);
        const employeePaymentService = container.resolve(EmployeePaymentService);
		const ehrsService = container.resolve(EHRService);
		const bonusSettingService = container.resolve(BonusSettingService);
		const employeeAccountService = container.resolve(EmployeeAccountService);
		const employeeTrustService = container.resolve(EmployeeTrustService);
		const attendanceSettingService = container.resolve(AttendanceSettingService);
		const insuranceRateSettingService = container.resolve(InsuranceRateSettingService);
		// Data
		const payset = (await ehrsService.getPaysetByEmpNoList(period_id, [emp_no]))[0];
		const calculateService = container.resolve(CalculateService);
        const employee_data = await employeeDataService.getEmployeeDataByEmpNo(emp_no);
        const employee_payment = await employeePaymentService.getCurrentEmployeePaymentByEmpNo(emp_no, period_id);
		const bonus_setting = await bonusSettingService.getCurrentBonusSetting();
		const employee_acount = await employeeAccountService.getEmployeeAccountByEmpNo(emp_no);
		const employee_trust = await employeeTrustService.getCurrentEmployeeTrustByEmpNo(emp_no, period_id);
		const attendance_setting = await attendanceSettingService.getCurrentAttendanceSetting(period_id);
		const overtime = (await ehrsService.getOvertimeByEmpNoList(period_id, [emp_no]))[0];
		const insurance_rate_setting = await insuranceRateSettingService.getCurrentInsuranceRateSetting(period_id);
		const holiday = (await ehrsService.getHolidayByEmpNoList(period_id, [emp_no]))[0];
		// Variable
		period_id = period_id;
		issue_date = issue_date; 
        pay_type = pay_type;
        const department = employee_data!.department;
		emp_no = emp_no;
		const work_status = employee_data!.work_status;
		const position_level = employee_data!.position_level;
		const dependents = employee_data!.dependents;
		const healthcare_dependents = employee_data!.healthcare_dependents; 
		const l_i = employee_payment!.l_i;
		const h_i = employee_payment!.h_i;
		const labor_retirement = employee_payment!.labor_retirement;
		const occupational_injury = employee_payment!.occupational_injury;
		const supervisor_allowance = employee_payment!.supervisor_comp;
		const professional_cert_allowance = employee_payment!.professional_cert_comp;
		const food_allowance = employee_payment!.food_bonus;
		const base_salary = employee_payment!.base_salary;
		const gross_salary = await calculateService.getGrossSalary(employee_payment!, payset!);
		const labor_insurance_deduction = await calculateService.getLaborInsuranceDeduction(employee_data!,employee_payment!,payset!,insurance_rate_setting!);
		const health_insurance_deduction = await calculateService.getHealthInsuranceDeduction(employee_data!,employee_payment!,insurance_rate_setting!);
		const welfare_deduction = await calculateService.getWelfareDeduction(employee_data!,employee_payment!);
		const subsidy_allowance = employee_payment!.subsidy_comp;
		const weekday_overtime_pay = await calculateService.getNormalMoney(employee_data!, employee_payment!, attendance_setting!, overtime!);
		const holiday_overtime_pay = await calculateService.getVocationMoney(employee_data!, employee_payment!, attendance_setting!, overtime!); // change name
		const leave_deduction = await calculateService.getLeaveDeduction(employee_data!,employee_payment!,holiday!);
		const overtime_money = await calculateService.getOvertimeMoney(employee_data!, employee_payment!, attendance_setting!, overtime!);	
		const attendance_bonus = await calculateService.getAttendanceBonus();
		const group_insurance_premium_deduction = await calculateService.getGroupInsurancePremiumDeduction(gross_salary, payset!);
		const retroactive_salary = await calculateService.getRetroactiveDeduction(gross_salary, payset!);
		const other_deductions = await calculateService.getOtherDeductions(gross_salary, payset!);
		const other_additions = await calculateService.getOtherAdditions(gross_salary, payset!);
		const meal_deduction = await calculateService.getMealDeduction(gross_salary, payset!);
		const taxable_income = await calculateService.getTaxableIncome(gross_salary, payset!);
		const income_tax = await calculateService.getSalaryIncomeTax(employee_data!, new Date(issue_date));
		const bonus_tax = await calculateService.getBonusTax();
		const position_allowance = employee_payment!.job_comp;
		const shift_allowance = employee_payment!.shift_allowance;
		const non_leave_compensation = await calculateService.getNonLeaveCompensation(gross_salary, payset!);
		const total_income_tax_withheld = await calculateService.getTotalIncomeTaxWithheld(gross_salary, payset!);
		const taxable_subtotal = await calculateService.getTaxableSubtotal(gross_salary, payset!);
		const non_taxable_subtotal = await calculateService.getNonTaxableSubtotal(gross_salary, payset!);
		const deduction_subtotal = await calculateService.getDeductionSubtotal(gross_salary, payset!);
		const labor_insurance_premium = await calculateService.getLaborInsurancePremium(gross_salary, payset!);
		const salary_advance = await calculateService.getSalaryAdvance(gross_salary, payset!);
		const health_insurance_premium = await calculateService.getHealthInsurancePremium(gross_salary, payset!);
		const group_insurance_premium = await calculateService.getGroupInsurance(employee_data!);
		const net_salary = await calculateService.getNetSalary(gross_salary, payset!);
		const other_addition_tax = await calculateService.getOtherAdditionTax(gross_salary, payset!);
		const other_deduction_tax = await calculateService.getOtherDeductionTax(gross_salary, payset!);
		const income_tax_withheld = await calculateService.getIncomeTaxWithheld(gross_salary, payset!);
		const labor_retirement_self = employee_payment!.labor_retirement_self;
		const parking_fee = await calculateService.getParkingFee(gross_salary, payset!);
		const brokerage_fee = await calculateService.getBrokerageFee(gross_salary, payset!);
		const salary_range = await calculateService.getSalaryRange(gross_salary, payset!);
		const total_salary = await calculateService.getTotalSalary(gross_salary, payset!);
		const dragon_boat_festival_bonus = await calculateService.getDragonBoatFestivalBonus(gross_salary, payset!);
		const mid_autumn_festival_bonus = await calculateService.getMidAutumnFestivalBonus(gross_salary, payset!);
		note = note;
		const account1 = employee_acount![0]?.bank_account!;
		const account2 = employee_acount![1]?.bank_account!;
		const foreign_currency_account = employee_data!.foreign_currency_account;
		const bonus_ratio = bonus_setting!.fixed_multiplier;
		const annual_days_in_service = payset!.work_day!;
		const labor_pension_contribution = await calculateService.getLaborPensionContribution(employee_data!);
		const old_system_labor_pension_contribution = await calculateService.getOldSystemLaborPensionContribution(gross_salary, payset!);
		const seniority = employee_data!.seniority;
		const appraisal_rate = await calculateService.getAppraisalRate(gross_salary, payset!);
		const appraisal_bonus = await calculateService.getAppraisalBonus(gross_salary, payset!);
		const probation_period_complete = await calculateService.getProbationPeriodComplete(gross_salary, payset!);
		const accessible = employee_data!.accessible;
		const retirement_income = await calculateService.getRetirementIncome(gross_salary, payset!);
		const received_elderly_benefits = await calculateService.getReceivedElderlyBenefits(gross_salary, payset!);
		const second_generation_health_insurance = await calculateService.getSecondGenerationHealthInsurance(gross_salary, payset!);
		const stock_trust_yn = employee_data!.stock_trust_yn;
		const employee_trust_deposit = employee_trust!.emp_trust_reserve;
		const special_trust_incentive_employee = employee_trust!.emp_special_trust_incent;
		const company_incentive = employee_trust!.org_trust_reserve;
		const special_trust_incentive_company = employee_trust!.org_special_trust_incent;
		const group_insurance_premium_deduction_promotion = await calculateService.getGroupInsurancePremiumDeductionPromotion(gross_salary, payset!);
		const special_leave_deduction = await calculateService.getSpecialLeaveDeduction(gross_salary, payset!);
		const special_leave = await calculateService.getSpecialLeave(gross_salary, payset!);
		const full_attendance_special_leave = await calculateService.getFullAttendanceSpecialLeave(gross_salary, payset!);
		const full_attendance_sick_leave = await calculateService.getFullAttendanceSickLeave(gross_salary, payset!);
		const newTransaction = await Transaction.create({
			period_id,
			issue_date, // 發薪日期
			pay_type, // 發薪別
			department, // 部門
			emp_no, // 員工編號
			work_status, // 工作形態
			position_level, // 職等
			dependents, // 扶養人數
			healthcare_dependents, // 健保眷口數
			// 勞工相關信息
			l_i, // 勞保
			h_i, // 健保
			labor_retirement, // 勞退
			occupational_injury, // 職災
			supervisor_allowance, // 主管津貼
			professional_cert_allowance, // 專業証照津貼
			base_salary, // 底薪
			food_allowance, // 伙食津貼
			gross_salary, // 應發底薪
			labor_insurance_deduction, // 勞保扣除額
			health_insurance_deduction, // 健保扣除額
			welfare_deduction, // 福利金提撥
			subsidy_allowance, // 補助津貼
			weekday_overtime_pay, // 平日加班費
			holiday_overtime_pay, // 假日加班費
			leave_deduction, // 請假扣款
			overtime_money, // 超時加班
			attendance_bonus, // 全勤獎金
			group_insurance_premium_deduction, // 團保費代扣
			retroactive_salary, // 補發薪資
			other_deductions, // 其他減項
			other_additions, // 其他加項
			meal_deduction, // 伙食扣款
			taxable_income, // 課稅所得
			income_tax, // 薪資所得稅
			bonus_tax, // 獎金所得稅
			position_allowance, // 職務津貼
			shift_allowance, // 輪班津貼
			// non_leave, // 不休假
			// non_leave_hours, // 不休假時數
			non_leave_compensation, // 不休假代金
			total_income_tax_withheld, // 薪資所得扣繳總額
			taxable_subtotal, // 課稅小計
			non_taxable_subtotal, // 非課稅小計
			deduction_subtotal, // 減項小計
			labor_insurance_premium, // 勞保費
			salary_advance, // 工資墊償
			health_insurance_premium, // 健保費
			group_insurance_premium, // 團保費
			net_salary, // 實發金額
			// additional_labor_insurance, // 勞保追加
			// additional_health_insurance, // 健保追加
			other_addition_tax, // 其他加項稅
			other_deduction_tax, // 其他減項稅
			income_tax_withheld, // 所得稅代扣
			labor_retirement_self, // 勞退金自提
			parking_fee, // 停車費
			brokerage_fee, // 仲介費
			salary_range, // 薪資區隔
			total_salary, // 薪資總額
			dragon_boat_festival_bonus, // 端午獎金
			mid_autumn_festival_bonus, // 中秋獎金
			note, // 備註
			account1, // 帳號1
			account2, // 帳號2
			foreign_currency_account, // 外幣帳號
			bonus_ratio, // 獎金比率
			annual_days_in_service, // 年度在職天數
			labor_pension_contribution, // 勞退金提撥
			old_system_labor_pension_contribution, // 勞退金提撥_舊制
			seniority, // 年資
			appraisal_rate, // 考核比率
			appraisal_bonus, // 考核獎金
			probation_period_complete, // 試用期滿
			accessible, // 殘障等級
			retirement_income, // 退職所得
			received_elderly_benefits, // 已領老年給付
			second_generation_health_insurance, // 二代健保
			stock_trust_yn, // 持股信託_YN
			employee_trust_deposit, // 員工信託提存金
			special_trust_incentive_employee, // 特別信託獎勵金_員工
			company_incentive, // 公司獎勵金
			special_trust_incentive_company, // 特別信託獎勵金_公司
			group_insurance_premium_deduction_promotion, // 團保費代扣_升等
			special_leave_deduction, // 特別事假扣款
			special_leave, // 特別事假
			full_attendance_special_leave, // 有全勤事假
			full_attendance_sick_leave, // 有全勤病假
            create_by: "system",
            update_by: "system",
		});
		return newTransaction;
	}
}


