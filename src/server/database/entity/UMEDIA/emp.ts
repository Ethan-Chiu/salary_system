export class Emp {
	// id can be undefined during creation when using `autoIncrement`
      declare change_flag: string;
	declare emp_no: string;
	declare emp_name: string;
    declare position: number;
    declare position_type: string;
    declare ginsurance_type: string;
    declare u_dep: string;
    declare work_type: string;
    declare work_status: string;
    declare accessible: string | null;
    declare sex_type: string;
    declare dependents: number | null;
    declare healthcare: number | null;
    declare registration_date: string;
    declare quit_date: string | null;
    declare licens_id: string | null;
    declare nbanknumber: string | null;

	constructor(
        change_flag: string,
        emp_no: string,
        emp_name: string,
        position: number,
        position_type: string,
        ginsurance_type: string,
        u_dep: string,
        work_type: string,
        work_status: string,
        accesible: string | null,
        sex_type: string,
        dependents: number | null,
        healthcare: number | null,
        registration_date: string,
        quit_date: string | null,
        licens_id: string | null,
        nbanknumber: string | null
	) {
        this.change_flag = change_flag;
        this.emp_no = emp_no;
        this.emp_name = emp_name;
        this.position = position;
        this.position_type = position_type;
        this.ginsurance_type = ginsurance_type;
        this.u_dep = u_dep;
        this.work_type = work_type;
        this.work_status = work_status;
        this.accessible = accesible;
        this.sex_type = sex_type;
        this.dependents = dependents;
        this.healthcare = healthcare;
        this.registration_date = registration_date;
        this.quit_date = quit_date;
        this.licens_id = licens_id;
        this.nbanknumber = nbanknumber;
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
            NBANKNUMBER
		} = data;
            
            // Format the date string from yy-mm-ddThh:mm:ss to yyyy-mm-dd
            const FORMAT_REGISTRATION_DATE = REGISTRATION_DATE.toISOString().split("T")[0]
            const FORMAT_QUIT_DATE = (QUIT_DATE) ? QUIT_DATE.toISOString().split("T")[0] : null;
		
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