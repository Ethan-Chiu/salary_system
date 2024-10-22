import { z } from "zod";
import {
	WorkTypeEnumType,
	WorkTypeEnum,
} from "~/server/api/types/work_type_enum";
import { zStrTransEnum } from "~/server/api/types/z_utils";
import { get_date_string } from "~/server/service/helper_function";

const dbEmp = z.object({
	CHANGE_FLAG: z.string(),
	EMP_NO: z.string(),
	EMP_NAME: z.string(),
	POSITION: z.number(),
	POSITION_TYPE: z.string(),
	GINSURANCE_TYPE: z.string(),
	U_DEP: z.string(),
	WORK_TYPE: zStrTransEnum(WorkTypeEnum),
	WORK_STATUS: z.string(),
	ACCESSIBLE: z.string().nullable(),
	SEX_TYPE: z.string(),
	DEPENDENTS: z.number().nullable(),
	HEALTHCARE: z.number().nullable(),
	REGISTRATION_DATE: z.date(),
	QUIT_DATE: z.date().nullable(),
	LICENS_ID: z.string(),
	NBANKNUMBER: z.string(),
});

export class Emp {
	// id can be undefined during creation when using `autoIncrement`
	change_flag: string;
	emp_no: string;
	emp_name: string;
	position: number;
	position_type: string;
	group_insurance_type: string;
	department: string;
	work_type: WorkTypeEnumType;
	work_status: string;
	disabilty_level: string | null;
	sex_type: string;
	dependents: number | null;
	healthcare_dependents: number | null; //健保眷口數
	registration_date: string;
	quit_date: string | null;
	license_id: string | null;
	bank_account: string | null;

	constructor(
		change_flag: string,
		emp_no: string,
		emp_name: string,
		position: number,
		position_type: string,
		group_insurance_type: string,
		department: string,
		work_type: WorkTypeEnumType,
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

	static fromDB(db_data: any): Emp {
		const result = dbEmp.safeParse(db_data);

		if (!result.success) {
			throw new Error(result.error.message);
		}

		const data = result.data;

		// Format the date string from yy-mm-ddThh:mm:ss to yyyy-mm-dd
		const FORMAT_REGISTRATION_DATE = get_date_string(
			data.REGISTRATION_DATE
		);
		const FORMAT_QUIT_DATE = data.QUIT_DATE
			? get_date_string(data.QUIT_DATE)
			: null;

		return new Emp(
			data.CHANGE_FLAG,
			data.EMP_NO,
			data.EMP_NAME,
			data.POSITION,
			data.POSITION_TYPE,
			data.GINSURANCE_TYPE,
			data.U_DEP,
			data.WORK_TYPE,
			data.WORK_STATUS,
			data.ACCESSIBLE,
			data.SEX_TYPE,
			data.DEPENDENTS,
			data.HEALTHCARE,
			FORMAT_REGISTRATION_DATE,
			FORMAT_QUIT_DATE,
			data.LICENS_ID,
			data.NBANKNUMBER
		);
	}
}
