import { injectable } from "tsyringe";
import { Transaction } from "../database/entity/SALARY/transaction";
import { EmployeeDataService } from "./employee_data_service";
import { EmployeePaymentService } from "./employee_payment_service";
import { CalculateService } from "./calculate_service";
import { EHRService } from "./ehr_service";
import { EmployeeTrustService } from "./employee_trust_service";
import { InsuranceRateSettingService } from "./insurance_rate_setting_service";
import { SalaryIncomeTaxService } from "./salary_income_tax_service";
import { PayTypeEnumType } from "../api/types/pay_type_enum";
import { HolidaysTypeService } from "./holidays_type_service";
import { LongServiceEnum } from "../api/types/long_service_enum";
import { Allowance } from "../database/entity/UMEDIA/allowance";
import { AllowanceType } from "../database/entity/UMEDIA/allowance_type";
import { Payset } from "../database/entity/UMEDIA/payset";
import { EmployeeDataDecType } from "../database/entity/SALARY/employee_data";
import { EmployeePaymentFEType } from "../api/types/employee_payment_type";
import { EmployeeTrustFEType } from "../api/types/employee_trust_type";
import { Overtime } from "../database/entity/UMEDIA/overtime";
import { InsuranceRateSettingDecType } from "../database/entity/SALARY/insurance_rate_setting";
import { Holiday } from "../database/entity/UMEDIA/holiday";
import { HolidaysType } from "../database/entity/SALARY/holidays_type";
import { BonusType } from "../database/entity/UMEDIA/bonus_type";
import { Bonus } from "../database/entity/UMEDIA/bonus";
import { Expense } from "../database/entity/UMEDIA/expense";
import { ExpenseClass } from "../database/entity/UMEDIA/expense_class";
import { SalaryIncomeTaxDecType } from "../database/entity/SALARY/salary_income_tax";

type CommonParametersType = {
	allowance_list: Allowance[],
	allowance_type_list: AllowanceType[],
	payset_list: Payset[],
	employee_data_list: EmployeeDataDecType[],
	employee_payment_list: EmployeePaymentFEType[],
	employee_trust_list: EmployeeTrustFEType[],
	insurance_rate_setting: InsuranceRateSettingDecType,
	overtime_list: Overtime[],
	holiday_list: Holiday[],
	holidays_type_list: HolidaysType[],
	bonus_list: Bonus[],
	bonus_type_list: BonusType[],
	expense_list: Expense[],
	expense_class_list: ExpenseClass[],
	salary_income_tax_list: SalaryIncomeTaxDecType[],
}

@injectable()
export class TransactionService {

	constructor(
		private readonly employeeDataService: EmployeeDataService,
		private readonly employeePaymentService: EmployeePaymentService,
		private readonly ehrService: EHRService,
		private readonly employeeTrustService: EmployeeTrustService,
		private readonly insuranceRateSettingService: InsuranceRateSettingService,
		private readonly salaryIncomeTaxService: SalaryIncomeTaxService,
		private readonly holidaysTypeService: HolidaysTypeService,
		private readonly calculateService: CalculateService,
	) { }

	async getCommonParameters(
		period_id: number,
		pay_type: PayTypeEnumType,
	) {
		// MARK: Data
		const allowance_list = await this.ehrService.getAllowance(period_id);
		const allowance_type_list = await this.ehrService.getAllowanceType();
		const payset_list = await this.ehrService.getPayset(period_id);
		const employee_data_list = await this.employeeDataService.getCurrentEmployeeData(period_id);
		const employee_payment_list = await this.employeePaymentService.getCurrentEmployeePayment(period_id);
		const employee_trust_list = await this.employeeTrustService.getCurrentEmployeeTrustFE(period_id);
		const overtime_list = await this.ehrService.getOvertime(period_id, pay_type);
		const insurance_rate_setting = await this.insuranceRateSettingService.getCurrentInsuranceRateSetting(period_id);
		const holiday_list = await this.ehrService.getHoliday(period_id);
		const holidays_type_list = await this.holidaysTypeService.getCurrentHolidaysType();
		const bonus_list = await this.ehrService.getBonus(period_id, pay_type);
		const bonus_type_list = await this.ehrService.getBonusType();
		const expense_list = await this.ehrService.getExpense(period_id);
		const expense_type_list = await this.ehrService.getExpenseClass();
		const salary_income_tax_list = await this.salaryIncomeTaxService.getCurrentSalaryIncomeTax(period_id);

		const commonParameters: CommonParametersType = {
			allowance_list: allowance_list,
			allowance_type_list: allowance_type_list,
			payset_list: payset_list,
			employee_data_list: employee_data_list,
			employee_payment_list: employee_payment_list,
			employee_trust_list: employee_trust_list,
			insurance_rate_setting: insurance_rate_setting!,
			overtime_list: overtime_list,
			holiday_list: holiday_list,
			holidays_type_list: holidays_type_list,
			bonus_list: bonus_list,
			bonus_type_list: bonus_type_list,
			expense_list: expense_list,
			expense_class_list: expense_type_list,
			salary_income_tax_list: salary_income_tax_list,
		};

		return commonParameters;
	}

