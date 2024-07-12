import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

export class Transaction extends Model<
	InferAttributes<Transaction>,
	InferCreationAttributes<Transaction>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
	declare issue_date: string; // 發新日期
	declare pay_type: string; // 發薪別
	declare department: string; // 部門
	declare emp_no: string; // 員工編號
	declare work_status: string; // 工作形態
	declare position: number; // 職等
	declare dependents: number | null; // 扶養人數
	declare healthcare_dependents: number | null; // 健保眷口數

	// 勞工相關信息
	declare l_i: number; // 勞保
	declare h_i: number; // 健保
	declare l_r: number; // 勞退
	declare occupational_injury: number; // 職災
	declare base_salary: number; // 底薪
	declare food_allowance: number | null; // 伙食津貼
	declare occupational_allowance: number | null; // 職務津貼
	declare supervisor_allowance: number | null; // 主管津貼
	declare professional_cert_allowance: number | null; // 專業証照津貼
	declare shift_allowance: number | null; // 輪班津貼
	declare subsidy_allowance: number | null; // 補助津貼
	declare gross_salary: number; // 應發底薪
	declare l_i_deduction: number; // 勞保扣除額
	declare h_i_deduction: number; // 健保扣除額
	declare welfare_contribution: number; // 福利金提撥
	declare weekday_overtime_pay: number; // 平日加班費
	declare holiday_overtime_pay: number; // 假日加班費
	declare leave_deduction: number; // 請假扣款
	declare exceed_overtime_pay: number; // 超時加班
	declare full_attendance_bonus: number; // 全勤獎金
	declare group_insurance_deduction: number; // 團保費代扣
	// declare retroactive_salary: number; // 補發薪資
	declare other_addition: number; // 其他加項
	declare other_deduction: number; // 其他減項
	declare meal_deduction: number; // 伙食扣款
	declare taxable_income: number; // 課稅所得
	declare income_tax: number; // 薪資所得稅
	declare bonus_tax: number; // 獎金所得稅
	// declare non_leave: string; // 不休假
	// declare non_leave_hours: number; // 不休假時數
	declare non_leave_compensation: number; // 不休假代金
	declare total_income_tax: number; // 薪資所得扣繳總額
	declare taxable_subtotal: number; // 課稅小計
	declare non_taxable_subtotal: number; // 非課說小計
	declare deduction_subtotal: number; // 減項小計
	declare salary_advance: number; // 工資墊償
	declare l_i_pay: number; // 勞保費
	declare h_i_pay: number; // 健保費
	declare group_insurance_pay: number; // 團保費
	declare net_salary: number; // 實發金額
	// declare additional_l_i: number; // 勞保追加
	// declare additional_h_i: number; // 健保追加
	declare other_addition_tax: number; // 其他加項稅
	declare other_deduction_tax: number; // 其他減項稅
	declare income_tax_withheld: number; // 所得稅代扣
	declare l_r_self: number; // 勞退金自提
	declare parking_fee: number; // 停車費
	declare brokerage_fee: number; // 仲介費
	declare salary_range: string; // 薪資區隔
	declare total_salary: number; // 薪資總額
	declare dragon_boat_festival_bonus: number; // 端午獎金
	declare mid_autumn_festival_bonus: number; // 中秋獎金
	declare note: string; // 備註
	declare bank_account_1: string; // 帳號1
	declare bank_account_2: string; // 帳號2
	declare foreign_currency_account: string; // 外幣帳號
	declare bonus_ratio: number; // 獎金比率
	declare annual_days_in_service: number; // 年度在職天數
	declare l_r_contribution: number; // 勞退金提撥
	declare old_system_l_r_contribution: number; // 勞退金提撥_舊制
	declare seniority: number; // 年資
	declare assessment_rate: number; // 考核比率
	declare assessment_bonus: number; // 考核獎金
	declare probation_period_over: boolean; // 試用期滿
	declare disabilty_level: string | null; // 殘障等級
	declare retirement_income: number; // 退職所得
	declare received_elderly_benefits: boolean; // 已領老年給付
	declare v_2_h_i: string; // 二代健保
	declare has_trust: boolean; // 持股信託_YN
	declare emp_trust_reserve: number; // 員工信託提存金
	declare emp_special_trust_incent: number; // 特別信託獎勵金_員工
	declare org_trust_reserve: number; // 公司獎勵金
	declare org_special_trust_incent: number; // 特別信託獎勵金_公司
	declare group_insurance_deduction_promotion: number; // 團保費代扣_升等
	declare special_leave_deduction: number; // 特別事假扣款
	declare special_leave: number; // 特別事假
	declare full_attendance_personal_leave: number; // 有全勤事假
	declare full_attendance_sick_leave: number; // 有全勤病假
	declare create_date: CreationOptional<Date>; // 建立日期
	declare create_by: string; // 建立者
	declare update_date: CreationOptional<Date>; // 更新日期
	declare update_by: string; // 更新者
}

