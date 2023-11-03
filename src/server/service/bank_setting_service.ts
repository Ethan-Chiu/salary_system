import { injectable } from "tsyringe";
import { BankSetting } from "../database/entity/bank_setting";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date } from "./helper_function";

@injectable()
export class BankSettingService {
	constructor() {}

	async createBankSetting(
		bank_code: string,
		bank_name: string,
		org_code: string,
		org_name: string,
		start_date: Date | null = null,
		end_date: Date | null = null
	): Promise<BankSetting> {
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

	async updateBankSetting(
		id: number,
		bank_code: string | null = null,
		bank_name: string | null = null,
		org_code: string | null = null,
		org_name: string | null = null,
		start_date: Date | null = null,
		end_date: Date | null = null
	): Promise<void> {
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

	async deleteBankSetting(bank_setting_id: number): Promise<void> {
		const now = new Date();
		this.updateBankSetting(
			bank_setting_id,
			null,
			null,
			null,
			null,
			null,
			now
		);
	}
}
