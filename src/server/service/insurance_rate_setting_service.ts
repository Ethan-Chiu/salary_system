import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createInsuranceRateSettingInput,
	updateInsuranceRateSettingInput,
} from "../api/input_type/parameters_input";
import { InsuranceRateSetting } from "../database/entity/insurance_rate_setting";

@injectable()
export class InsuranceRateSettingService {
	constructor() {}

	async createInsuranceRateSetting({
		min_wage_rate,
		l_i_accident_rate,
		l_i_employment_premium_rate,
		l_i_occupational_hazard_rate,
		l_i_wage_replacement_rate,
		h_i_standard_rate,
		h_i_avg_dependents_count,
		v2_h_i_supp_premium_rate,
		v2_h_i_dock_tsx_thres,
		start_date,
		end_date,
	}: z.infer<
		typeof createInsuranceRateSettingInput
	>): Promise<InsuranceRateSetting> {
		const now = new Date();
		const newData = await InsuranceRateSetting.create({
			min_wage_rate: min_wage_rate,
			l_i_accident_rate: l_i_accident_rate,
			l_i_employment_premium_rate: l_i_employment_premium_rate,
			l_i_occupational_hazard_rate: l_i_occupational_hazard_rate,
			l_i_wage_replacement_rate: l_i_wage_replacement_rate,
			h_i_standard_rate: h_i_standard_rate,
			h_i_avg_dependents_count: h_i_avg_dependents_count,
			v2_h_i_supp_premium_rate: v2_h_i_supp_premium_rate,
			v2_h_i_dock_tsx_thres: v2_h_i_dock_tsx_thres,
			start_date: start_date ?? now,
			end_date: end_date,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getCurrentInsuranceRateSetting(): Promise<InsuranceRateSetting | null> {
		const now = new Date();
		const insuranceRateSettingList = await InsuranceRateSetting.findAll({
			where: {
				start_date: {
					[Op.lte]: now,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: now }, { [Op.eq]: null }],
				},
			},
		});
		if (insuranceRateSettingList.length > 1) {
			throw new BaseResponseError(
				"more than one active InsuranceRateSetting"
			);
		}

		const insuranceRateSetting =
			insuranceRateSettingList.length == 1
				? insuranceRateSettingList[0]!
				: null;

		return insuranceRateSetting;
	}

	async getAllInsuranceRateSetting(): Promise<InsuranceRateSetting[]> {
		const insuranceRateSettingList = await InsuranceRateSetting.findAll();
		return insuranceRateSettingList;
	}

	async getInsuranceRateSettingById(
		id: number
	): Promise<InsuranceRateSetting | null> {
		const insuranceRateSetting = await InsuranceRateSetting.findOne({
			where: {
				id: id,
			},
		});

		return insuranceRateSetting;
	}

	async updateInsuranceRateSetting({
		id,
		min_wage_rate,
		l_i_accident_rate,
		l_i_employment_premium_rate,
		l_i_occupational_hazard_rate,
		l_i_wage_replacement_rate,
		h_i_standard_rate,
		h_i_avg_dependents_count,
		v2_h_i_supp_premium_rate,
		v2_h_i_dock_tsx_thres,
		start_date,
		end_date,
	}: z.infer<typeof updateInsuranceRateSettingInput>): Promise<void> {
		const insurance_setting = await this.getInsuranceRateSettingById(id!);
		if (insurance_setting == null) {
			throw new BaseResponseError("InsuranceRateSetting does not exist");
		}

		const now = new Date();
		const affectedCount = await InsuranceRateSetting.update(
			{
				min_wage_rate: min_wage_rate ?? insurance_setting.min_wage_rate,
				l_i_accident_rate:
					l_i_accident_rate ?? insurance_setting.l_i_accident_rate,
				l_i_employment_premium_rate:
					l_i_employment_premium_rate ??
					insurance_setting.l_i_employment_premium_rate,
				l_i_occupational_hazard_rate:
					l_i_occupational_hazard_rate ??
					insurance_setting.l_i_occupational_hazard_rate,
				l_i_wage_replacement_rate:
					l_i_wage_replacement_rate ??
					insurance_setting.l_i_wage_replacement_rate,
				h_i_standard_rate:
					h_i_standard_rate ?? insurance_setting.h_i_standard_rate,
				h_i_avg_dependents_count:
					h_i_avg_dependents_count ??
					insurance_setting.h_i_avg_dependents_count,
				v2_h_i_supp_premium_rate:
					v2_h_i_supp_premium_rate ??
					insurance_setting.v2_h_i_supp_premium_rate,
				v2_h_i_dock_tsx_thres:
					v2_h_i_dock_tsx_thres ??
					insurance_setting.v2_h_i_dock_tsx_thres,
				start_date: start_date ?? insurance_setting.start_date,
				end_date: end_date,
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteInsuranceRateSetting(id: number): Promise<void> {
		const destroyedRows = await InsuranceRateSetting.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}

	async rescheduleInsuranceRateSetting(): Promise<void> {
		const insuranceRateSettingList = await InsuranceRateSetting.findAll({
			order: [["start_date", "ASC"]],
		});

		for (let i = 0; i < insuranceRateSettingList.length - 1; i += 1) {
			if (
				insuranceRateSettingList[i]!.dataValues.end_date !=
				insuranceRateSettingList[i + 1]!.dataValues.start_date
			) {
				await this.updateInsuranceRateSetting({
					id: insuranceRateSettingList[i]!.dataValues.id,
					end_date:
						insuranceRateSettingList[i + 1]!.dataValues.start_date,
				});
			}
		}

		await this.updateInsuranceRateSetting({
			id: insuranceRateSettingList[insuranceRateSettingList.length - 1]!
				.dataValues.id,
			end_date: null,
		});
	}
}
