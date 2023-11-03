import { injectable } from "tsyringe";
import { BankSetting } from "../database/entity/bank_setting";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date } from "./helper_function";
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
			create_date: now,
			create_by: "system",
			update_date: now,
			update_by: "system",
		});
		return newData;
	}

	async getBankSetting(id: number): Promise<BankSetting | null> {
		const now = new Date();
		const bankSettiing = await BankSetting.findOne({
			where: {
				id: id,
				start_date: {
					[Op.lt]: now,
				},
				end_date: {
					[Op.or]: [{ [Op.gt]: now }, { [Op.eq]: null }],
				},
			},
		});
		return bankSettiing;
	}

	async getBankSettingList(): Promise<BankSetting[] | null> {
		const now = new Date();
		const bankSettiing = await BankSetting.findAll({
			where: {
				start_date: {
					[Op.lt]: now,
				},
				end_date: {
					[Op.or]: [{ [Op.gt]: now }, { [Op.eq]: null }],
				},
			},
		});
		return bankSettiing;
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
		const bank_setting = await this.getBankSetting(id);
		if (bank_setting == null) {
			throw new BaseResponseError("BankSetting does not exist");
		}

		const now = new Date();
		const affectedCount = await BankSetting.update(
			{
				bank_code: bank_code ?? bank_setting.bank_code,
				bank_name: bank_name ?? bank_setting.bank_name,
				org_code: org_code ?? bank_setting.org_code,
				org_name: org_name ?? bank_setting.org_name,
				start_date: start_date ?? bank_setting.start_date,
				end_date: end_date ?? bank_setting.end_date,
				update_date: now,
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
		this.updateBankSetting({
			id: id,
			bank_code: null,
			bank_name: null,
			org_code: null,
			org_name: null,
			start_date: null,
			end_date: now,
		});
	}
}
