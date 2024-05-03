import { container, injectable } from "tsyringe";
import { Op } from "sequelize";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { EmployeePayment } from "../database/entity/SALARY/employee_payment";
import { Period } from "../database/entity/UMEDIA/period";
import { EHRService } from "./ehr_service";
import { Overtime } from "../database/entity/UMEDIA/overtime";
import { Payset } from "../database/entity/UMEDIA/payset";
import { InsuranceRateSetting } from "../database/entity/SALARY/insurance_rate_setting";
import { Holiday } from "../database/entity/UMEDIA/holiday";
import { AttendanceSetting } from "../database/entity/SALARY/attendance_setting";



const FOREIGN = "外籍勞工";
const PROFESSOR = "顧問";
const BOSS = "總經理";
const DAY_PAY = "日薪制";
const NEWBIE = "當月新進人員";
const WILL_LEAVE = "當月離職人員_破月";
const LEAVE_MAN = "離職人員";
const PARTTIME1 = "工讀生";
const PARTTIME2 = "建教生";
const CONTRACT = "約聘人員";


@injectable()
export class CalculateService {
	constructor() { }

	// MARK: 平日加班費
	async getNormalMoney(
		employee_data: EmployeeData,
		employee_payment: EmployeePayment,
		attendance_setting: AttendanceSetting,
		overtime: Overtime,
	): Promise<number> {
		/*
				平日加班費 = GetNormalMoney(
					工作類別,
					工作形態,
					應發底薪+全勤獎金+輪班津貼+專業証照津貼,
					加班1_時數,
					加班2_時數
				)
		*/
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		const money = employee_payment.base_salary;
		const t1 = overtime.加班1_時數;
		const T2 = overtime.加班2_時數;
		const SALARY_RATE = 最低工資率;

		const FOREIGN_RATE1 = attendance_setting.overtime_by_foreign_workers_1;
		const FOREIGN_RATE2 = attendance_setting.overtime_by_foreign_workers_2;
		const FOREIGN_RATE3 = attendance_setting.foreign_worker_holiday;
		const FOREIGN_RATE4 = attendance_setting.overtime_by_foreign_workers_3;

		const LOCAL_RATE1 = attendance_setting.overtime_by_local_workers_1;
		const LOCAL_RATE2 = attendance_setting.overtime_by_local_workers_2;
		const LOCAL_RATE3 = attendance_setting.local_worker_holiday;
		const LOCAL_RATE4 = attendance_setting.overtime_by_local_workers_3;

		if (kind1 === FOREIGN) return Math.round(SALARY_RATE * FOREIGN_RATE1 * t1 + SALARY_RATE * FOREIGN_RATE2 * T2);
		if (kind2 === LEAVE_MAN)	return 0;
		if (kind2 === DAY_PAY)	return Math.round(money / 8 * LOCAL_RATE1 * t1 + money / 8 * T2 * LOCAL_RATE2);
		if (kind2 === FOREIGN)	return Math.round(SALARY_RATE * FOREIGN_RATE1 * t1 + SALARY_RATE * FOREIGN_RATE2 * T2);
		return Math.round(money / 240 * LOCAL_RATE1 * t1 + money / 240 * T2 * LOCAL_RATE2);
	}

	//MARK: 假日加班費
	async getVocationMoney(
		employee_data: EmployeeData,
		employee_payment: EmployeePayment,
		attendance_setting: AttendanceSetting,
		overtime: Overtime,
	): Promise<number> {
		/*
			假日加班費 = GetVocationMoney(
					工作類別,
					工作形態,
					應發底薪+全勤獎金+輪班津貼+專業証照津貼,
					假日加班時數+國加班0_時數+例加班0_時數+例假日加班_時數,
					休加班1_時數+國加班1_時數,
					休加班2_時數+國加班2_時數,
					休加班3_時數
			)
		*/
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		const money = 應發底薪+全勤獎金+輪班津貼+專業証照津貼;
		const t1 = overtime.(假日加班時數+國加班0_時數+例加班0_時數+例假日加班_時數);
		const T2 = overtime.(休加班1_時數+國加班1_時數);
		const T3 = overtime.(休加班2_時數+國加班2_時數);
		const T4 = overtime.(休加班3_時數);
		const SALARY_RATE = 最低工資率;
		
		const FOREIGN_RATE1 = attendance_setting.overtime_by_foreign_workers_1;
		const FOREIGN_RATE2 = attendance_setting.overtime_by_foreign_workers_2;
		const FOREIGN_RATE3 = attendance_setting.foreign_worker_holiday;
		const FOREIGN_RATE4 = attendance_setting.overtime_by_foreign_workers_3;

		const LOCAL_RATE1 = attendance_setting.overtime_by_local_workers_1;
		const LOCAL_RATE2 = attendance_setting.overtime_by_local_workers_2;
		const LOCAL_RATE3 = attendance_setting.local_worker_holiday;
		const LOCAL_RATE4 = attendance_setting.overtime_by_local_workers_3;


		if (kind1 === FOREIGN)	return Math.round(SALARY_RATE * FOREIGN_RATE3 * t1 + SALARY_RATE * FOREIGN_RATE1 * T2 + SALARY_RATE * FOREIGN_RATE2 * T3 + SALARY_RATE * FOREIGN_RATE4 * T4);
		if (kind2 === LEAVE_MAN)	return 0;
		if (kind2 === DAY_PAY)	return Math.round(money / 8 * LOCAL_RATE3 * t1);
		if (kind2 === FOREIGN)	return Math.round(SALARY_RATE * FOREIGN_RATE3 * t1 + SALARY_RATE * FOREIGN_RATE1 * T2 + SALARY_RATE * FOREIGN_RATE2 * T3 + SALARY_RATE * FOREIGN_RATE4 * T4);
		return Math.round(money / 240 * LOCAL_RATE3 * t1 + money / 240 * LOCAL_RATE1 * T2 + money / 240 * LOCAL_RATE2 * T3 + money / 240 * LOCAL_RATE4 * T4);
	}	


