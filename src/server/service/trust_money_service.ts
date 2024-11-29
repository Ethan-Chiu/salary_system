import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	decTrustMoney,
	encTrustMoney,
	TrustMoney,
	TrustMoneyDecType,
} from "../database/entity/SALARY/trust_money";
import { check_date, get_date_string, select_value } from "./helper_function";
import { EHRService } from "./ehr_service";
import { Op } from "sequelize";
import { dateToString } from "../api/types/z_utils";
import { BaseMapper } from "../database/mapper/base_mapper";
import { createTrustMoneyService, updateTrustMoneyService } from "../api/types/trust_money_type";

@injectable()
export class TrustMoneyService {
	private readonly trustMoneyMapper: BaseMapper<
		TrustMoney,
		TrustMoneyDecType
	>;
	constructor(private readonly ehrService: EHRService) {
		this.trustMoneyMapper = new BaseMapper<TrustMoney, TrustMoneyDecType>(
			encTrustMoney,
			decTrustMoney
		);
	}

	async createTrustMoney(
		data: z.infer<typeof createTrustMoneyService>
	): Promise<TrustMoney> {
		const d = createTrustMoneyService.parse(data);

		const insuranceRateSetting = await this.trustMoneyMapper.encode({
			...d,
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		});

		const newData = await TrustMoney.create(insuranceRateSetting, {
			raw: true,
		});

		return newData;
	}

	async getTrustMoneyById(id: number): Promise<TrustMoneyDecType | null> {
		const trustMoney = await TrustMoney.findOne({
			where: { id: id },
		});
		return await this.trustMoneyMapper.decode(trustMoney);
	}

	async getCurrentTrustMoneyByPosition(
		period_id: number,
		position: number,
		position_type: string
	): Promise<TrustMoneyDecType | null> {
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
		return await this.trustMoneyMapper.decode(trustMoney);
	}

	async getCurrentTrustMoney(
		period_id: number
	): Promise<TrustMoneyDecType[]> {
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
		
		return await this.trustMoneyMapper.decodeList(trustMoney);
	}

	async getAllTrustMoney(): Promise<TrustMoneyDecType[]> {
		const trustMoney = await TrustMoney.findAll({
			where: { disabled: false },
			order: [
				["position", "ASC"],
				["position_type", "ASC"],
				["start_date", "DESC"],
			],
			raw: true,
		});
		return await this.trustMoneyMapper.decodeList(trustMoney); 
	}

	async getAllFutureTrustMoney(): Promise<TrustMoneyDecType[]> {
		const current_date_string = get_date_string(new Date());
		const trustMoney = await TrustMoney.findAll({
			where: {
				start_date: {
					[Op.gt]: current_date_string,
				},
				disabled: false,
			},
			order: [
				["position", "ASC"],
				["position_type", "ASC"],
				["start_date", "DESC"],
			],
			raw: true,
		});
		return await this.trustMoneyMapper.decodeList(trustMoney);
	}
	async updateTrustMoney(
		data: z.infer<typeof updateTrustMoneyService>
	): Promise<void> {
		const transData = await this.getTrustMoneyAfterSelectValue(
			data
		);
		await this.createTrustMoney(transData);
		await this.deleteTrustMoney(data.id);
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
		const encodedList = await TrustMoney.findAll({
			where: { disabled: false },
			order: [
				["position", "ASC"],
				["position_type", "ASC"],
				["start_date", "ASC"],
				["update_date", "ASC"],
			],
		});
		const trustMoneyList = await this.trustMoneyMapper.decodeList(encodedList);
		for (let i = 0; i < trustMoneyList.length - 1; i += 1) {
			const end_date = 
				trustMoneyList[i]!.end_date!
			;
			const start_date = trustMoneyList[i + 1]!.start_date;
			const new_end_date = 
				new Date(start_date.setDate(start_date.getDate() - 1))
			;
			if (
				trustMoneyList[i]!.position ==
					trustMoneyList[i + 1]!.position &&
				trustMoneyList[i]!.position_type ==
					trustMoneyList[i + 1]!.position_type
			) {
				if (end_date != new_end_date) {
					if (new_end_date < trustMoneyList[i]!.start_date) {
						await this.deleteTrustMoney(trustMoneyList[i]!.id);
					} else {
						await this.updateTrustMoney({
							id: trustMoneyList[i]!.id,
							end_date: new_end_date,
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
	): Promise<TrustMoneyDecType | null> {
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
		return await this.trustMoneyMapper.decode(trustMoney);
	}
	private async getTrustMoneyAfterSelectValue({
		id,
		position,
		position_type,
		org_trust_reserve_limit,
		org_special_trust_incent_limit,
		start_date,
		end_date,
	}: z.infer<typeof updateTrustMoneyService>): Promise<
		z.infer<typeof createTrustMoneyService>
	> {
		const trustMoney = await this.getTrustMoneyById(
			id
		);

		if (trustMoney == null) {
			throw new BaseResponseError("TrustMoney does not exist");
		}

		return {
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
		};
	}
}
