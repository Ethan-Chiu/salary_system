export function Translate(word: string) {
	if (word === "id")    return "資料編號"
	if (word === "update_by")    return "更新者"
	if (word === "create_by")    return "建立者"
	if (word === "multiplier")    return "倍率"
	if (word === "update_date")    return "更新時間"
	if (word === "create_date")    return "建立時間"
	if (word === "performance_level")    return "績效等級"
	if (word === "position")    return "職等"	//number
	if (word === "position_type")    return "職級"	//string
	if (word === "org_trust_reserve_limit")    return "公司信託提存金"
	if (word === "emp_trust_reserve_limit")    return "員工信託提存金"
	if (word === "org_special_trust_incent_limit")    return "特別信託獎勵金公司"
	if (word === "emp_special_trust_incent_limit")    return "特別信託獎勵金員工"
	if (word === "end_date")    return "截止時間"
	if (word === "start_date")    return "開始時間"
	if (word === "sick_leave_dock")    return "病假扣薪"
	if (word === "personal_leave_dock")    return "事假扣薪"
	if (word === "rate_of_unpaid_leave")    return "不休假代金比率"
	if (word === "local_worker_holiday")    return "本勞假日"
	if (word === "foreign_worker_holiday")    return "外勞假日"
	if (word === "overtime_by_local_workers_3")    return "本勞加班3"
	if (word === "overtime_by_local_workers_2")    return "本勞加班2"
	if (word === "unpaid_leave_compensatory_5")    return "不休假-補休5"
	if (word === "unpaid_leave_compensatory_3")    return "不休假-補休3"
	if (word === "unpaid_leave_compensatory_2")    return "不休假-補休2"
	if (word === "unpaid_leave_compensatory_1")    return "不休假-補休1"
	if (word === "overtime_by_local_workers_1")    return "本勞加班1"
	if (word === "unpaid_leave_compensatory_4")    return "不休假-補休4"
	if (word === "overtime_by_foreign_workers_1")    return "外勞加班1"
	if (word === "overtime_by_foreign_workers_2")    return "外勞加班2"
	if (word === "overtime_by_foreign_workers_3")    return "外勞加班3"
	if (word === "salt")    return "鹽"
	if (word === "emp_id")    return "員工編號"
	if (word === "password")    return "密碼"
	if (word === "auth_l")    return "權限等級"
	if (word === "org_name")    return "公司名稱"
	if (word === "org_code")    return "公司編號"
	if (word === "bank_name")    return "銀行名稱"
	if (word === "bank_code")    return "銀行代碼"
	if (word === "payday")    return "發薪日期"
	if (word === "anouncement")    return "公告訊息"
	if (word === "department")    return "部門"
	if (word === "seniority")    return "年資"
	if (word === "type")    return "類別"
	if (word === "base_on")    return "獎金計算依據"
	if (word === "criterion_date")    return "獎金(發放)基準日"
	if (word === "fixed_multiplier")    return "固定比率"
	if (word === "ratio")    return "比例"
	if (word === "bank_account")    return "銀行帳號"
	if (word === "email")    return "E-Mail"
	if (word === "gender")    return "性別"
	if (word === "emp_name")    return "姓名"
	if (word === "has_esot")    return "持股信託"
	if (word === "birthdate")    return "生日"
	if (word === "work_type")    return "工作類別"
	if (word === "hire_date")    return "到職日期"
	if (word === "entry_date")    return "入境日期"
	if (word === "postal_code")    return "通訊郵遞區號"
	if (word === "nationality")    return "國籍別"
	if (word === "work_status")    return "工作型態"
	if (word === "english_name")    return "英文性名"
	if (word === "departure_date")    return "離職日期"
	if (word === "bank_full_name")    return "受款銀行全稱"
	if (word === "securities_code")    return "券商代碼"
	if (word === "indigenous_name")    return "原住民姓名"
	if (word === "identity_number")    return "身分證字號"
	if (word === "mailing_address")    return "通訊地址"
	if (word === "old_age_benifit")    return "已領老年給付"
	if (word === "dependents_count")    return "扶養人數"
	if (word === "branch_full_name")    return "分行全稱"
	if (word === "disability_level")    return "殘障等級"
	if (word === "tax_rate_category")    return "稅率別"
	if (word === "bonus_calculation")    return "計算獎金"
	if (word === "securities_account")    return "證券帳號"
	if (word === "registered_address")    return "戶籍地址"
	if (word === "h_i_dependents_count")    return "健保眷口數"
	if (word === "group_insurance_type")    return "團保類別"
	if (word === "tax_identification_code")    return "稅務識別碼"
	if (word === "probationary_period_over")    return "試用期滿"
	if (word === "labor_retirement_self_ratio")    return "勞退自提比例"
	if (word === "h_i")    return "健保"
	if (word === "l_i")    return "勞保"
	if (word === "job_bonus")    return "職務津貼"
	if (word === "base_salary")    return "底薪"
	if (word === "shift_bonus")    return "輪班津貼"
	if (word === "subsidy_bonus")    return "補助津貼"
	if (word === "supervisor_bonus")    return "主管津貼"
	if (word === "labor_retirement")    return "勞退"
	if (word === "emp_trust_reserve")    return "員工信託提存金"
	if (word === "org_trust_reserve")    return "公司信託提存金"
	if (word === "occupational_injury")    return "職災"
	if (word === "labor_retirement_self")    return "勞退金自提"
	if (word === "professional_cert_bonus")    return "專業證照津貼"
	if (word === "emp_special_trust_incent")    return "特別信託獎勵金員工"
	if (word === "org_special_trust_incent")    return "特別信託獎勵金公司"
	if (word === "min_wage_rate")    return "最低薪資率"
	if (word === "h_i_standard_rate")    return "健保一般費率"
	if (word === "l_i_accident_rate")    return "勞保事故費率"
	if (word === "v2_h_i_dock_tsx_thres")    return "二代健保扣繳門檻單次"
	if (word === "v2_h_i_supp_premium_rate")    return "二代健保補充保費率"
	if (word === "h_i_avg_dependents_count")    return "h_i_avg_dependents_count"
	if (word === "l_i_wage_replacement_rate")    return "l_i_wage_replacement_rate"
	if (word === "l_i_employment_premium_rate")    return "l_i_employment_premium_rate"
	if (word === "l_i_occupational_hazard_rate")    return "勞保職業災害費率"
	if (word === "level")    return "級距"
	if (word === "level_end")    return "迄"
	if (word === "level_start")    return "起"
}