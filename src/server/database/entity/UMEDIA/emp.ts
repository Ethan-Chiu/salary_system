import { get_date_string } from "~/server/service/helper_function";

export class Emp {
	// id can be undefined during creation when using `autoIncrement`
	declare change_flag: string;
	declare emp_no: string;
	declare emp_name: string;
	declare position: number;
	declare position_type: string;
	declare group_insurance_type: string;
	declare department: string;
	declare work_type: string;
	declare work_status: string;
	declare disabilty_level: string | null;
	declare sex_type: string;
	declare dependents: number | null;
	declare healthcare_dependents: number | null; //健保眷口數
	declare registration_date: string;
	declare quit_date: string | null;
	declare license_id: string | null;
	declare bank_account: string | null;

	constructor(
		change_flag: string,
		emp_no: string,
		emp_name: string,
		position: number,
		position_type: string,
		group_insurance_type: string,
		department: string,
		work_type: string,
		work_status: string,
		disabilty_level: string | null,
		sex_type: string,
		dependents: number | null,
		healthcare_dependents: number | null,
		registration_date: string,
		quit_date: string | null,
		license_id: string | null,
		bank_account: string | null
	) {
		this.change_flag = change_flag;
		this.emp_no = emp_no;
		this.emp_name = emp_name;
		this.position = position;
		this.position_type = position_type;
		this.group_insurance_type = group_insurance_type;
		this.department = department;
		this.work_type = work_type;
		this.work_status = work_status;
		this.disabilty_level = disabilty_level;
		this.sex_type = sex_type;
		this.dependents = dependents;
		this.healthcare_dependents = healthcare_dependents;
		this.registration_date = registration_date;
		this.quit_date = quit_date;
		this.license_id = license_id;
		this.bank_account = bank_account;
	}

	static fromDB(data: any): Emp {
		const {
			CHANGE_FLAG,
			EMP_NO,
			EMP_NAME,
			POSITION,
			POSITION_TYPE,
			GINSURANCE_TYPE,
			U_DEP,
			WORK_TYPE,
			WORK_STATUS,
			ACCESSIBLE,
			SEX_TYPE,
			DEPENDENTS,
			HEALTHCARE,
			REGISTRATION_DATE,
			QUIT_DATE,
			LICENS_ID,
			NBANKNUMBER,
		} = data;

		// Format the date string from yy-mm-ddThh:mm:ss to yyyy-mm-dd
		const FORMAT_REGISTRATION_DATE =
			get_date_string(REGISTRATION_DATE) ;
		const FORMAT_QUIT_DATE = QUIT_DATE
			? get_date_string(QUIT_DATE)
			: null;

		return new Emp(
			CHANGE_FLAG,
			EMP_NO,
			EMP_NAME,
			POSITION,
			POSITION_TYPE,
			GINSURANCE_TYPE,
			U_DEP,
			WORK_TYPE,
			WORK_STATUS,
			ACCESSIBLE,
			SEX_TYPE,
			DEPENDENTS,
			HEALTHCARE,
			FORMAT_REGISTRATION_DATE,
			FORMAT_QUIT_DATE,
			LICENS_ID,
			NBANKNUMBER
		);
	}
}
