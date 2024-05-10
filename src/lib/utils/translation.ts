export function Translate(word: string) {
	// var language = (localStorage) ? localStorage.getItem("language"): "zh";
	// if (!language) localStorage.setItem("language", "zh");
	// console.log(language);

	const language = "zh";

	if (language === "zh") {
		if (word === "id") return "資料編號";
		if (word === "update_by") return "更新者";
		if (word === "create_by") return "建立者";
		if (word === "multiplier") return "倍率";
		if (word === "update_date") return "更新時間";
		if (word === "create_date") return "建立時間";
		if (word === "performance_level") return "績效等級";
		if (word === "position_level") return "職等"; //number
		if (word === "position_type") return "職級"; //string
		if (word === "org_trust_reserve_limit") return "公司信託提存金";
		if (word === "emp_trust_reserve_limit") return "員工信託提存金";
		if (word === "org_special_trust_incent_limit")
			return "特別信託獎勵金公司";
		if (word === "emp_special_trust_incent_limit")
			return "特別信託獎勵金員工";
		if (word === "end_date") return "截止時間";
		if (word === "start_date") return "開始時間";
		if (word === "sick_leave_dock") return "病假扣薪";
		if (word === "personal_leave_dock") return "事假扣薪";
		if (word === "rate_of_unpaid_leave") return "不休假代金比率";
		if (word === "local_worker_holiday") return "本勞假日";
		if (word === "foreign_worker_holiday") return "外勞假日";
		if (word === "overtime_by_local_workers_3") return "本勞加班3";
		if (word === "overtime_by_local_workers_2") return "本勞加班2";
		if (word === "unpaid_leave_compensatory_5") return "不休假-補休5";
		if (word === "unpaid_leave_compensatory_3") return "不休假-補休3";
		if (word === "unpaid_leave_compensatory_2") return "不休假-補休2";
		if (word === "unpaid_leave_compensatory_1") return "不休假-補休1";
		if (word === "overtime_by_local_workers_1") return "本勞加班1";
		if (word === "unpaid_leave_compensatory_4") return "不休假-補休4";
		if (word === "overtime_by_foreign_workers_1") return "外勞加班1";
		if (word === "overtime_by_foreign_workers_2") return "外勞加班2";
		if (word === "overtime_by_foreign_workers_3") return "外勞加班3";
		if (word === "salt") return "鹽";
		if (word === "emp_no") return "員工編號";
		if (word === "password") return "密碼";
		if (word === "auth_l") return "權限等級";
		if (word === "org_name") return "公司名稱";
		if (word === "org_code") return "公司編號";
		if (word === "bank_name") return "銀行名稱";
		if (word === "bank_code") return "銀行代碼";
		if (word === "issue_date") return "發薪日期";
		if (word === "anouncement") return "公告訊息";
		if (word === "department") return "部門";
		if (word === "seniority") return "年資";
		if (word === "type") return "類別";
		if (word === "base_on") return "獎金計算依據";
		if (word === "criterion_date") return "獎金(發放)基準日";
		if (word === "fixed_multiplier") return "固定比率";
		if (word === "ratio") return "比例";
		if (word === "bank_account") return "銀行帳號";
		if (word === "email") return "E-Mail";
		if (word === "gender") return "性別";
		if (word === "emp_name") return "姓名";
		if (word === "has_esot") return "持股信託";
		if (word === "birthdate") return "生日";
		if (word === "work_type") return "工作類別";
		if (word === "hire_date") return "到職日期";
		if (word === "entry_date") return "入境日期";
		if (word === "postal_code") return "通訊郵遞區號";
		if (word === "nationality") return "國籍別";
		if (word === "work_status") return "工作型態";
		if (word === "english_name") return "英文性名";
		if (word === "departure_date") return "離職日期";
		if (word === "bank_full_name") return "受款銀行全稱";
		if (word === "securities_code") return "券商代碼";
		if (word === "indigenous_name") return "原住民姓名";
		if (word === "identity_number") return "身分證字號";
		if (word === "mailing_address") return "通訊地址";
		if (word === "old_age_benifit") return "已領老年給付";
		if (word === "dependents") return "扶養人數";
		if (word === "branch_full_name") return "分行全稱";
		if (word === "accessible") return "殘障等級";
		if (word === "tax_rate_category") return "稅率別";
		if (word === "bonus_calculation") return "計算獎金";
		if (word === "securities_account") return "證券帳號";
		if (word === "registered_address") return "戶籍地址";
		if (word === "healthcare_dependents") return "健保眷口數";
		if (word === "group_insurance_type") return "團保類別";
		if (word === "tax_identification_code") return "稅務識別碼";
		if (word === "probationary_period_over") return "試用期滿";
		if (word === "labor_retirement_self_ratio") return "勞退自提比例";
		if (word === "h_i") return "健保";
		if (word === "l_i") return "勞保";
		if (word === "job_allowance") return "職務津貼";
		if(word === "food_allowance") return "伙食津貼";
		if (word === "base_salary") return "底薪";
		if (word === "shift_allowance") return "輪班津貼";
		if (word === "subsidy_allowance") return "補助津貼";
		if (word === "supervisor_allowance") return "主管津貼";
		if (word === "labor_retirement") return "勞退";
		if (word === "emp_trust_reserve") return "員工信託提存金";
		if (word === "org_trust_reserve") return "公司信託提存金";
		if (word === "occupational_injury") return "職災";
		if (word === "labor_retirement_self") return "勞退金自提";
		if (word === "professional_cert_bonus") return "專業證照津貼";
		if (word === "emp_special_trust_incent") return "特別信託獎勵金員工";
		if (word === "org_special_trust_incent") return "特別信託獎勵金公司";
		if (word === "min_wage_rate") return "最低薪資率";
		if (word === "h_i_standard_rate") return "健保一般費率";
		if (word === "l_i_accident_rate") return "勞保事故費率";
		if (word === "v2_h_i_dock_tsx_thres") return "二代健保扣繳門檻單次";
		if (word === "v2_h_i_supp_premium_rate") return "二代健保補充保費率";
		if (word === "h_i_avg_dependents_count") return "健保平均眷口數";
		if (word === "l_i_wage_replacement_rate")
			return "勞保工資墊償基金提繳率";
		if (word === "l_i_employment_premium_rate") return "勞保就業保險費率";
		if (word === "l_i_occupational_hazard_rate") return "勞保職業災害費率";
		if (word === "level") return "級距";
		if (word === "level_end") return "迄";
		if (word === "level_start") return "起";

		// button
		if (word === "next_step") return "下一步";
		if (word === "previous_step") return "上一步";
		if (word === "previous_page") return "回上頁";
		if (word === "create") return "建立";
		if (word === "update") return "更新";
		if (word === "modify") return "修改";
		if (word === "delete") return "刪除";
		if (word === "confirm") return "確認";
		if (word === "auto calculate") return "自動計算";
		if (word === "form") return "表單";

		// tables
		if (word === "attendanceSetting") return "請假加班";
		if (word === "bankSetting") return "銀行";
		if (word === "insuranceRateSetting") return "勞健保費率";
		if (word === "bonusSetting") return "獎金";
		if (word === "bonusDepartmentSetting") return "獎金部門";
		if (word === "bonusPositionSetting") return "獎金職等";
		if (word === "bonusPositionTypeSetting") return "獎金職級";
		if (word === "bonusSenioritySetting") return "獎金年資";
		if (word === "levelRange") return "級距類別範圍";
		if (word === "performanceLevel") return "績效等級比例";
		if (word === "trustMoney") return "信託金";
		if (word === "basicInfo") return "基本資訊";
	}

	if (language === "en") {
		if (word === "id") return "Data ID";
		if (word === "update_by") return "Updated By";
		if (word === "create_by") return "Created By";
		if (word === "multiplier") return "Multiplier";
		if (word === "update_date") return "Update Date";
		if (word === "create_date") return "Create Date";
		if (word === "performance_level") return "Performance Level";
		if (word === "position_level") return "position_level"; //number
		if (word === "position_type") return "Position Type"; //string
		if (word === "org_trust_reserve_limit")
			return "Company Trust Reserve Limit";
		if (word === "emp_trust_reserve_limit")
			return "Employee Trust Reserve Limit";
		if (word === "org_special_trust_incent_limit")
			return "Special Trust Incentive Limit (Company)";
		if (word === "emp_special_trust_incent_limit")
			return "Special Trust Incentive Limit (Employee)";
		if (word === "end_date") return "End Date";
		if (word === "start_date") return "Start Date";
		if (word === "sick_leave_dock") return "Sick Leave Deduction";
		if (word === "personal_leave_dock") return "Personal Leave Deduction";
		if (word === "rate_of_unpaid_leave")
			return "Unpaid Leave Compensation Rate";
		if (word === "local_worker_holiday") return "Local Worker Holiday";
		if (word === "foreign_worker_holiday") return "Foreign Worker Holiday";
		if (word === "overtime_by_local_workers_3")
			return "Overtime by Local Workers 3";
		if (word === "overtime_by_local_workers_2")
			return "Overtime by Local Workers 2";
		if (word === "unpaid_leave_compensatory_5")
			return "Unpaid Leave Compensatory 5";
		if (word === "unpaid_leave_compensatory_3")
			return "Unpaid Leave Compensatory 3";
		if (word === "unpaid_leave_compensatory_2")
			return "Unpaid Leave Compensatory 2";
		if (word === "unpaid_leave_compensatory_1")
			return "Unpaid Leave Compensatory 1";
		if (word === "overtime_by_local_workers_1")
			return "Overtime by Local Workers 1";
		if (word === "unpaid_leave_compensatory_4")
			return "Unpaid Leave Compensatory 4";
		if (word === "overtime_by_foreign_workers_1")
			return "Overtime by Foreign Workers 1";
		if (word === "overtime_by_foreign_workers_2")
			return "Overtime by Foreign Workers 2";
		if (word === "overtime_by_foreign_workers_3")
			return "Overtime by Foreign Workers 3";
		if (word === "salt") return "Salt";
		if (word === "emp_no") return "Employee ID";
		if (word === "password") return "Password";
		if (word === "auth_l") return "Authorization Level";
		if (word === "org_name") return "Company Name";
		if (word === "org_code") return "Company Code";
		if (word === "bank_name") return "Bank Name";
		if (word === "bank_code") return "Bank Code";
		if (word === "issue_date") return "Payday";
		if (word === "announcement") return "Announcement";
		if (word === "department") return "Department";
		if (word === "seniority") return "Seniority";
		if (word === "type") return "Type";
		if (word === "base_on") return "Bonus Calculation Basis";
		if (word === "criterion_date")
			return "Bonus (Distribution) Criterion Date";
		if (word === "fixed_multiplier") return "Fixed Ratio";
		if (word === "ratio") return "Ratio";
		if (word === "bank_account") return "Bank Account";
		if (word === "email") return "E-Mail";
		if (word === "gender") return "Gender";
		if (word === "emp_name") return "Name";
		if (word === "has_esot") return "Equity Trust";
		if (word === "birthdate") return "Birthdate";
		if (word === "work_type") return "Work Type";
		if (word === "hire_date") return "Hire Date";
		if (word === "entry_date") return "Entry Date";
		if (word === "postal_code") return "Postal Code";
		if (word === "nationality") return "Nationality";
		if (word === "work_status") return "Work Status";
		if (word === "english_name") return "English Name";
		if (word === "departure_date") return "Departure Date";
		if (word === "bank_full_name") return "Full Name of Receiving Bank";
		if (word === "securities_code") return "Securities Code";
		if (word === "indigenous_name") return "Indigenous Name";
		if (word === "identity_number") return "Identity Number";
		if (word === "mailing_address") return "Mailing Address";
		if (word === "old_age_benefit") return "Received Old Age Benefit";
		if (word === "dependents_count") return "Number of Dependents";
		if (word === "branch_full_name") return "Full Name of Branch";
		if (word === "accessible") return "Disability Level";
		if (word === "tax_rate_category") return "Tax Rate Category";
		if (word === "bonus_calculation") return "Bonus Calculation";
		if (word === "securities_account") return "Securities Account";
		if (word === "registered_address") return "Registered Address";
		if (word === "h_i_dependents_count")
			return "Health Insurance Dependents Count";
		if (word === "group_insurance_type") return "Group Insurance Type";
		if (word === "tax_identification_code")
			return "Tax Identification Code";
		if (word === "probationary_period_over")
			return "Probationary Period Over";
		if (word === "labor_retirement_self_ratio")
			return "Labor Retirement Self Ratio";
		if (word === "h_i") return "Health Insurance";
		if (word === "l_i") return "Labor Insurance";
		if (word === "job_bonus") return "Job Allowance";
		if (word === "base_salary") return "Base Salary";
		if (word === "shift_bonus") return "Shift Allowance";
		if (word === "subsidy_bonus") return "Subsidy Allowance";
		if (word === "supervisor_bonus") return "Supervisor Allowance";
		if (word === "labor_retirement") return "Labor Retirement";
		if (word === "emp_trust_reserve") return "Employee Trust Reserve";
		if (word === "org_trust_reserve") return "Company Trust Reserve";
		if (word === "occupational_injury") return "Occupational Injury";
		if (word === "labor_retirement_self") return "Labor Retirement Self";
		if (word === "professional_cert_bonus")
			return "Professional Certification Allowance";
		if (word === "emp_special_trust_incent")
			return "Employee Special Trust Incentive";
		if (word === "org_special_trust_incent")
			return "Company Special Trust Incentive";
		if (word === "min_wage_rate") return "Minimum Wage Rate";
		if (word === "h_i_standard_rate")
			return "Health Insurance Standard Rate";
		if (word === "l_i_accident_rate")
			return "Labor Insurance Accident Rate";
		if (word === "v2_h_i_dock_tsx_thres")
			return "V2 Health Insurance Dock Threshold (Single)";
		if (word === "v2_h_i_supp_premium_rate")
			return "V2 Health Insurance Supplementary Premium Rate";
		if (word === "h_i_avg_dependents_count")
			return "Health Insurance Average Dependents Count";
		if (word === "l_i_wage_replacement_rate")
			return "Labor Insurance Wage Replacement Fund Payment Rate";
		if (word === "l_i_employment_premium_rate")
			return "Labor Insurance Employment Insurance Premium Rate";
		if (word === "l_i_occupational_hazard_rate")
			return "Labor Insurance Occupational Hazard Insurance Rate";
		if (word === "level") return "Level";
		if (word === "level_end") return "End";
		if (word === "level_start") return "Start";

		// button
		if (word === "next_step") return "Next Step";
		if (word === "previous_step") return "Previous Step";
		if (word === "previous_page") return "Previous Page";
		if (word === "create") return "Create";
		if (word === "update") return "Update";
		if (word === "modify") return "Modify";
		if (word === "delete") return "Delete";
		if (word === "auto calculate") return "Auto Calculate";
		if (word === "form") return "Form";
	}

	return "Waiting";
}