	//MARK: 應發底薪
	async getGrossSalary(
		employee_payment: EmployeePayment,
		pay_set: Payset
	): Promise<number> {
		const gross_salary = (
			employee_payment.base_salary
			+ employee_payment.food_bonus
			+ employee_payment.supervisor_comp
			+ employee_payment.professional_cert_comp
			+ employee_payment.job_comp
			+ employee_payment.subsidy_comp
		) * (pay_set.work_day! / 30)
		return gross_salary;
	}
	//MARK: 勞保扣除額
	async getLaborInsuranceDeduction(
		employee_data: EmployeeData,
		employee_payment: EmployeePayment,
		payset: Payset,
		insuranceRateSetting: InsuranceRateSetting
	): Promise<number> {
		// rd("勞保扣除額") = CalacWorkTex(rd("勞保"), CheckNull(rd("工作天數"), 30), CheckNull(rd("勞保天數"), 30), rd("工作類別"), rd("工作形態"), CheckNull(rd("殘障等級"), "正常"), CheckNull(rd("勞保追加"), 30), rd("已領老年給付")) 'Jerry 07/03/30 加入殘障等級計算, 07/11/26 增加勞保追加計算,10/04/26增加"已領老年給付"判斷
		// Tax: rd("勞保")
		// Normalday: CheckNull(rd("工作天數"), 30)
		// PartTimeDay: CheckNull(rd("勞保天數"), 30)
		// kind1: rd("工作類別")
		// kind2: rd("工作形態")
		// hinder: CheckNull(rd("殘障等級"), "正常")
		// Work_type: rd("已領老年給付")

		const wci_normal = insuranceRateSetting.l_i_accident_rate;		// 勞工保險普通事故險
		const wci_ji = insuranceRateSetting.l_i_employment_premium_rate; // 勞工保險就業保險率

		const hinderDict: { [key: string]: number } = {
			"正常": 1,
			"輕度": 0.75,
			"中度": 0.5,
			"重度": 0
		};		

		const Tax = employee_payment.l_i;
		const Normalday = payset.work_day ?? 30;
		const PartTimeDay = payset.li_day ?? 30;
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		const hinder_rate = hinderDict[employee_data.accessible ?? "正常"] ?? 1;		// 假設accessible是殘障等級
		const old_age_benefit = (true || false);		// old_age_benefit: rd("已領老年給付")


		if (old_age_benefit)	return 0;	// 'Jerry 100426 已領老年給付者,員工免付勞保
		

		if (kind1 == FOREIGN || kind2 == FOREIGN) return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30)) * hinder_rate;   // 'Jerry 2023/04/06 由工作天數改為加勞保天數計算
		if (kind2 == PROFESSOR) return 0;
		if (kind2 == BOSS)	return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30)) * hinder_rate;	//   'Jerry 10/04/26 由工作天數改為加勞保天數計算
		if (kind2 == DAY_PAY)	return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30) + Math.round(Tax * wci_ji * 0.200001 * PartTimeDay / 30)) * hinder_rate;
		if (kind2 == NEWBIE || kind2 == WILL_LEAVE || kind2 == PARTTIME1 || kind2 == PARTTIME2 || kind2 == CONTRACT)	return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30, 0) + Math.round(Tax * wci_ji * 0.200001 * PartTimeDay / 30)) * hinder_rate;		// 'Jerry 07/07/19 由工作天數改為加勞保天數計算
		
		return Math.round(Math.round(Tax * wci_normal * 0.200001) + Math.round(Tax * wci_ji * 0.200001)) * hinder_rate
	}
	//MARK: 健保扣除額
	async getHealthInsuranceDeduction(
		employee_data: EmployeeData,
		employee_payment: EmployeePayment,
		insurance_rate_setting: InsuranceRateSetting
	): Promise<number> {
		// rd("健保扣除額") = CalacHelTax(rd("健保"), rd("健保眷口數"), rd("工作形態"), CheckNull(rd("殘障等級"), "正常"), 0, rd("健保追加"))   'Jerry 07/03/30 加入殘障等級計算  , 07/11/26 增加健保追加計算
		let Tax : number = employee_payment.h_i;
		let Peop : number = rd("健保眷口數");
		let kind : string = employee_data.work_status;
		const hinder : string = CheckNull(rd("殘障等級"), 0);
		let exePep : number = 0;
		let HelAdd_YN : boolean = rd("健保追加");				
		
		if (Peop > 3) Peop = 3;

		let hinder_rate: number = 1;
		if (hinder == "正常") hinder_rate = 1;
		if (hinder == "輕度") hinder_rate = 0.75;
		if (hinder == "中度") hinder_rate = 0.5;
		if (hinder == "重度") hinder_rate = 0;

		const nhi_rate = insurance_rate_setting.h_i_standard_rate;			// 健保一般保費費率 : 應該是這個

		if (HelAdd_YN) {
			if (kind === LEAVE_MAN || kind === PROFESSOR || kind === WILL_LEAVE) return 0;
			if (kind === BOSS) return ((Math.round(Math.round(Tax * nhi_rate) * (Peop + 1)) + Math.round(Math.round(Tax * nhi_rate) * exePep))) * hinder_rate * 2;
			return (Math.round(Math.round(Tax * nhi_rate * 0.3) * (Peop + 1)) + Math.round(Math.round(Tax * nhi_rate * 0.3) * exePep)) * hinder_rate * 2;
		}
		
		else {		// HelAdd_YN = False	=> 		不追加健保
			if (kind === LEAVE_MAN || kind === PROFESSOR || kind === WILL_LEAVE) return 0;
			if (kind === BOSS) return ((Math.round(Math.round(Tax * nhi_rate) * (Peop + 1)) + Math.round(Math.round(Tax * nhi_rate) * exePep))) * hinder_rate;
			return (Math.round(Tax * nhi_rate * 0.3) * (Peop + 1) + Math.round(Tax * nhi_rate * 0.3) * exePep) * hinder_rate;
		}

		return 0;
	}
	//MARK:福利金提撥
	async getWelfareDeduction(
		employ_data: EmployeeData,
		employ_payment: EmployeePayment
	): Promise<number> {
		// rd("福利金提撥") = GetFooMoney(rd("工作類別"), rd("工作形態"), rd("底薪"), rd("伙食津貼"), CheckNull(rd("營運積效獎金"), 0), CheckNull(rd("全勤獎金"), 0))
		const kind1 = employ_data.work_type;
		const kind2 = employ_data.work_status;
		const money = employ_payment.base_salary;
		const food = employ_payment.food_bonus;
		const Effect = CheckNull(rd("營運積效獎金"), 0);
		const Fulltime = CheckNull(rd("全勤獎金"), 0);

		if (kind1 === FOREIGN) return Math.round((money + food + Effect + Fulltime) * 0.005);
		if (kind2 === LEAVE_MAN)	return 0;
		if (kind2 === PROFESSOR)	return 0;
		if (kind2 === PARTTIME1)	return 0;
		if (kind2 === PARTTIME2)	return 0;
		if (kind2 === CONTRACT)	return 0;
		if (kind2 === DAY_PAY)	return 0;
		if (kind2 === FOREIGN)	return Math.round((money + food + Effect + Fulltime) * 0.005);

		return Math.round((money + food) * 0.005);

	}
	//MARK: 請假扣款
	async getLeaveDeduction(
		employ_data: EmployeeData,
		employ_payment: EmployeePayment,
		holiday: Holiday	// Maybe not this
	): Promise<number> {
		// UPDATE 薪資查詢 SET 薪資查詢.請假扣款 = GetLeaveMoney(薪資查詢!工作類別,薪資查詢!工作形態,薪資查詢!應發底薪,薪資查詢!補助津貼+薪資查詢!輪班津貼+薪資查詢!全勤獎金+薪資查詢!專業証照津貼,薪資查詢!事假時數,薪資查詢!病假時數)
		// 薪資查詢.不休假代金 = IIf(薪資查詢!工作類別="外籍勞工",round(GetSALARY_RATE()*(薪資查詢!不休假時數*Getnon_leaving_rate()+薪資查詢!不休假補休1時數*Getnon_leaving_rate1()+薪資查詢!不休假補休2時數*Getnon_leaving_rate2()+薪資查詢!不休假補休3時數*Getnon_leaving_rate3()+薪資查詢!不休假補休4時數*Getnon_leaving_rate4()+薪資查詢!不休假補休5時數*Getnon_leaving_rate5()),0),round(薪資查詢!應發底薪/240*(薪資查詢!不休假時數*Getnon_leaving_rate()+薪資查詢!不休假補休1時數*Getnon_leaving_rate1()+薪資查詢!不休假補休2時數*Getnon_leaving_rate2()+薪資查詢!不休假補休3時數*Getnon_leaving_rate3()+薪資查詢!不休假補休4時數*Getnon_leaving_rate4()+薪資查詢!不休假補休5時數*Getnon_leaving_rate5()),0));
		const kind1 = employ_data.work_type;
		const kind2 = employ_data.work_status;
		const money = 應發底薪;
		const bonus = 補助津貼 + 輪班津貼 + 全勤獎金 + 專業証照津貼;
		const t1 = holiday.事假時數; // 事假時數
		const T2 = holiday.病假時數; // 病假時數

		const SALARY_RATE = 0;		// 最低工資率
		if (kind1 === FOREIGN)	return Math.round(SALARY_RATE * t1 + SALARY_RATE / 2 * T2);	
		if (kind2 === LEAVE_MAN)	return 0;
		if (kind2 === FOREIGN)	return Math.round(SALARY_RATE * t1 + SALARY_RATE / 2 * T2);
		return Math.round((money + bonus) / 240 * t1 + (money + bonus) / 240 * T2 / 2);
	}
	
	//MARK: 全勤獎金
	async getAttendanceBonus(): Promise<number> {
		
	}
	//MARK: 團保費代扣
	async getGroupInsuranceDeduction(): Promise<number> {
		// 在"其他"這張表裡面
		const group_insurance_deduction = 0;
		return group_insurance_deduction;
	}
	//MARK: 補發薪資
	async getReissueSalary(): Promise<number> {
		// 在"其他"這張表裡面
		const reissue_salary = 0;
		return reissue_salary;
	}
	//MARK: 年終獎金
	async getYearEndBonus(): Promise<number> {
		const end_of_year_bonus = 0; // to be checked
		return end_of_year_bonus;
	}
	//MARK: 薪資所得稅
	async getSalaryIncomeTax(): Promise<number> {
		const salary_income_tax = 0
		return salary_income_tax
	}
	//MARK: 獎金所得稅
	async getBonusTax(): Promise<number> {
		const bonus_tax = 0
		return bonus_tax
	}
	//MARK: 不休假代金
	async getUnpaidLeaveDeduction(): Promise<number> {
		const unpaid_leave_deduction = 0
		return unpaid_leave_deduction
	}
	//MARK: 薪資所得扣繳總額
	async getSalaryIncomeDeduction(): Promise<number> {
		const salary_income_deduction = 0
		return salary_income_deduction
	}
	//MARK: 課稅小計
	async getTaxSummary(): Promise<number> {
		const tax_summary = 0
		return tax_summary
	}
	//MARK: 非課稅小計
	async getNonTaxSummary(): Promise<number> {
		const non_tax_summary = 0
		return non_tax_summary
	}
	//MARK: 減項小計
	async getDeductionSummary(): Promise<number> {
		const deduction_summary = 0
		return deduction_summary
	}
	//MARK: 勞保費
	async getLaborInsurance(
		employee_payment: EmployeePayment,
	): Promise<number> {
		return employee_payment.l_i
	}
	//MARK: 健保費
	async getHealthInsurance(
		employee_payment: EmployeePayment,
	): Promise<number> {
		return employee_payment.h_i
	}
	//MARK: 團保費
	//MARK: 實發金額

	//MARK: 所得稅代扣
	//MARK: 勞退金自提
	//MARK: 薪資區隔
	//MARK: 薪資總額
	//MARK: 勞退金提撥
	//MARK:二代健保
	//MARK:員工信托提存金
	//MARK:特別信託獎勵金＿員工
	//MARK:公司獎勵金
	//MARK:特別信託獎勵金＿公司
	//MARK:團保費代扣＿升等
	//MARK:特別事假扣款
}



/*
if (!工作天數)
	工作天數 = 30
if (!勞保天數)
	勞保天數 = 30
if (!勞保追加)
	勞保追加 = 0
if (!健保追加)
	建保追加 = False
*/