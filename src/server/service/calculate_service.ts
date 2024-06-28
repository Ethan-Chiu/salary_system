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
import { PayTypeEnum, PayTypeEnumType } from "../api/types/pay_type_enum";
import { HolidaysType } from "../database/entity/SALARY/holidays_type";



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


const rd = (key: string) => {throw new Error("Should change 'rd' to your functions")};
	
@injectable()
export class CalculateService {
	constructor() { }

	// MARK: 平日加班費
	async getWeekdayOvertimePay(
		employee_data: EmployeeData,
		employee_payment: EmployeePayment,
		overtime_list: Overtime[],
		payset: Payset,
		insurance_rate_setting: InsuranceRateSetting,
		full_attendance_bonus: number
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
		// 不確定專業證照津貼要不要加兩次
		const money = await this.getGrossSalary(employee_payment, payset);
		const shift_allowance = employee_payment.shift_allowance ?? 0;
		let hourly_fee = (money+shift_allowance+full_attendance_bonus) / 240;
		let t1 = 0;
		let t2 = 0;
		let t3 = 0;
		let t4 = 0;
		let t5 = 0;
		overtime_list.map((overtime) => {
			if (overtime.type_name === "平日"){
				t1 += overtime.hours_1 ?? 0;
				t2 += overtime.hours_2 ?? 0;
				t3 += overtime.hours_134 ?? 0;
				t4 += overtime.hours_167 ?? 0;
				t5 += overtime.hours_267 ?? 0;
			}
		})
		if (employee_data.work_type === "外籍勞工"){
			hourly_fee = insurance_rate_setting.l_i_wage_replacement_rate;
			return Math.round(hourly_fee * t1 +hourly_fee * t2 *2 +hourly_fee * t3 * 1.34+hourly_fee * t4 *1.67 +hourly_fee * t5 * 2.67);
		}
		else
			return Math.round(hourly_fee * t1 +hourly_fee * t2 *2 +hourly_fee * t3 * 1.34+hourly_fee * t4 *1.67 +hourly_fee * t5 * 2.67);
	}

	//MARK: 假日加班費
	async getHolidayOvertimePay(
		employee_data: EmployeeData,
		employee_payment: EmployeePayment,
		overtime_list: Overtime[],
		payset: Payset,
		insurance_rate_setting: InsuranceRateSetting,
		full_attendance_bonus: number
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
		const money = await this.getGrossSalary(employee_payment, payset);
		const shift_allowance = employee_payment.shift_allowance ?? 0;
		let hourly_fee = (money+shift_allowance+full_attendance_bonus) / 240;
		let t1 = 0;
		let t2 = 0;
		let t3 = 0;
		let t4 = 0;
		let t5 = 0;
		overtime_list.map((overtime) => {
			if (overtime.type_name === "國定假日" || "休息日"){
				t1 += overtime.hours_1 ?? 0;
				t2 += overtime.hours_2 ?? 0;
				t3 += overtime.hours_134 ?? 0;
				t4 += overtime.hours_167 ?? 0;
				t5 += overtime.hours_267 ?? 0;
			}
		})
		/// 外勞不確定是不是也是用hourly_fee
		// rate存哪裡？
		if (employee_data.work_type === "外籍勞工"){
			hourly_fee = insurance_rate_setting.l_i_wage_replacement_rate;
			return Math.round(hourly_fee * t1 +hourly_fee * t2 *2 +hourly_fee * t3 * 1.34+hourly_fee * t4 *1.67 +hourly_fee * t5 * 2.67);
		}
		else
			return Math.round(hourly_fee * t1 +hourly_fee * t2 *2 +hourly_fee * t3 * 1.34+hourly_fee * t4 *1.67 +hourly_fee * t5 * 2.67);
	}	
	
	// MARK: 超時加班費
	// async getExceedOvertimePay(
	// 	employee_data: EmployeeData,
	// 	employee_payment: EmployeePayment,
	// 	attendance_setting: AttendanceSetting,
	// 	overtime: Overtime
	// ): Promise<number> {
	// 	/*
	// 			超時加班 = GetOverTimeMoney(
	// 				工作類別,
	// 				工作形態,
	// 				應發底薪+全勤獎金+輪班津貼+專業証照津貼,
	// 				加班稅1_時數+休加班稅1_時數+國加班稅1_時數,
	// 				加班稅2_時數+休加班稅2_時數+國加班稅2_時數,
	// 				例假日加班稅_時數,
	// 				休加班稅3_時數
	// 			)
	// 	*/

