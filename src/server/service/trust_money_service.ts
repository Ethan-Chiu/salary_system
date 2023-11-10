import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createTrustMoneyInput,
	updateTrustMoneyInput,
} from "../api/input_type/parameters_input";
import { TrustMoney } from "../database/entity/trust_money";

@injectable()
export class TrustMoneyService {
	constructor() {}

	async createTrustMoney({
		position,
		position_type,
		emp_trust_reserve_limit,
		org_trust_reserve_limit,
		emp_special_trust_incent_limit,
		org_special_trust_incent_limit,
	}: z.infer<typeof createTrustMoneyInput>): Promise<TrustMoney> {
		const newData = await TrustMoney.create({
			position: position,
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
		position,
		position_type,
		emp_trust_reserve_limit,
		org_trust_reserve_limit,
		emp_special_trust_incent_limit,
		org_special_trust_incent_limit,
	}: z.infer<typeof updateTrustMoneyInput>): Promise<void> {
		const trustMoney = await this.getTrustMoneyById(id!);
		if (trustMoney == null) {
			throw new BaseResponseError("TrustMoney does not exist");
		}

		const affectedCount = await TrustMoney.update(
			{
				position: position ?? trustMoney.position,
				position_type: position_type ?? trustMoney.position_type,
				emp_trust_reserve_limit:
					emp_trust_reserve_limit ??
					trustMoney.emp_trust_reserve_limit,
				org_trust_reserve_limit:
					org_trust_reserve_limit ??
					trustMoney.org_trust_reserve_limit,
				emp_special_trust_incent_limit:
					emp_special_trust_incent_limit ??
					trustMoney.emp_special_trust_incent_limit,
				org_special_trust_incent_limit:
					org_special_trust_incent_limit ??
					trustMoney.org_special_trust_incent_limit,
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
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
