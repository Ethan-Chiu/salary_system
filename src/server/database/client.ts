import { singleton } from "tsyringe";
import { Sequelize } from "sequelize";
import { env } from "~/env.mjs";
import {initOracleClient} from "oracledb"


const local_db = env.USE_LOCAL_DB;

interface DatabaseConfig {
	serviceName: string;
	username: string;
	password: string;
	host: string;
	port: number;
}

const localDatabaseConfig: DatabaseConfig = {
	serviceName: "FREE",
	username: "C##SALARY",
	password: "salary",
	host: "localhost",
	port: 1521,
};

const remoteDatabaseConfig: DatabaseConfig = {
	serviceName: "testplm",
	username: "SALARY",
	password: "salary",
	host: "10.4.3.224",
	port: 1521,
};


const ehrDatabaseConfig: DatabaseConfig = {
	serviceName: "flow_utf8",
	username: "SALARY",
	password: "salary",
	host: "10.4.3.11",
	port: 1521,
};

// const config = {
// 	user: "SALARY",
  
// 	// Get the password from the environment variable
// 	// NODE_ORACLEDB_PASSWORD.  The password could also be a hard coded
// 	// string (not recommended), or it could be prompted for.
// 	// Alternatively use External Authentication so that no password is needed.
// 	password: "salary",
  
// 	// For information on connection strings see:
// 	// https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#connectionstrings
// 	connectString: "10.4.3.11:1521/flow_utf8",
  
// 	// Setting externalAuth is optional.  It defaults to false.  See:
// 	// https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#extauth
// 	externalAuth:  false,
//   };

@singleton()
export class Database {
	constructor() {
		initOracleClient({libDir: env.ORACLE_LIB_PATH});
		this.connection = this.initDatabaseConnection(remoteDatabaseConfig);
		this.ehr_connection = this.initDatabaseConnection(ehrDatabaseConfig);
	}

	connection: Sequelize;
	ehr_connection: Sequelize;

	// async initEhrConnection() {
	// 	console.log("init\n\n\n\n")
	// 	this.ehr_connection = await oracledb.getConnection(config)

	// 	console.log("here\n\n\n\n")

	// 	const sql = "SELECT * FROM SYSTEM.U_HR_PERIOD_V";

	// 	const result = await this.ehr_connection.execute(sql);

	// 	console.log(result)
	// }

	initDatabaseConnection(config: DatabaseConfig) {
		if (process.env.NODE_ENV == "development") {
			if (local_db) {
				console.log("use local database");
				config = localDatabaseConfig;
			}
		}

		const sequelize = new Sequelize(
			config.serviceName,
			config.username,
			config.password,
			{
				dialect: "oracle",
				host: config.host,
				port: config.port,
			}
		);

    return sequelize
	}
}