const sequelize = container.resolve(Database).connection;

Transaction.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		period_id: {
			type: DataTypes.STRING(128),
			comment: "期間",
		},
		issue_date: {
			type: DataTypes.STRING(128),
			comment: "發新日期",
		},
		pay_type: {
			type: DataTypes.STRING(128),
			comment: "發薪別",
		},
		department: {
			type: DataTypes.STRING(128),
			comment: "部門",
		},
		emp_no: {
			type: DataTypes.STRING(128),
			comment: "員工編號",
		},
		work_status: {
			type: DataTypes.STRING(128),
			comment: "工作形態",
		},
		position: {
			type: DataTypes.INTEGER,
			comment: "職等",
		},
		dependents: {
			type: DataTypes.INTEGER,
			comment: "扶養人數",
		},
		healthcare_dependents: {
			type: DataTypes.INTEGER,
			comment: "健保眷口數",
		},
		l_i: {
			type: DataTypes.STRING(128),
			comment: "勞保",
		},
		h_i: {
			type: DataTypes.STRING(128),
			comment: "健保",
		},
		l_r: {
			type: DataTypes.STRING(128),
			comment: "勞退",
		},
		occupational_injury: {
			type: DataTypes.STRING(128),
			comment: "職災",
		},
		supervisor_allowance: {
			type: DataTypes.INTEGER,
			comment: "主管津貼",
		},
		professional_cert_allowance: {
			type: DataTypes.INTEGER,
			comment: "專業証照津貼",
		},
		base_salary: {
			type: DataTypes.INTEGER,
			comment: "底薪",
		},
		food_allowance: {
			type: DataTypes.INTEGER,
			comment: "伙食津貼",
		},
		gross_salary: {
			type: DataTypes.INTEGER,
			comment: "應發底薪",
		},
		l_i_deduction: {
			type: DataTypes.INTEGER,
			comment: "勞保扣除額",
		},
		h_i_deduction: {
			type: DataTypes.INTEGER,
			comment: "健保扣除額",
		},
		welfare_contribution: {
			type: DataTypes.INTEGER,
			comment: "福利金提撥",
		},
		subsidy_allowance: {
			type: DataTypes.INTEGER,
			comment: "補助津貼",
		},
		weekday_overtime_pay: {
			type: DataTypes.INTEGER,
			comment: "平日加班費",
		},
		holiday_overtime_pay: {
			type: DataTypes.INTEGER,
			comment: "假日加班費",
		},
		leave_deduction: {
			type: DataTypes.INTEGER,
			comment: "請假扣款",
		},
		exceed_overtime_pay: {
			type: DataTypes.INTEGER,
			comment: "超時加班",
		},
		full_attendance_bonus: {
			type: DataTypes.INTEGER,
			comment: "全勤獎金",
		},
		group_insurance_deduction: {
			type: DataTypes.INTEGER,
			comment: "團保費代扣",
		},
		// retroactive_salary: {
		// 	type: DataTypes.INTEGER,
		// 	comment: "補發薪資",
		// },
		other_deduction: {
			type: DataTypes.INTEGER,
			comment: "其他減項",
		},
		other_addition: {
			type: DataTypes.INTEGER,
			comment: "其他加項",
		},
		meal_deduction: {
			type: DataTypes.INTEGER,
			comment: "伙食扣款",
		},
		taxable_income: {
			type: DataTypes.INTEGER,
			comment: "課稅所得",
		},
		income_tax: {
			type: DataTypes.INTEGER,
			comment: "薪資所得稅",
		},
		bonus_tax: {
			type: DataTypes.INTEGER,
			comment: "獎金所得稅",
		},
		occupational_allowance: {
			type: DataTypes.INTEGER,
			comment: "職務津貼",
		},
		shift_allowance: {
			type: DataTypes.INTEGER,
			comment: "輪班津貼",
		},
		// non_leave: {
		// 	type: DataTypes.STRING(128),
		// 	comment: "不休假",
		// },
		// non_leave_hours: {
		// 	type: DataTypes.INTEGER,
		// 	comment: "不休假時數",
		// },
		non_leave_compensation: {
			type: DataTypes.INTEGER,
			comment: "不休假代金",
		},
		total_income_tax: {
			type: DataTypes.INTEGER,
			comment: "薪資所得扣繳總額",
		},
		taxable_subtotal: {
			type: DataTypes.INTEGER,
			comment: "課稅小計",
		},
		non_taxable_subtotal: {
			type: DataTypes.INTEGER,
			comment: "非課說小計",
		},
		deduction_subtotal: {
			type: DataTypes.INTEGER,
			comment: "減項小計",
		},
		l_i_pay: {
			type: DataTypes.INTEGER,
			comment: "勞保費",
		},
		salary_advance: {
			type: DataTypes.INTEGER,
			comment: "工資墊償",
		},
		h_i_pay: {
			type: DataTypes.INTEGER,
			comment: "健保費",
		},
		group_insurance_pay: {
			type: DataTypes.INTEGER,
			comment: "團保費",
		},
		net_salary: {
			type: DataTypes.INTEGER,
			comment: "實發金額",
		},
		// additional_l_i: {
		// 	type: DataTypes.INTEGER,
		// 	comment: "勞保追加",
		// },
		// additional_h_i: {
		// 	type: DataTypes.INTEGER,
		// 	comment: "健保追加",
		// },
		other_addition_tax: {
			type: DataTypes.INTEGER,
			comment: "其他加項稅",
		},
		other_deduction_tax: {
			type: DataTypes.INTEGER,
			comment: "其他減項稅",
		},
		income_tax_withheld: {
			type: DataTypes.INTEGER,
			comment: "所得稅代扣",
		},
		l_r_self: {
			type: DataTypes.INTEGER,
			comment: "勞退金自提",
		},
		parking_fee: {
			type: DataTypes.INTEGER,
			comment: "停車費",
		},
		brokerage_fee: {
			type: DataTypes.INTEGER,
			comment: "仲介費",
		},
		salary_range: {
			type: DataTypes.STRING(128),
			comment: "薪資區隔",
		},
		total_salary: {
			type: DataTypes.INTEGER,
			comment: "薪資總額",
		},
		dragon_boat_festival_bonus: {
			type: DataTypes.INTEGER,
			comment: "端午獎金",
		},
		mid_autumn_festival_bonus: {
			type: DataTypes.INTEGER,
			comment: "中秋獎金",
		},
		note: {
			type: DataTypes.STRING(128),
			comment: "備註",
		},
		bank_account_1: {
			type: DataTypes.STRING(128),
			comment: "帳號1",
		},
		bank_account_2: {
			type: DataTypes.STRING(128),
			comment: "帳號2",
		},
		foreign_currency_account: {
			type: DataTypes.STRING(128),
			comment: "外幣帳號",
		},
		bonus_ratio: {
			type: DataTypes.INTEGER,
			comment: "獎金比率",
		},
		annual_days_in_service: {
			type: DataTypes.INTEGER,
			comment: "年度在職天數",
		},
		l_r_contribution: {
			type: DataTypes.INTEGER,
			comment: "勞退金提撥",
		},
		old_system_l_r_contribution: {
			type: DataTypes.INTEGER,
			comment: "勞退金提撥_舊制",
		},
		seniority: {
			type: DataTypes.INTEGER,
			comment: "年資",
		},
		assessment_rate: {
			type: DataTypes.INTEGER,
			comment: "考核比率",
		},
		assessment_bonus: {
			type: DataTypes.INTEGER,
			comment: "考核獎金",
		},
		probation_period_over: {
			type: DataTypes.BOOLEAN,
			comment: "試用期滿",
		},
		disabilty_level: {
			type: DataTypes.STRING(128),
			comment: "殘障等級",
		},
		retirement_income: {
			type: DataTypes.INTEGER,
			comment: "退職所得",
		},
		received_elderly_benefits: {
			type: DataTypes.STRING(128),
			comment: "已領老年給付",
		},
		v_2_h_i: {
			type: DataTypes.STRING(128),
			comment: "二代健保",
		},
		has_trust: {
			type: DataTypes.STRING(128),
			comment: "持股信託_YN",
		},
		emp_trust_reserve: {
			type: DataTypes.INTEGER,
			comment: "員工信託提存金",
		},
		emp_special_trust_incent: {
			type: DataTypes.INTEGER,
			comment: "特別信託獎勵金_員工",
		},
		org_trust_reserve: {
			type: DataTypes.INTEGER,
			comment: "公司獎勵金",
		},
		org_special_trust_incent: {
			type: DataTypes.INTEGER,
			comment: "特別信託獎勵金_公司",
		},
		group_insurance_deduction_promotion: {
			type: DataTypes.INTEGER,
			comment: "團保費代扣_升等",
		},
		special_leave_deduction: {
			type: DataTypes.INTEGER,
			comment: "特別事假扣款",
		},
		special_leave: {
			type: DataTypes.INTEGER,
			comment: "特別事假",
		},
		full_attendance_personal_leave: {
			type: DataTypes.INTEGER,
			comment: "有全勤事假",
		},
		full_attendance_sick_leave: {
			type: DataTypes.INTEGER,
			comment: "有全勤病假",
		},
		create_date: {
			type: DataTypes.DATE,
			comment: "建立日期",
		},
		create_by: {
			type: DataTypes.STRING(128),
			allowNull: true,
			comment: "建立者",
		},
		update_date: {
			type: DataTypes.DATE,
			comment: "修改日期",
		},
		update_by: {
			type: DataTypes.STRING(128),
			allowNull: true,
			comment: "修改者",
		},
	},
	{
		sequelize,
		tableName: "U_TRANSACTION",
		createdAt: "create_date",
		updatedAt: "update_date",
	}
);