	// 	const kind1 = employee_data.work_type;
	// 	const kind2 = employee_data.work_status;
	// 	const money = rd("應發底薪")+rd("全勤獎金")+rd("輪班津貼")+rd("專業証照津貼");
	// 	const t1 = rd("加班稅1_時數")+rd("休加班稅1_時數")+rd("國加班稅1_時數");	
	// 	const T2 = rd("加班稅2_時數")+rd("休加班稅2_時數")+rd("國加班稅2_時數");
	// 	const T3 = rd("例假日加班稅_時數");
	// 	const T4 = rd("休加班稅3_時數");
	// 	const SALARY_RATE = rd("最低工資率");
		
	// 	const FOREIGN_RATE1 = attendance_setting.overtime_by_foreign_workers_1;
	// 	const FOREIGN_RATE2 = attendance_setting.overtime_by_foreign_workers_2;
	// 	const FOREIGN_RATE3 = attendance_setting.foreign_worker_holiday;
	// 	const FOREIGN_RATE4 = attendance_setting.overtime_by_foreign_workers_3;

	// 	const LOCAL_RATE1 = attendance_setting.overtime_by_local_workers_1;
	// 	const LOCAL_RATE2 = attendance_setting.overtime_by_local_workers_2;
	// 	const LOCAL_RATE3 = attendance_setting.local_worker_holiday;
	// 	const LOCAL_RATE4 = attendance_setting.overtime_by_local_workers_3;

	// 	if (kind1 === FOREIGN)	return Math.round(SALARY_RATE * FOREIGN_RATE1 * t1 + SALARY_RATE * FOREIGN_RATE2 * T2 + SALARY_RATE * FOREIGN_RATE3 * T3 + SALARY_RATE * FOREIGN_RATE4 * T4);
	// 	if (kind2 === LEAVE_MAN)	return 0;
	// 	if (kind2 === FOREIGN)	return Math.round(SALARY_RATE * FOREIGN_RATE1 * t1 + SALARY_RATE * FOREIGN_RATE2 * T2 + SALARY_RATE * FOREIGN_RATE3 * T3 + SALARY_RATE * FOREIGN_RATE4 * T4);
	// 	return Math.round(money / 240 * LOCAL_RATE1 * t1 + money / 240 * LOCAL_RATE2 * T2 + money / 240 * LOCAL_RATE3 * T3 + money / 240 * LOCAL_RATE4 * T4);
	// }
	

