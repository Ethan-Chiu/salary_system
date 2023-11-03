import { injectable } from "tsyringe";
import { BankSetting } from "../database/entity/bank_setting";
import { z } from "zod";
import { bankInput } from "../api/input_type/parameters_input";

@injectable()
export class BankService {
	constructor() {}

	async getData(
		
	): Promise<BankSetting[] | null> {
        
        const now = new Date();
        const bank_data = await BankSetting.findAll({
        
        });
		return bank_data	
	}

	async addData({
            bank_code,
            bank_name,
            org_code,
            org_name,
            start_date,
            end_date,
        }: z.infer<typeof bankInput>
    ): Promise<BankSetting> {
		const now = new Date();
		const newData = await BankSetting.create({
			bank_code: bank_code,
            bank_name: bank_name,
            org_code: org_code,
            org_name: org_name,
            start_date: start_date,
            end_date: end_date,
            create_date: now,
			create_by: "system",
			update_date: now,
			update_by: "system",
		});
		return newData;
	}
}
