import { container, injectable } from "tsyringe";
import {} from "../api/types/parameters_input_type";
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
import { BaseResponseError } from "../api/error/BaseResponseError";
import { LongServiceEnum } from "../api/types/long_service_enum";

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
		const allowance_list = await ehrService.getAllowance(period_id);
		const allowance_type_list = await ehrService.getAllowanceType();
		const payset = (
			await ehrService.getPaysetByEmpNoList(period_id, [emp_no])
		)[0];
		const calculateService = container.resolve(CalculateService);
		const employee_data =
			await employeeDataService.getEmployeeDataByEmpNoByPeriod(
				period_id,
				emp_no
			);
		const employee_payment_dec =
			await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
				emp_no,
				period_id
			);

		if (employee_payment_dec == null) {
			throw new BaseResponseError("Employee Payment does not exist");
		}

		const discounted_employee_payment_dec =
			await calculateService.discountedPayment(
				employee_payment_dec,
				payset
			);

		const bonus_setting =
			await bonusSettingService.getCurrentBonusSetting();
		const employee_acount =
			await employeeAccountService.getEmployeeAccountByEmpNo(emp_no);
		let has_trust = true; // todo
		const employee_trust_fe =
			await employeeTrustService.getCurrentEmployeeTrustFEByEmpNo(
				emp_no,
				period_id
			);

		if (employee_trust_fe == null) {
			has_trust = false;
			// throw new BaseResponseError("Employee Trust does not exist");
		}
		const overtime_list = await ehrService.getOvertimeByEmpNoList(
			period_id,
			[emp_no],
			pay_type
		);
		const insurance_rate_setting =
			await insuranceRateSettingService.getCurrentInsuranceRateSetting(
				period_id
			);
		const holiday_list = await ehrService.getHolidayByEmpNoList(period_id, [
			emp_no,
		]);
		const full_attendance_bonus =
			await calculateService.getFullAttendanceBonus(
				period_id,
				emp_no,
				pay_type
			);
		const holidays_type =
			await holidaysTypeService.getCurrentHolidaysType();
		const reissue_salary = await calculateService.getReissueSalary(
			period_id,
			emp_no
		);
		const operational_performance_bonus =
			await calculateService.getOperationalPerformanceBonus(
				period_id,
				emp_no,
				pay_type
			);
		const other_addition_tax = await calculateService.getOtherAdditionTax(
			period_id,
			emp_no
		);

		period_id = period_id;
		issue_date = issue_date;
		pay_type = pay_type;
		const department = employee_data!.department;
		emp_no = emp_no;
		const work_type = employee_data!.work_type;
		const work_status = employee_data!.work_status;
		const position = employee_data!.position;
		const group_insurance_type = employee_data!.group_insurance_type;
		const dependents = employee_data!.dependents;
		const healthcare_dependents = employee_data!.healthcare_dependents;
		const l_i = discounted_employee_payment_dec!.l_i;
		const h_i = discounted_employee_payment_dec!.h_i;
		const l_r = discounted_employee_payment_dec!.l_r;
		const occupational_injury =
			discounted_employee_payment_dec!.occupational_injury;
		const supervisor_allowance =
			discounted_employee_payment_dec!.supervisor_allowance;
		const shift_allowance = await ehrService.getTargetAllowance(
			allowance_list,
			allowance_type_list,
			emp_no,
			"輪班津貼"
		);
		const professional_cert_allowance =
			((await ehrService.getTargetAllowance(
				allowance_list,
				allowance_type_list,
				emp_no,
				"證照津貼"
			)) *
				(payset ? payset.work_day! : 30)) /
			30;
		const food_allowance = discounted_employee_payment_dec!.food_allowance;
		const base_salary = discounted_employee_payment_dec!.base_salary;
		const received_elderly_benefits = false;
		const long_service_allowance_type = discounted_employee_payment_dec!.long_service_allowance_type;
		const long_service_allowance = (long_service_allowance_type === LongServiceEnum.Enum.month_allowance)? discounted_employee_payment_dec!.long_service_allowance : 0; 
		// MARK: Calculated Results
		const other_deduction_tax = await calculateService.getOtherDeductionTax(
			period_id,
			emp_no
		);
		const gross_salary = await calculateService.getGrossSalary(
			employee_payment_dec!,
			payset!,
			professional_cert_allowance,
			pay_type,
			full_attendance_bonus,
			employee_data!,
			operational_performance_bonus
		);
		const discounted_gross_salary = await calculateService.getGrossSalary(
			discounted_employee_payment_dec!,
			payset!,
			professional_cert_allowance,
			pay_type,
			full_attendance_bonus,
			employee_data!,
			operational_performance_bonus
		);
		const special_leave_deduction =
			await calculateService.getSpecialLeaveDeduction(
				employee_data!,
				holidays_type,
				holiday_list,
				gross_salary,
				insurance_rate_setting!,
				professional_cert_allowance
			);

		const l_i_deduction = await calculateService.getLaborInsuranceDeduction(
			employee_data!,
			discounted_employee_payment_dec!,
			payset!,
			insurance_rate_setting!
		);
		const h_i_deduction =
			await calculateService.getHealthInsuranceDeduction(
				employee_data!,
				discounted_employee_payment_dec!,
				insurance_rate_setting!
			);
		const welfare_contribution =
			await calculateService.getWelfareContribution(
				employee_data!,
				discounted_employee_payment_dec!,
				full_attendance_bonus,
				operational_performance_bonus
			);
		const subsidy_allowance =
			discounted_employee_payment_dec!.subsidy_allowance;
		const weekday_overtime_pay =
			await calculateService.getWeekdayOvertimePay(
				employee_data!,
				discounted_employee_payment_dec!,
				overtime_list,
				payset!,
				insurance_rate_setting!,
				full_attendance_bonus,
				pay_type,
				shift_allowance,
				gross_salary,
				professional_cert_allowance
			);
		const holiday_overtime_pay =
			await calculateService.getHolidayOvertimePay(
				employee_data!,
				discounted_employee_payment_dec!,
				overtime_list,
				payset!,
				insurance_rate_setting!,
				full_attendance_bonus!,
				pay_type,
				shift_allowance,
				gross_salary,
				professional_cert_allowance
			); // change name
		const leave_deduction = await calculateService.getLeaveDeduction(
			employee_data!,
			holiday_list!,
			holidays_type,
			insurance_rate_setting!,
			full_attendance_bonus,
			shift_allowance,
			gross_salary,
			professional_cert_allowance
		);
		const exceed_overtime_pay = await calculateService.getExceedOvertimePay(
			employee_data!,
			discounted_employee_payment_dec!,
			overtime_list!,
			payset!,
			insurance_rate_setting!,
			full_attendance_bonus,
			pay_type,
			shift_allowance,
			gross_salary,
			professional_cert_allowance
		);
		const salary_income_deduction =
			await calculateService.getSalaryIncomeDeduction(
				// employee_data!,
				discounted_employee_payment_dec!,
				// payset!,
				reissue_salary!,
				full_attendance_bonus!,
				exceed_overtime_pay!,
				leave_deduction!,
				operational_performance_bonus,
				other_addition_tax,
				special_leave_deduction,
				other_deduction_tax,
				shift_allowance,
				professional_cert_allowance
			);
		const group_insurance_deduction =
			await calculateService.getGroupInsuranceDeduction(
				period_id,
				emp_no
			);
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
			period_id,
			emp_no
		);
		const taxable_income = await calculateService.getTaxableIncome(
			// period_id,
			// emp_no
			discounted_employee_payment_dec!,
			exceed_overtime_pay,
			professional_cert_allowance
		);
		const income_tax = await calculateService.getSalaryIncomeTax(
			employee_data!,
			issue_date,
			salary_income_deduction
		);
		const bonus_tax = await calculateService.getBonusTax();
		const occupational_allowance =
			discounted_employee_payment_dec!.occupational_allowance;

		const non_leave_compensation =
			await calculateService.getNonLeaveCompensation(
				holiday_list!,
				holidays_type,
				gross_salary,
				insurance_rate_setting!,
				employee_data!
			);
		const end_of_year_bonus = await calculateService.getYearEndBonus(
			period_id,
			emp_no,
			pay_type
		);
		const taxable_subtotal = await calculateService.getTaxableSubtotal(
			pay_type,
			discounted_employee_payment_dec!,
			operational_performance_bonus,
			reissue_salary,
			exceed_overtime_pay,
			other_addition_tax,
			full_attendance_bonus,
			end_of_year_bonus,
			professional_cert_allowance,
			shift_allowance
		);
		const retirement_income = await calculateService.getRetirementIncome(
			period_id,
			emp_no
		);
		const non_taxable_subtotal =
			await calculateService.getNonTaxableSubtotal(
				discounted_employee_payment_dec!,
				weekday_overtime_pay,
				holiday_overtime_pay,
				non_leave_compensation,
				other_addition,
				retirement_income,
				period_id,
				emp_no
			);
		const salary_income_tax = await calculateService.getSalaryIncomeTax(
			employee_data!,
			issue_date,
			salary_income_deduction
		);

		const l_i_pay = await calculateService.getLaborInsurancePay(
			discounted_employee_payment_dec!,
			employee_data!,
			insurance_rate_setting!,
			payset,
			received_elderly_benefits,
			pay_type
		);
		const salary_advance = await calculateService.getSalaryAdvance(
			pay_type,
			payset,
			discounted_employee_payment_dec!,
			insurance_rate_setting!,
			employee_data!
		);
		const h_i_pay = await calculateService.getHealthInsurancePay(
			discounted_employee_payment_dec!,
			employee_data!,
			insurance_rate_setting!
		);
		const group_insurance_pay = await calculateService.getGroupInsurancePay(
			employee_data!
		);

		const income_tax_deduction =
			await calculateService.getIncomeTaxDeduction(period_id, emp_no);
		const l_r_self = await calculateService.getLRSelf(
			discounted_employee_payment_dec
		);
		const parking_fee = await calculateService.getParkingFee(
			period_id,
			emp_no
		);
		const brokerage_fee = await calculateService.getBrokerageFee(
			period_id,
			emp_no
		);
		const total_salary = await calculateService.getTotalSalary(
			discounted_employee_payment_dec!,
			full_attendance_bonus,
			professional_cert_allowance,
			shift_allowance
		);
		const salary_range = await calculateService.getSalaryRange(
			total_salary
		);
		const dragon_boat_festival_bonus =
			await calculateService.getDragonBoatFestivalBonus();
		const mid_autumn_festival_bonus =
			await calculateService.getMidAutumnFestivalBonus();
		note = note;
		const bank_account_1 = employee_data!.bank_account;
		// const bank_account_2 = employee_acount![1]?.bank_account!;
		// const foreign_currency_account =("");
		const bonus_ratio = -1; //bonus_setting!.fixed_multiplier;
		const annual_days_in_service = 365; // MARK: 年度在職天數不知道在哪
		const l_r_contribution =
			await calculateService.getLaborRetirementContribution(
				employee_data!,
				discounted_employee_payment_dec!
			);
		const old_l_r_contribution =
			await calculateService.getOldLaborRetirementContribution(
				employee_data!,
				taxable_subtotal,
				non_taxable_subtotal,
				payset
			);
		const seniority = 0;
		const assessment_rate = 0;
		const assessment_bonus = await calculateService.getAssessmentBonus();
		const probation_period_over = false;

		const disabilty_level = employee_data!.disabilty_level;

		const v_2_h_i = await calculateService.getSecondGenerationHealthInsurance(period_id, emp_no, pay_type, insurance_rate_setting!, employee_payment_dec);

		const emp_trust_reserve = employee_trust_fe
			? employee_trust_fe.emp_trust_reserve
			: null;
		const emp_special_trust_incent = employee_trust_fe
			? employee_trust_fe!.emp_special_trust_incent
			: null;
		const org_trust_reserve = employee_trust_fe
			? employee_trust_fe!.org_trust_reserve
			: null;
		const org_special_trust_incent = employee_trust_fe
			? employee_trust_fe!.org_special_trust_incent
			: null;
		const g_i_deduction_promotion =
			await calculateService.getGroupInsuranceDeductionPromotion(
				period_id,
				emp_no
			);
		const deduction_subtotal = await calculateService.getDeductionSubtotal(
			pay_type,
			salary_income_tax,
			bonus_tax,
			welfare_contribution,
			l_i_deduction,
			h_i_deduction,
			group_insurance_deduction,
			g_i_deduction_promotion,
			leave_deduction,
			special_leave_deduction,
			other_deduction,
			other_deduction_tax,
			income_tax_deduction,
			l_r_self,
			parking_fee,
			brokerage_fee,
			v_2_h_i,
			meal_deduction
		);
		const net_salary = await calculateService.getNetSalary(
			// gross_salary,
			// payset!
			pay_type,
			taxable_subtotal,
			non_taxable_subtotal,
			deduction_subtotal
		);
		const special_leave = await calculateService.getSpecialLeave(
			holiday_list,
			holidays_type
		);
		const full_attendance_personal_leave =
			await calculateService.getFullAtendancePersonalLeave(
				holiday_list,
				holidays_type
			);
		const full_attendance_sick_leave =
			await calculateService.getFullAtendanceSickLeave(
				holiday_list,
				holidays_type
			);
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
