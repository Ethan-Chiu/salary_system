import { injectable } from "tsyringe";
import { container } from "tsyringe";
import { Database } from "../database/client";
import { QueryTypes } from "sequelize";
import { Period } from "../database/entity/UMEDIA/period";

const GETPERIOD = `
	SELECT "PERIOD_ID", "PERIOD_NAME", "START_DATE", "END_DATE", "STATUS", "ISSUE_DATE" FROM "U_HR_PERIOD" WHERE "U_HR_PERIOD"."STATUS" = 'OPEN'
`;

@injectable()
export class EHRService {
	constructor() {}

	async getPeriod(): Promise<Period[]> {
		const sequelize = container.resolve(Database).connection;
		const dataList = await sequelize.query(GETPERIOD, {
			type: QueryTypes.SELECT,
		});
		let periodList: Period[] = [];
		for (let data of dataList) {
			periodList.push(Period.fromDB(data));
		}

		return periodList;
	}
}
