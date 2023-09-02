import "reflect-metadata";
import { DataSource } from "typeorm";
import { Photo } from "./entity/photo";
import OracleDB from "oracledb";

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
    entities: [Photo],
    subscribers: [],
    migrations: [],
})
  
export async function initDatabaseConnection(): Promise<DataSource> {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log("initialize database");
            
        } 
        return AppDataSource;
    } catch (error) {
        console.log(error);
        throw(error);
    }
}

export const dataSource: DataSource = await initDatabaseConnection();