	//MARK: 應發底薪
	async getGrossSalary(
		employee_payment: EmployeePayment,
		pay_set: Payset
	): Promise<number> {
		const gross_salary = (
			employee_payment.base_salary
			+ (employee_payment.food_allowance ?? 0)
			+ (employee_payment.supervisor_allowance ?? 0)
			+ (employee_payment.professional_cert_allowance ?? 0)
			+ (employee_payment.occupational_allowance ?? 0)
			+ (employee_payment.subsidy_allowance ?? 0)
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
		const wci_ji = insuranceRateSetting.l_i_employment_pay_rate; // 勞工保險就業保險率

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
		const hinder_rate = hinderDict[employee_data.disabilty_level ?? "正常"] ?? 1;
		const old_age_benefit = (true || false);		// old_age_benefit: rd("已領老年給付")


		if (old_age_benefit)	return 0;	// 'Jerry 100426 已領老年給付者,員工免付勞保
		

		if (kind1 == FOREIGN || kind2 == FOREIGN) return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30)) * hinder_rate;   // 'Jerry 2023/04/06 由工作天數改為加勞保天數計算
		if (kind2 == PROFESSOR) return 0;
		if (kind2 == BOSS)	return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30)) * hinder_rate;	//   'Jerry 10/04/26 由工作天數改為加勞保天數計算
		if (kind2 == DAY_PAY)	return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30) + Math.round(Tax * wci_ji * 0.200001 * PartTimeDay / 30)) * hinder_rate;
		if (kind2 == NEWBIE || kind2 == WILL_LEAVE || kind2 == PARTTIME1 || kind2 == PARTTIME2 || kind2 == CONTRACT)	return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30) + Math.round(Tax * wci_ji * 0.200001 * PartTimeDay / 30)) * hinder_rate;		// 'Jerry 07/07/19 由工作天數改為加勞保天數計算
		
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
		let Peop : number = employee_data.healthcare_dependents ?? 0;
		let kind : string = employee_data.work_status;
		const hinder : string = employee_data.disabilty_level ?? "正常";
		let exePep : number = 0;
		let HelAdd_YN : boolean = false;	// 建保追加 => 似乎bang不見了
		
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
		employee_data: EmployeeData,
		employee_payment: EmployeePayment
	): Promise<number> {
		// rd("福利金提撥") = GetFooMoney(rd("工作類別"), rd("工作形態"), rd("底薪"), rd("伙食津貼"), CheckNull(rd("營運積效獎金"), 0), CheckNull(rd("全勤獎金"), 0))
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		const money = employee_payment.base_salary;
		const food = employee_payment.food_allowance ?? 0;
		const Effect = rd("營運積效獎金") ?? 0;
		const Fulltime = rd("全勤獎金") ?? 0;

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
		employee_data: EmployeeData,
		employee_payment: EmployeePayment,
		holiday_list: Holiday[],	// Maybe not this
		payset: Payset,
		holidays_type: HolidaysType[],
		insurance_rate_setting: InsuranceRateSetting,
		full_attendance_bonus: number,
	): Promise<number> {
		// UPDATE 薪資查詢 SET 薪資查詢.請假扣款 = GetLeaveMoney(薪資查詢!工作類別,薪資查詢!工作形態,薪資查詢!應發底薪,薪資查詢!補助津貼+薪資查詢!輪班津貼+薪資查詢!全勤獎金+薪資查詢!專業証照津貼,薪資查詢!事假時數,薪資查詢!病假時數)
		// 薪資查詢.不休假代金 = IIf(薪資查詢!工作類別="外籍勞工",round(GetSALARY_RATE()*(薪資查詢!不休假時數*Getnon_leaving_rate()+薪資查詢!不休假補休1時數*Getnon_leaving_rate1()+薪資查詢!不休假補休2時數*Getnon_leaving_rate2()+薪資查詢!不休假補休3時數*Getnon_leaving_rate3()+薪資查詢!不休假補休4時數*Getnon_leaving_rate4()+薪資查詢!不休假補休5時數*Getnon_leaving_rate5()),0),round(薪資查詢!應發底薪/240*(薪資查詢!不休假時數*Getnon_leaving_rate()+薪資查詢!不休假補休1時數*Getnon_leaving_rate1()+薪資查詢!不休假補休2時數*Getnon_leaving_rate2()+薪資查詢!不休假補休3時數*Getnon_leaving_rate3()+薪資查詢!不休假補休4時數*Getnon_leaving_rate4()+薪資查詢!不休假補休5時數*Getnon_leaving_rate5()),0));
		// const kind1 = employee_data.work_type;
		// const kind2 = employee_data.work_status;
		const money = await this.getGrossSalary(employee_payment,payset);
		const shift_allowance = employee_payment.shift_allowance ?? 0;
		let hourly_fee = (money+shift_allowance+full_attendance_bonus) / 240;
		interface HolidaysTypeDict {
			[key: number]: number
		}
		let holidays_type_dict : HolidaysTypeDict = {};
		holidays_type.map((h: HolidaysType) => {
			holidays_type_dict[h.pay_id] = h.multiplier;
			if(h.pay_type === 1) {
				holidays_type_dict[h.pay_id] *= -1;
			}
		})
		let leave_deduction = 0;
		holiday_list.forEach(holiday => {
			leave_deduction +=  (holiday.total_hours ?? 0) * (holidays_type_dict[holiday.pay_order!]!);
		})
		if (employee_data.work_type === "外籍勞工"){
			hourly_fee = insurance_rate_setting.l_i_wage_replacement_rate;
			return Math.round(hourly_fee * leave_deduction);
		}
		else
			return Math.round(hourly_fee * leave_deduction);
		// const bonus = rd("補助津貼") + rd("輪班津貼") + rd("全勤獎金") + rd("專業証照津貼");
		// const t1 = rd("事假時數"); // 事假時數
		// const T2 = rd("病假時數"); // 病假時數

		// const SALARY_RATE = rd("最低工資率");		// 最低工資率
		// if (kind1 === FOREIGN)	return Math.round(SALARY_RATE * t1 + SALARY_RATE / 2 * T2);	
		// if (kind2 === LEAVE_MAN)	return 0;
		// if (kind2 === FOREIGN)	return Math.round(SALARY_RATE * t1 + SALARY_RATE / 2 * T2);
		// return Math.round((money + bonus) / 240 * t1 + (money + bonus) / 240 * T2 / 2);
	}
	
	//MARK: 全勤獎金
	async getFullAttendanceBonus(period_id: number,emp_no: string): Promise<number> {
		const ehrService = container.resolve(EHRService);
		const bonusList = await ehrService.getBonusByEmpNoList(period_id,[emp_no]);
		const full_attendance_bonus_id = (await ehrService.getBonusType()).find((bt) => bt.name === "全勤獎金")?.id!;
		let full_attendance_bonus = 0;
		for (const bonus of bonusList){
			if (bonus.bonus_id === full_attendance_bonus_id){
				full_attendance_bonus += bonus.amount ?? 0;
			}
		}
		return full_attendance_bonus;
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

	//MARK: 薪資所得扣繳總額
	async getSalaryIncomeDeduction(): Promise<number> {
		/* 
			rd("薪資所得扣繳總額") = 
				rd("底薪") + 
				rd("主管津貼") + 
				rd("專業証照津貼") + 
				rd("職務津貼") + 
				rd("營運積效獎金") + 
				rd("補發薪資") +
				rd("超時加班") +
				rd("其他加項稅") +
				rd("全勤獎金") +
				rd("輪班津貼") +
				rd("夜點費") -
				rd("請假扣款") -
				rd("特別事假扣款") -
				rd("其他減項稅") //expense expense class
		*/
		const salary_income_deduction = 0
		return salary_income_deduction
	}

	//MARK: 薪資所得稅
	async getSalaryIncomeTax(
		employee_data : EmployeeData,
		issue_date : Date,
	): Promise<number> {
		/*
					rd("薪資所得稅") = FindTex(
						rd("薪資所得扣繳總額"),
						rd("扶養人數"), 
						rd("工作類別"), 
						rd("工作形態"), 
						rd("入境日期"), 
						rd("工作天數")
					)
		*/
		const Tax = rd("薪資所得扣繳總額");
		const Num = employee_data.dependents;
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		/*
		const Entity = rd("入境日期");
		const Day = rd("工作天數");			// no use in prev salary system code
		*/
		const taxi = [rd("扣繳稅額")];		// Maybe a list

		const START_WORK_DAY = new Date(employee_data.registration_date);
		const PAY_DATE = issue_date;

		const differenceInMilliseconds = START_WORK_DAY.getTime() - PAY_DATE.getTime();
		const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

		// Jerry 07/01/31 主要區別外籍勞工 同時也是當月離職人員的算法會與間接人員計計算邏輯衝突,因此以工作類別區分外籍勞工
		if (kind1 === FOREIGN)	{	
			// Jerry 07/09/21  15840 ==> 17280   09/4/28 17280 ==> 25920
			if (differenceInDays > 183) return Math.round(Tax * 0.06);
			else {
				if (Tax < 25920)		return Math.round(Tax * 0.06);
				else 					return Math.round(Tax * 0.2);
			}
		}

		if (kind2 === LEAVE_MAN)	return 0;
		if (kind2 === FOREIGN)	{
			if (differenceInDays > 183) return Math.round(Tax * 0.06);
			else {
				if (Tax < 25920)		return Math.round(Tax * 0.06);
				else 					return Math.round(Tax * 0.2);
			}
		}

		if (Tax > 0) {	
			taxi.map((item: any) => {
				if (Tax >= item.薪資1 && Tax <= item.薪資2 && Num == item.扶養親屬) {
					if (kind2 === NEWBIE || kind2 === WILL_LEAVE)
						return Math.round(item.扣繳稅額);
					else
						return item.扣繳稅額;
				}
			})
		}

		return Math.round(Tax * 0.06);

	}
	//MARK: 獎金所得稅
	async getBonusTax(): Promise<number> {
		const bonus_tax = 0;
		return bonus_tax;
	}
	//MARK: 不休假代金
	async getUnpaidLeaveDeduction(): Promise<number> {
		const unpaid_leave_deduction = 0
		return unpaid_leave_deduction
	}

	//MARK: 課稅小計
	async getTaxSummary(
		pay_type: PayTypeEnumType,
	): Promise<number> {
		if (pay_type === PayTypeEnum.Enum.month_salary) {
			/*
					rd("課稅小計") = 
						rd("底薪") + 
						rd("主管津貼") + 
						rd("專業証照津貼") + 
						rd("職務津貼") + 
						rd("營運積效獎金") + 
						rd("補發薪資") + 
						rd("超時加班") + 
						rd("其他加項稅") + 
						rd("全勤獎金") + 
						rd("輪班津貼") + 
						rd("夜點費") + 
						rd("績效獎金") + 
						rd("專案獎金")
			*/
			return rd("底薪") + 
					rd("主管津貼") + 
					rd("專業証照津貼") + 
					rd("職務津貼") + 
					rd("營運積效獎金") + 
					rd("補發薪資") + 
					rd("超時加班") + 
					rd("其他加項稅") + 
					rd("全勤獎金") + 
					rd("輪班津貼") + 
					rd("夜點費") + 
					rd("績效獎金") + 
					rd("專案獎金");
		}
		if (pay_type === rd("加班費")) {
			// rd("課稅小計") = rd("超時加班") + rd("營運積效獎金") + rd("專案獎金") + rd("其他加項稅") 'hm 20201023
			return rd("超時加班") + rd("營運積效獎金") + rd("專案獎金") + rd("其他加項稅");
		}

		if (pay_type === rd("不休假代金"))	return 0;

		if (pay_type === rd("端午獎金") || pay_type === rd("中秋獎金") || pay_type === rd("年終獎金") || pay_type === rd("營運考核獎金") || pay_type === rd("專案考核獎金") || pay_type === rd("董監事酬勞"))	return rd("年終獎金") + rd("績效獎金") + rd("營運積效獎金") + rd("專案獎金");   // '2014/7/24 增加營運積效獎金
	
		

		return 0;
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
	async getGroupInsurancePay(
		employee_data: EmployeeData,
	): Promise<number> {
		/*
			rd("團保費") = ComInsurance(
				CheckNull(rd("團保類別"), X),
				rd("工作類別"),
				rd("工作形態")
			)    'Jerry 07/01/04 計算公司付團保
		*/
		const level = employee_data.group_insurance_type;
		const kind1 = employee_data.work_type;
		const kind2  = employee_data.work_status;

		if (kind1 === FOREIGN) {
			if (level === "F")	return 47;
		}
		else {
			if (level === "A")	return 341;
			if (level === "C+")	return 711;
		}

		throw new Error("No Implement");
	}
	//MARK: 所得稅代扣
	//MARK: 勞退金自提		
	//MARK: 薪資區隔
	//MARK: 薪資總額
	
	//MARK: 勞退金提撥
	async getLaborRetirementContribution(
		employee_data: EmployeeData,
	): Promise<number> {
		/*
			rd("勞退金提撥") = ComRetire(
				rd("勞退"), 
				rd("工作類別"), 
				rd("工作形態"), 
				CheckNull(rd("工作天數"), 30), 
				CheckNull(rd("勞保天數"), 30)
			) 'Jerry 07/07/24 加勞保天數計算
		*/
		const money = rd("勞退");
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		const Normalday = rd("工作天數");
		const PartTimeDay = rd("勞保天數");

		if (kind1 === FOREIGN) return 0;
		if (kind2 === BOSS) return 0;
		if (kind2 === LEAVE_MAN)	return 0;
		if (kind2 === PROFESSOR)	return 0;
		if (kind2 === FOREIGN)	return 0;

		if ([NEWBIE, WILL_LEAVE, PARTTIME1, PARTTIME2, CONTRACT, DAY_PAY].includes(kind2)) {
			return Math.round(Math.round(money * PartTimeDay / 30 * 0.06));  // Jerry 07/07/24 由工作天數改為加勞保天數計算
		}

		return Math.round(Math.round(money * 0.06));
	}
	//MARK: 二代健保
	async urdaizienbow(): Promise<number> {
	/*
	rd("二代健保") = 0
        
        If PayType = DS_Pay Then ' 董監事 2014/7/24
        
            If rd("營運積效獎金") + rd("專案獎金") > nhi_2nd_per Then  'hm20160128
                rd("二代健保") = (rd("營運積效獎金") + rd("專案獎金")) * nhi_2nd_rate 'hm20160128
                rd.Update
                rd.edit
            End If
        
        Else
        
             '計算二代健保補充保費 '2014/04/16
            If rd("年終獎金") > 0 Or rd("年終積效獎金") > 0 Or rd("營運積效獎金") > 0 Or rd("績效獎金") > 0 Or rd("專案獎金") > 0 Or rd("公司獎勵金") > 0 Or rd("特別獎勵金_公司") > 0 Then
                '本次獎金
                bonus = rd("年終獎金") + rd("年終積效獎金") + rd("營運積效獎金") + rd("績效獎金") + rd("專案獎金") + rd("公司獎勵金") + rd("特別獎勵金_公司")
                'MsgBox bonus
                
                Set kkk = CurrentDb.OpenRecordset("select 發薪日期 from 系統預設值")
                
                Do Until kkk.EOF
                    current_year = Year(kkk("發薪日期"))
                    kkk.MoveNext
                Loop
                    
    
                Set re2 = CurrentDb.OpenRecordset("select *  from 累計獎金金額 " & "where 員工編號 = '" & rd("員工編號") & "' and 年度 =" & current_year)
                total_bonus = 0
                Do Until re2.EOF
                    total_bonus = re2("累計金額")
                    re2.MoveNext
                Loop
    
                total_bonus = total_bonus + bonus
                over_amt = total_bonus - rd("健保") * nhi_2nd_mitiple 'hm20160128
    
                If over_amt > 0 Then
                'over_amt & bonus 二者取小的*2% =補充保除費
                    If over_amt < bonus Then
                        rd("二代健保") = over_amt * nhi_2nd_rate 'hm20160128
                    Else
                        rd("二代健保") = bonus * nhi_2nd_rate 'hm20160128
                   End If
                   'MsgBox rd("二代健保")
                    rd.Update
                    rd.edit
                End If
    
            End If
            '2014/04/16
        End If
	 */
		return 0;	
	}
	
	//MARK: 員工信托提存金
	//MARK: 特別信託獎勵金＿員工
	//MARK: 公司獎勵金

	//MARK: 特別信託獎勵金＿公司
	//MARK: 團保費代扣＿升等
	// 感覺在這裡: DoCmd.OpenQuery "其他更新", acNormal, acEdit    'Jerry 07/09/03  增加退職所得  23/6/3 增加團保費代扣_升等
	

	//MARK: 特別事假扣款
	def getSpecialLeavePay(employee_data: EmployeeData): number {
		let work_type = employee_data.work_type;
		let work_status = employee_data.work_status;
		let 
	// GetLeave2Money(kind1 As String, kind2 As String, money As Long, bouns As Long, t1 As Single)
    // If kind1 = Foreign_Man Then
    //    GetLeave2Money = Round(SALARY_RATE * t1, 0)
    // Else
    // Select Case kind2
    //     Case Leave_Man
    //         GetLeave2Money = 0
    //     Case Foreign
    //         GetLeave2Money = Round(SALARY_RATE * t1, 0)
    //     Case Else
    //         GetLeave2Money = Round((money + bouns) / 240 * t1, 0)
    // End Select
    // End If
	薪資查詢.特別事假扣款 = GetLeave2Money(薪資查詢!工作類別,薪資查詢!工作形態,薪資查詢!原應發底薪,薪資查詢!補助津貼+薪資查詢!專業証照津貼,薪資查詢!特別事假時數);


	//MARK: 實發金額
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
}