	async createTransaction(
		emp_no: string,
		period_id: number,
		issue_date: string,
		pay_type: PayTypeEnumType,
		note: string,
		commonParameters: CommonParametersType
	) {
		// MARK: Data
		const allowance_list = commonParameters.allowance_list;
		const allowance_type_list = commonParameters.allowance_type_list;
		const payset = commonParameters.payset_list.find(p => p.emp_no === emp_no);
		const employee_data = commonParameters.employee_data_list.find(e => e.emp_no === emp_no);
		const employee_payment = commonParameters.employee_payment_list.find(e => e.emp_no === emp_no);
		const employee_trust = commonParameters.employee_trust_list.find(e => e.emp_no === emp_no);
		const insurance_rate_setting = commonParameters.insurance_rate_setting;
		const overtime_list = commonParameters.overtime_list.filter(o => o.emp_no === emp_no);
		const holiday_list = commonParameters.holiday_list.filter(h => h.emp_no === emp_no);
		const holidays_type_list = commonParameters.holidays_type_list;
		const bonus_list = commonParameters.bonus_list.filter(b => b.emp_no === emp_no);
		const bonus_type_list = commonParameters.bonus_type_list;
		const expense_list = commonParameters.expense_list.filter(e => e.emp_no === emp_no);
		const expense_class_list = commonParameters.expense_class_list;
		const salary_income_tax_list = commonParameters.salary_income_tax_list;

		const has_trust = employee_trust ? true : false;
		const discounted_employee_payment = await this.calculateService.discountedPayment(employee_payment!, payset);
		const full_attendance_bonus = await this.calculateService.getFullAttendanceBonus(bonus_list, bonus_type_list);
		const reissue_salary = await this.calculateService.getReissueSalary(expense_list, expense_class_list);
		const operational_performance_bonus = await this.calculateService.getOperationalPerformanceBonus(pay_type, bonus_list, bonus_type_list);
		const other_addition_tax = await this.calculateService.getOtherAdditionTax(expense_list, allowance_type_list);

		const department = employee_data!.department;
		const work_type = employee_data!.work_type;
		const work_status = employee_data!.work_status;
		const position = employee_data!.position;
		const group_insurance_type = employee_data!.group_insurance_type;
		const dependents = employee_data!.dependents;
		const healthcare_dependents = employee_data!.healthcare_dependents;

		const l_i = discounted_employee_payment!.l_i;
		const h_i = discounted_employee_payment!.h_i;
		const l_r = discounted_employee_payment!.l_r;
		const occupational_injury = discounted_employee_payment!.occupational_injury;
		const supervisor_allowance = discounted_employee_payment!.supervisor_allowance;
		const shift_allowance = await this.ehrService.getTargetAllowance(allowance_list, allowance_type_list, emp_no, "輪班津貼");
		const professional_cert_allowance = ((await this.ehrService.getTargetAllowance(allowance_list, allowance_type_list, emp_no, "證照津貼")) * (payset ? payset.work_day! : 30)) / 30;
		const food_allowance = discounted_employee_payment!.food_allowance;
		const long_service_allowance_type = discounted_employee_payment!.long_service_allowance_type;
		const long_service_allowance = (long_service_allowance_type === LongServiceEnum.Enum.month_allowance) ? discounted_employee_payment!.long_service_allowance : 0;
		const base_salary = discounted_employee_payment!.base_salary;
		const received_elderly_benefits = false;
		// MARK: Calculated Results
		const other_deduction_tax = await this.calculateService.getOtherDeductionTax(expense_list, expense_class_list);
		const gross_salary = await this.calculateService.getGrossSalary(employee_payment!, payset!, professional_cert_allowance, pay_type, full_attendance_bonus, employee_data!, operational_performance_bonus);
		const discounted_gross_salary = await this.calculateService.getGrossSalary(discounted_employee_payment!, payset!, professional_cert_allowance, pay_type, full_attendance_bonus, employee_data!, operational_performance_bonus);
		const special_leave_deduction = await this.calculateService.getSpecialLeaveDeduction(employee_data!, holidays_type_list, holiday_list, gross_salary, insurance_rate_setting!, professional_cert_allowance);
		const l_i_deduction = await this.calculateService.getLaborInsuranceDeduction(employee_data!, discounted_employee_payment!, payset!, insurance_rate_setting!);
		const h_i_deduction = await this.calculateService.getHealthInsuranceDeduction(employee_data!, discounted_employee_payment!, insurance_rate_setting!);
		const welfare_contribution = await this.calculateService.getWelfareContribution(employee_data!, discounted_employee_payment!, full_attendance_bonus, operational_performance_bonus);
		const subsidy_allowance = discounted_employee_payment!.subsidy_allowance;
		const weekday_overtime_pay = await this.calculateService.getWeekdayOvertimePay(employee_data!, discounted_employee_payment!, overtime_list, payset!, insurance_rate_setting!, full_attendance_bonus, pay_type, shift_allowance, gross_salary, professional_cert_allowance);
		const holiday_overtime_pay = await this.calculateService.getHolidayOvertimePay(employee_data!, discounted_employee_payment!, overtime_list, payset!, insurance_rate_setting!, full_attendance_bonus!, pay_type, shift_allowance, gross_salary, professional_cert_allowance);
		const leave_deduction = await this.calculateService.getLeaveDeduction(employee_data!, holiday_list!, holidays_type_list, insurance_rate_setting!, full_attendance_bonus, shift_allowance, gross_salary, professional_cert_allowance);
		const exceed_overtime_pay = await this.calculateService.getExceedOvertimePay(employee_data!, discounted_employee_payment!, overtime_list!, payset!, insurance_rate_setting!, full_attendance_bonus, pay_type, shift_allowance, gross_salary, professional_cert_allowance);
		const salary_income_deduction = await this.calculateService.getSalaryIncomeDeduction(discounted_employee_payment!, reissue_salary!, full_attendance_bonus!, exceed_overtime_pay!, leave_deduction!, operational_performance_bonus, other_addition_tax, special_leave_deduction, other_deduction_tax, shift_allowance, professional_cert_allowance);
		const group_insurance_deduction = await this.calculateService.getGroupInsuranceDeduction(expense_list, expense_class_list);
		const other_deduction = await this.calculateService.getOtherDeduction(expense_list, expense_class_list);
		const other_addition = await this.calculateService.getOtherAddition(expense_list, allowance_type_list);
		const meal_deduction = await this.calculateService.getMealDeduction(expense_list, expense_class_list);
		const taxable_income = await this.calculateService.getTaxableIncome(discounted_employee_payment!, exceed_overtime_pay, professional_cert_allowance);
		const income_tax = await this.calculateService.getSalaryIncomeTax(employee_data!, issue_date, salary_income_tax_list, salary_income_deduction);
		const bonus_tax = await this.calculateService.getBonusTax();
		const occupational_allowance = discounted_employee_payment!.occupational_allowance;
		const non_leave_compensation = await this.calculateService.getNonLeaveCompensation(holiday_list!, holidays_type_list, gross_salary, insurance_rate_setting!, employee_data!);
		const end_of_year_bonus = await this.calculateService.getYearEndBonus(bonus_list, bonus_type_list);
		const taxable_subtotal = await this.calculateService.getTaxableSubtotal(pay_type, discounted_employee_payment!, operational_performance_bonus, reissue_salary, exceed_overtime_pay, other_addition_tax, full_attendance_bonus, end_of_year_bonus, professional_cert_allowance, shift_allowance);
		const retirement_income = await this.calculateService.getRetirementIncome(expense_list, expense_class_list);
		const non_taxable_subtotal = await this.calculateService.getNonTaxableSubtotal(discounted_employee_payment!, weekday_overtime_pay, holiday_overtime_pay, non_leave_compensation, other_addition, retirement_income, expense_list, expense_class_list);
		const salary_income_tax = await this.calculateService.getSalaryIncomeTax(employee_data!, issue_date, salary_income_tax_list, salary_income_deduction);
		const l_i_pay = await this.calculateService.getLaborInsurancePay(discounted_employee_payment!, employee_data!, insurance_rate_setting!, payset, received_elderly_benefits, pay_type);
		const salary_advance = await this.calculateService.getSalaryAdvance(pay_type, payset, discounted_employee_payment!, insurance_rate_setting!, employee_data!);
		const h_i_pay = await this.calculateService.getHealthInsurancePay(discounted_employee_payment!, employee_data!, insurance_rate_setting!);
		const group_insurance_pay = await this.calculateService.getGroupInsurancePay(employee_data!);
		const income_tax_deduction = await this.calculateService.getIncomeTaxDeduction(expense_list, expense_class_list);
		const l_r_self = await this.calculateService.getLRSelf(discounted_employee_payment);
		const parking_fee = await this.calculateService.getParkingFee(expense_list, expense_class_list);
		const brokerage_fee = await this.calculateService.getBrokerageFee(expense_list, expense_class_list);
		const total_salary = await this.calculateService.getTotalSalary(discounted_employee_payment!, full_attendance_bonus, professional_cert_allowance, shift_allowance);
		const salary_range = await this.calculateService.getSalaryRange(total_salary);
		const dragon_boat_festival_bonus = await this.calculateService.getDragonBoatFestivalBonus();
		const mid_autumn_festival_bonus = await this.calculateService.getMidAutumnFestivalBonus();
		const bank_account_1 = employee_data!.bank_account_taiwan;
		// const bank_account_2 = employee_acount![1]?.bank_account!;
		// const foreign_currency_account =("");
		const bonus_ratio = -1; //bonus_setting!.fixed_multiplier;
		const annual_days_in_service = 365; // MARK: 年度在職天數不知道在哪
		const l_r_contribution = await this.calculateService.getLaborRetirementContribution(employee_data!, discounted_employee_payment!);
		const old_l_r_contribution = await this.calculateService.getOldLaborRetirementContribution(employee_data!, taxable_subtotal, non_taxable_subtotal, payset);
		const seniority = 0;
		const assessment_rate = 0;
		const assessment_bonus = await this.calculateService.getAssessmentBonus();
		const probation_period_over = false;
		const disabilty_level = employee_data!.disabilty_level;
		const v_2_h_i = await this.calculateService.getSecondGenerationHealthInsurance(period_id, emp_no, pay_type, insurance_rate_setting!, employee_payment!);
		const emp_trust_reserve = employee_trust ? employee_trust.emp_trust_reserve : null;
		const emp_special_trust_incent = employee_trust ? employee_trust!.emp_special_trust_incent : null;
		const org_trust_reserve = employee_trust ? employee_trust!.org_trust_reserve : null;
		const org_special_trust_incent = employee_trust ? employee_trust!.org_special_trust_incent : null;
		const g_i_deduction_promotion = await this.calculateService.getGroupInsuranceDeductionPromotion(expense_list, expense_class_list);
		const deduction_subtotal = await this.calculateService.getDeductionSubtotal(pay_type, salary_income_tax, bonus_tax, welfare_contribution, l_i_deduction, h_i_deduction, group_insurance_deduction, g_i_deduction_promotion, leave_deduction, special_leave_deduction, other_deduction, other_deduction_tax, income_tax_deduction, l_r_self, parking_fee, brokerage_fee, v_2_h_i, meal_deduction);
		const net_salary = await this.calculateService.getNetSalary(pay_type, taxable_subtotal, non_taxable_subtotal, deduction_subtotal);
		const special_leave = await this.calculateService.getSpecialLeave(holiday_list, holidays_type_list);
		const full_attendance_personal_leave = await this.calculateService.getFullAtendancePersonalLeave(holiday_list, holidays_type_list);
		const full_attendance_sick_leave = await this.calculateService.getFullAtendanceSickLeave(holiday_list, holidays_type_list);

		const newTransaction = await Transaction.create({
			period_id: period_id,
			issue_date: issue_date, // 發薪日期
			pay_type: pay_type, // 發薪別
			department: department, // 部門
			emp_no: emp_no, // 員工編號
			work_type: work_type, // 工作類別
			work_status: work_status, // 工作形態
			position: position, // 職等
			group_insurance_type: group_insurance_type, // 團保類別
			dependents: dependents, // 扶養人數
			healthcare_dependents: healthcare_dependents, // 健保眷口數
			l_i: l_i, // 勞保
			h_i: h_i, // 健保
			l_r: l_r, // 勞退
			occupational_injury: occupational_injury, // 職災
			supervisor_allowance: supervisor_allowance, // 主管津貼
			professional_cert_allowance: professional_cert_allowance, // 專業証照津貼
			base_salary: base_salary, // 底薪
			food_allowance: food_allowance, // 伙食津貼
			gross_salary: discounted_gross_salary, // 應發底薪
			l_i_deduction: l_i_deduction, // 勞保扣除額
			h_i_deduction: h_i_deduction, // 健保扣除額
			welfare_contribution: welfare_contribution, // 福利金提撥
			subsidy_allowance: subsidy_allowance, // 補助津貼
			weekday_overtime_pay: weekday_overtime_pay, // 平日加班費
			holiday_overtime_pay: holiday_overtime_pay, // 假日加班費
			leave_deduction: leave_deduction, // 請假扣款
			exceed_overtime_pay: exceed_overtime_pay, // 超時加班
			full_attendance_bonus: full_attendance_bonus, // 全勤獎金
			group_insurance_deduction: group_insurance_deduction, // 團保費代扣
			other_deduction: other_deduction, // 其他減項
			other_addition: other_addition, // 其他加項
			meal_deduction: meal_deduction, // 伙食扣款
			taxable_income: taxable_income, // 課稅所得
			income_tax: income_tax, // 薪資所得稅
			bonus_tax: bonus_tax, // 獎金所得稅
			occupational_allowance: occupational_allowance, // 職務津貼
			shift_allowance: shift_allowance, // 輪班津貼
			non_leave_compensation: non_leave_compensation, // 不休假代金
			salary_income_deduction: salary_income_deduction, // 薪資所得扣繳總額
			taxable_subtotal: taxable_subtotal, // 課稅小計
			non_taxable_subtotal: non_taxable_subtotal, // 非課稅小計
			deduction_subtotal: deduction_subtotal, // 減項小計
			l_i_pay: l_i_pay, // 勞保費
			salary_advance: salary_advance, // 工資墊償
			h_i_pay: h_i_pay, // 健保費
			group_insurance_pay: group_insurance_pay, // 團保費
			net_salary: net_salary, // 實發金額
			other_addition_tax: other_addition_tax, // 其他加項稅
			other_deduction_tax: other_deduction_tax, // 其他減項稅
			income_tax_deduction: income_tax_deduction, // 所得稅代扣
			l_r_self: l_r_self, // 勞退金自提
			parking_fee: parking_fee, // 停車費
			brokerage_fee: brokerage_fee, // 仲介費
			salary_range: salary_range, // 薪資區隔
			total_salary: total_salary, // 薪資總額
			dragon_boat_festival_bonus: dragon_boat_festival_bonus, // 端午獎金
			mid_autumn_festival_bonus: mid_autumn_festival_bonus, // 中秋獎金
			note: note, // 備註
			bank_account_1: bank_account_1, // 帳號1
			bonus_ratio: bonus_ratio, // 獎金比率
			annual_days_in_service: annual_days_in_service, // 年度在職天數
			l_r_contribution: l_r_contribution, // 勞退金提撥
			old_l_r_contribution: old_l_r_contribution, // 勞退金提撥_舊制
			seniority: seniority, // 年資
			assessment_rate: assessment_rate, // 考核比率
			assessment_bonus: assessment_bonus, // 考核獎金
			probation_period_over: probation_period_over, // 試用期滿
			disabilty_level: disabilty_level, // 殘障等級
			retirement_income: retirement_income, // 退職所得
			received_elderly_benefits: received_elderly_benefits, // 已領老年給付
			v_2_h_i: v_2_h_i, // 二代健保
			has_trust: has_trust, // 持股信託_YN
			emp_trust_reserve: emp_trust_reserve, // 員工信託提存金
			emp_special_trust_incent: emp_special_trust_incent, // 特別信託獎勵金_員工
			org_trust_reserve: org_trust_reserve, // 公司獎勵金
			org_special_trust_incent: org_special_trust_incent, // 特別信託獎勵金_公司
			g_i_deduction_promotion: g_i_deduction_promotion, // 團保費代扣_升等
			special_leave_deduction: special_leave_deduction, // 特別事假扣款
			special_leave: special_leave, // 特別事假
			full_attendance_personal_leave: full_attendance_personal_leave, // 有全勤事假
			full_attendance_sick_leave: full_attendance_sick_leave, // 有全勤病假
			long_service_allowance: long_service_allowance, // 久任津貼
			disable: false,
			create_by: "system",
			update_by: "system",
		});
		return newTransaction;
	}

	async getTransactionByEmpNo(
		emp_no: string,
		period_id: number
	): Promise<Transaction | null> {
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
			order: [["emp_no", "ASC"]],
		});
		return transactions;
	}

	async getUniqueTransaction(
		period_id: number,
		emp_no: string,
		pay_type: PayTypeEnumType
	): Promise<Transaction | null> {
		const transaction = await Transaction.findOne({
			where: {
				period_id: period_id,
				emp_no: emp_no,
				pay_type: pay_type,
			},
		});
		return transaction;
	}

	async deleteTransaction(transaction_id: number): Promise<void> {
		await Transaction.destroy({ where: { id: transaction_id } });
	}
}
