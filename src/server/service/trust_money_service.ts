import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createTrustMoneyService,
	updateTrustMoneyService,
} from "../api/types/parameters_input_type";
import { TrustMoney } from "../database/entity/SALARY/trust_money";
import { check_date, get_date_string, select_value } from "./helper_function";
import { EHRService } from "./ehr_service";
import { Op } from "sequelize";
import { dateToString } from "../api/types/z_utils";

@injectable()
export class TrustMoneyService {
	constructor() { }

	async createTrustMoney({
		position,
		position_type,
		org_trust_reserve_limit,
		org_special_trust_incent_limit,
		start_date,
		end_date,
	}: z.infer<typeof createTrustMoneyService>): Promise<TrustMoney> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);

		const newData = await TrustMoney.create({
			position: position,
			position_type: position_type,
			org_trust_reserve_limit: org_trust_reserve_limit,
			org_special_trust_incent_limit: org_special_trust_incent_limit,
			start_date: start_date ?? current_date_string,
			end_date: end_date,
			disabled: false,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getTrustMoneyById(id: number): Promise<TrustMoney | null> {
		const trustMoney = await TrustMoney.findOne({
			where: { id: id },
		});
		return trustMoney;
	}

	async getCurrentTrustMoneyByPosition(
		period_id: number,
		position: number,
		position_type: string
	): Promise<TrustMoney | null> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const trustMoney = await TrustMoney.findOne({
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
				position: position,
				position_type: position_type,
				disabled: false,
			},
		});
		return trustMoney;
	}

	async getCurrentTrustMoney(period_id: number): Promise<TrustMoney[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const trustMoney = await TrustMoney.findAll({
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
		});
		return trustMoney;
	}

	async getAllTrustMoney(): Promise<TrustMoney[]> {
		const trustMoney = await TrustMoney.findAll({
			where: { disabled: false },
			order: [
				["position", "ASC"],
				["position_type", "ASC"],
				["start_date", "DESC"],
			],
			raw: true,
		});
		return trustMoney;
	}

	async updateTrustMoney({
		id,
		position,
		position_type,
		org_trust_reserve_limit,
		org_special_trust_incent_limit,
		start_date,
		end_date,
	}: z.infer<typeof updateTrustMoneyService>): Promise<void> {
		const trustMoney = await this.getTrustMoneyById(id);
		if (trustMoney == null) {
			throw new BaseResponseError("TrustMoney does not exist");
		}

		await this.deleteTrustMoney(id);

		await this.createTrustMoney({
			position: select_value(position, trustMoney.position),
			position_type: select_value(
				position_type,
				trustMoney.position_type
			),
			org_trust_reserve_limit: select_value(
				org_trust_reserve_limit,
				trustMoney.org_trust_reserve_limit
			),
			org_special_trust_incent_limit: select_value(
				org_special_trust_incent_limit,
				trustMoney.org_special_trust_incent_limit
			),
			start_date: select_value(start_date, trustMoney.start_date),
			end_date: select_value(end_date, trustMoney.end_date),
		});
	}

	async deleteTrustMoney(id: number): Promise<void> {
		const destroyedRows = await TrustMoney.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async rescheduleTrustMoney(): Promise<void> {
		const trustMoneyList = await TrustMoney.findAll({
			where: { disabled: false },
			order: [
				["position", "ASC"],
				["position_type", "ASC"],
				["start_date", "ASC"],
				["update_date", "ASC"],
			],
		});

		for (let i = 0; i < trustMoneyList.length - 1; i += 1) {
			const end_date_string = get_date_string(
				new Date(trustMoneyList[i]!.end_date!)
			);
			const start_date = new Date(trustMoneyList[i + 1]!.start_date);
			const new_end_date_string = get_date_string(
				new Date(start_date.setDate(start_date.getDate() - 1))
			);
			if (
				trustMoneyList[i]!.position ==
				trustMoneyList[i + 1]!.position &&
				trustMoneyList[i]!.position_type ==
				trustMoneyList[i + 1]!.position_type
			) {
				if (end_date_string != new_end_date_string) {
					if (new_end_date_string < trustMoneyList[i]!.start_date) {
						await this.deleteTrustMoney(trustMoneyList[i]!.id);
					}
					else {
						await this.updateTrustMoney({
							id: trustMoneyList[i]!.id,
							end_date: new_end_date_string,
						});
					}
				}
			} else {
				if (trustMoneyList[i]!.end_date != null) {
					await this.updateTrustMoney({
						id: trustMoneyList[i]!.id,
						end_date: null,
					});
				}
			}
		}
		if (trustMoneyList[trustMoneyList.length - 1]!.end_date != null) {
			await this.updateTrustMoney({
				id: trustMoneyList[trustMoneyList.length - 1]!.id,
				end_date: null,
			});
		}
	}
	async getCurrentTrustMoneyByPositionByDate(
		position: number,
		position_type: string,
		date: Date
	): Promise<TrustMoney | null> {
		const date_str = dateToString.parse(date);

		const trustMoney = await TrustMoney.findOne({
			where: {
				start_date: {
					[Op.lte]: date_str,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: date_str }, { [Op.eq]: null }],
				},
				position: position,
				position_type: position_type,
				disabled: false,
			},
			raw: true,
		});
		return trustMoney;
	}
}
