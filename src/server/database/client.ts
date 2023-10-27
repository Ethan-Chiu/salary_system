// import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user";
import OracleDB from "oracledb";
import { BonusSetting } from "./entity/bonus_setting";
import { BonusDepartment } from "./entity/bonus_department";
import { BonusPosition } from "./entity/bonus_position";
import { BonusSeniority } from "./entity/bonus_seniority";
import { AttendanceSetting } from "./entity/attendance_setting";
import { BankSetting } from "./entity/bank_setting";
import { BasicInfo } from "./entity/basic_info";
import { EmployeeAccount } from "./entity/employee_account";
import { EmployeeData } from "./entity/employee_data";
import { EmployeePayment } from "./entity/employee_payment";
import { InsuranceRateSetting } from "./entity/insurance_rate_setting";
import { LevelRange } from "./entity/level_range";
import { Level } from "./entity/level";
import { PerformanceLevel } from "./entity/performance_level";
import { TrustMoney } from "./entity/trust_money";
import {singleton} from "tsyringe";

const local_db = true;

const entities = [
	AttendanceSetting,
	BankSetting,
	BasicInfo,
	BonusDepartment,
	BonusPosition,
	BonusSeniority,
	BonusSetting,
	EmployeeAccount,
	EmployeeData,
	EmployeePayment,
	InsuranceRateSetting,
	LevelRange,
	Level,
	PerformanceLevel,
	TrustMoney,
	User,
];

const LocalAppDataSource = new DataSource({
	type: "oracle",
	host: "localhost",
	port: 1521,
	username: "C##SALARY",
	password: "salary",
	serviceName: "FREE",
	driver: OracleDB,
	synchronize: true,
	logging: true,
	entities: entities,
	subscribers: [],
	migrations: [],
});

const AppDataSource = new DataSource({
	type: "oracle",
	host: "10.4.3.224",
	port: 1521,
	username: "SALARY",
	password: "salary",
	serviceName: "testplm",
	driver: OracleDB,
	synchronize: false,
	logging: true,
	entities: entities,
	subscribers: [],
	// migrations: [],
});

@singleton()
export class Database {
	constructor() {
		this.initDatabaseConnection();
	}

	dataSource: DataSource;

	// get dataSource() {
	// 	return (async () => {
	// 	   try {
	// 		 data
	// 	   } catch(e) {
	// 		 return null;
	// 	   }
	// 	})();
	// }

 	async initDatabaseConnection() {
		let db_data_source = AppDataSource;
		if (process.env.NODE_ENV == "development") {
			if (local_db) {
				db_data_source = LocalAppDataSource;
			}
		}
	
		try {
			if (!db_data_source.isInitialized) {
				await db_data_source.initialize();
				console.log("initialize database");
			}
			this.dataSource = db_data_source
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}

