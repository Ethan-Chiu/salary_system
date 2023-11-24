import { injectable } from "tsyringe";
import { BankSetting } from "../database/entity/bank_setting";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, select_value } from "./helper_function";
import { z } from "zod";
import {
	createBankSettingInput,
	updateBankSettingInput,
} from "../api/input_type/parameters_input";

@injectable()
export class BankSettingService {
	constructor() {}

	async createBankSetting({
		bank_code,
		bank_name,
		org_code,
		org_name,
		start_date,
		end_date,
	}: z.infer<typeof createBankSettingInput>): Promise<BankSetting> {
		const now = new Date();
		check_date(start_date, end_date, now);

		const newData = await BankSetting.create({
			bank_code: bank_code,
			bank_name: bank_name,
			org_code: org_code,
			org_name: org_name,
			start_date: start_date ?? now,
			end_date: end_date,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getBankSettingById(id: number): Promise<BankSetting | null> {
		const bankSetting = await BankSetting.findOne({
			where: {
				id: id,
			},
		});
		return bankSetting;
	}

	async getCurrentBankSetting(): Promise<BankSetting[]> {
		const now = Date();
		const bankSetting = await BankSetting.findAll({
			where: {
				start_date: {
					[Op.lte]: now,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: now }, { [Op.eq]: null }],
				},
			},
		});
		return bankSetting;
	}

	async getAllBankSetting(): Promise<BankSetting[]> {
		const bankSetting = await BankSetting.findAll();
		return bankSetting;
	}

	async updateBankSetting({
		id,
		bank_code,
		bank_name,
		org_code,
		org_name,
		start_date,
		end_date,
	}: z.infer<typeof updateBankSettingInput>): Promise<void> {
		const bankSetting = await this.getBankSettingById(id!);
		if (bankSetting == null) {
			throw new BaseResponseError("BankSetting does not exist");
		}
		const affectedCount = await BankSetting.update(
			{
				bank_code: select_value(bank_code, bankSetting.bank_code),
				bank_name: select_value(bank_name, bankSetting.bank_name),
				org_code: select_value(org_code, bankSetting.org_code),
				org_name: select_value(org_name, bankSetting.org_name),
				start_date: select_value(start_date, bankSetting.start_date),
				end_date: select_value(end_date, bankSetting.end_date),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBankSetting(id: number): Promise<void> {
		const now = new Date();
		await this.updateBankSetting({
			id: id,
			end_date: now,
		});
	}
}
