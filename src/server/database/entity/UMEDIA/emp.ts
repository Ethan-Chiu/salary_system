export class Emp {
	// id can be undefined during creation when using `autoIncrement`
	declare emp_no?: string;
	declare emp_name?: string;
    declare position?: number;
    declare position_type?: string;
    declare ginsurance_type?: string;
    declare u_dep?: string;
    declare work_type?: string;
    declare work_status?: string;
    declare accesible?: boolean | null;
    declare sex_type?: string;
    declare dependents?: number;
    declare healthcare?: number;
    declare registration_date?: string;
    declare quit_date?: string;
    declare licens_id?: string;
    declare nbanknumber?: string;

	constructor(
        emp_no: string,
        emp_name: string,
        position: number,
        position_type: string,
        ginsurance_type: string,
        u_dep: string,
        work_type: string,
        work_status: string,
        accesible: boolean | null,
        sex_type: string,
        dependents: number,
        healthcare: number,
        registration_date: string,
        quit_date: string,
        licens_id: string,
        nbanknumber: string
	) {
        this.emp_no = emp_no;
        this.emp_name = emp_name;
        this.position = position;
        this.position_type = position_type;
        this.ginsurance_type = ginsurance_type;
        this.u_dep = u_dep;
        this.work_type = work_type;
        this.work_status = work_status;
        this.accesible = accesible;
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
            EMP_NO,
            EMP_NAME,
            POSITION,
            POSITION_TYPE,
            GINSURANCE_TYPE,
            U_DEP,
            WORK_TYPE,
            WORK_STATUS,
            ACCESIBLE,
            SEX_TYPE,
            DEPENDENTS,
            HEALTHCARE,
            REGISTRATION_DATE,
            QUIT_DATE,
            LICENSE_ID,
            NBANKNUMBER
		} = data;

		return new Emp(
            EMP_NO,
            EMP_NAME,
            POSITION,
            POSITION_TYPE,
            GINSURANCE_TYPE,
            U_DEP,
            WORK_TYPE,
            WORK_STATUS,
            ACCESIBLE,
            SEX_TYPE,
            DEPENDENTS,
            HEALTHCARE,
            REGISTRATION_DATE,
            QUIT_DATE,
            LICENSE_ID,
            NBANKNUMBER
		);
	}
}
