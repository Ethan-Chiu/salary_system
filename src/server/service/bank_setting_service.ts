import { container, injectable } from "tsyringe";
import { BankSetting } from "../database/entity/SALARY/bank_setting";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, get_date_string, select_value } from "./helper_function";
import { z } from "zod";
import {
	createBankSettingService,
	updateBankSettingService,
} from "../api/types/parameters_input_type";
import { EHRService } from "./ehr_service";

@injectable()
export class BankSettingService {
	constructor() { }

	async createBankSetting({
		bank_code,
		bank_name,
		org_code,
		org_name,
		start_date,
		end_date,
	}: z.infer<typeof createBankSettingService>): Promise<BankSetting> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);
		const newData = await BankSetting.create(
			{
				bank_code: bank_code,
				bank_name: bank_name,
				org_code: org_code,
				org_name: org_name,
				start_date: start_date ?? current_date_string,
				end_date: end_date,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}

	async getBankSettingById(id: number): Promise<BankSetting | null> {
		const bankSetting = await BankSetting.findOne(
			{
				where: { id: id },
			}
		);
		return bankSetting;
	}

	async getCurrentBankSetting(period_id: number): Promise<BankSetting[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const bankSetting = await BankSetting.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
			order: [["bank_code", "ASC"]],
		});
		return bankSetting;
	}

	async getAllBankSetting(): Promise<BankSetting[]> {
		const bankSetting = await BankSetting.findAll(
			{
				where: { disabled: false },
				order: [["start_date", "DESC"], ["bank_code", "ASC"]]
			}
		);
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
	}: z.infer<typeof updateBankSettingService>): Promise<void> {
		const bankSetting = await this.getBankSettingById(id);
		if (bankSetting == null) {
			throw new BaseResponseError("BankSetting does not exist");
		}
		await this.deleteBankSetting(id);

		await this.createBankSetting(
			{
				bank_code: select_value(bank_code, bankSetting.bank_code),
				bank_name: select_value(bank_name, bankSetting.bank_name),
				org_code: select_value(org_code, bankSetting.org_code),
				org_name: select_value(org_name, bankSetting.org_name),
				start_date: select_value(start_date, bankSetting.start_date),
				end_date: select_value(end_date, bankSetting.end_date),
			},
		);
	}

	async deleteBankSetting(id: number): Promise<void> {
		const bankSetting = await this.getBankSettingById(id);
		if (bankSetting == null) {
			throw new BaseResponseError("BankSetting does not exist");
		}
		const current_date_string = get_date_string(new Date());
		check_date(bankSetting.start_date, bankSetting.end_date, current_date_string);
		const destroyedRows = await BankSetting.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
