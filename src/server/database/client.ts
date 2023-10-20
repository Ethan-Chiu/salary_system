import "reflect-metadata";
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

const AppDataSource = new DataSource({
	type: "oracle",
	host: "10.4.3.224",
	port: 1521,
	username: "SALARY",
	password: "salary",
	serviceName: "testplm",
	driver: OracleDB,
	synchronize: true,
	logging: true,
	entities: [
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
	],
	subscribers: [],
	migrations: [],
});

export async function initDatabaseConnection(): Promise<DataSource> {
	try {
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
			console.log("initialize database");
		}
		return AppDataSource;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export const dataSource: DataSource = await initDatabaseConnection();
