import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createTrustMoneyService,
	updateTrustMoneyService,
} from "../api/types/parameters_input_type";
import { TrustMoney } from "../database/entity/SALARY/trust_money";
import { select_value } from "./helper_function";

@injectable()
export class TrustMoneyService {
	constructor() {}

	async createTrustMoney({
		position_level,
		position_type,
		emp_trust_reserve_limit,
		org_trust_reserve_limit,
		emp_special_trust_incent_limit,
		org_special_trust_incent_limit,
	}: z.infer<typeof createTrustMoneyService>): Promise<TrustMoney> {
		const newData = await TrustMoney.create({
			position_level: position_level,
			position_type: position_type,
			emp_trust_reserve_limit: emp_trust_reserve_limit,
			org_trust_reserve_limit: org_trust_reserve_limit,
			emp_special_trust_incent_limit: emp_special_trust_incent_limit,
			org_special_trust_incent_limit: org_special_trust_incent_limit,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getTrustMoneyById(id: number): Promise<TrustMoney | null> {
		const trustMoney = await TrustMoney.findOne({
			where: {
				id: id,
			},
		});
		return trustMoney;
	}

	async getTrustMoneyByPosition(
		position_level: number,
		position_type: string
	): Promise<TrustMoney | null> {
		const trustMoney = await TrustMoney.findOne({
			where: {
				position_level: position_level,
				position_type: position_type,
			},
		});
		return trustMoney;
	}

	async getCurrentTrustMoney(): Promise<TrustMoney[]> {
		const trustMoney = await this.getAllTrustMoney();
		return trustMoney;
	}

	async getAllTrustMoney(): Promise<TrustMoney[]> {
		const trustMoney = await TrustMoney.findAll();
		return trustMoney;
	}

	async updateTrustMoney({
		id,
		position_level,
		position_type,
		emp_trust_reserve_limit,
		org_trust_reserve_limit,
		emp_special_trust_incent_limit,
		org_special_trust_incent_limit,
	}: z.infer<typeof updateTrustMoneyService>): Promise<void> {
		const trustMoney = await this.getTrustMoneyById(id!);
		if (trustMoney == null) {
			throw new BaseResponseError("TrustMoney does not exist");
		}

		const affectedCount = await TrustMoney.update(
			{
				position_level: select_value(position_level, trustMoney.position_level),
				position_type: select_value(
					position_type,
					trustMoney.position_type
				),
				emp_trust_reserve_limit: select_value(
					emp_trust_reserve_limit,
					trustMoney.emp_trust_reserve_limit
				),
				org_trust_reserve_limit: select_value(
					org_trust_reserve_limit,
					trustMoney.org_trust_reserve_limit
				),
				emp_special_trust_incent_limit: select_value(
					emp_special_trust_incent_limit,
					trustMoney.emp_special_trust_incent_limit
				),
				org_special_trust_incent_limit: select_value(
					org_special_trust_incent_limit,
					trustMoney.org_special_trust_incent_limit
				),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteTrustMoney(id: number): Promise<void> {
		const destroyedRows = await TrustMoney.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
