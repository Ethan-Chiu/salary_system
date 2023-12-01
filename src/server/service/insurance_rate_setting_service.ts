import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createInsuranceRateSettingService,
	updateInsuranceRateSettingService,
} from "../api/input_type/parameters_input";
import { InsuranceRateSetting } from "../database/entity/insurance_rate_setting";
import { get_date_string, select_value } from "./helper_function";

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
		typeof createInsuranceRateSettingService
	>): Promise<InsuranceRateSetting> {
		const current_date_string = get_date_string(new Date());
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
			start_date: start_date ?? current_date_string,
			end_date: end_date,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getCurrentInsuranceRateSetting(): Promise<InsuranceRateSetting | null> {
		const current_date_string = get_date_string(new Date());
		const insuranceRateSettingList = await InsuranceRateSetting.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: current_date_string }, { [Op.eq]: null }],
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
	}: z.infer<typeof updateInsuranceRateSettingService>): Promise<void> {
		const insuranceSetting = await this.getInsuranceRateSettingById(id!);
		if (insuranceSetting == null) {
			throw new BaseResponseError("InsuranceRateSetting does not exist");
		}

		const affectedCount = await InsuranceRateSetting.update(
			{
				min_wage_rate: select_value(
					min_wage_rate,
					insuranceSetting.min_wage_rate
				),
				l_i_accident_rate: select_value(
					l_i_accident_rate,
					insuranceSetting.l_i_accident_rate
				),
				l_i_employment_premium_rate: select_value(
					l_i_employment_premium_rate,
					insuranceSetting.l_i_employment_premium_rate
				),
				l_i_occupational_hazard_rate: select_value(
					l_i_occupational_hazard_rate,
					insuranceSetting.l_i_occupational_hazard_rate
				),
				l_i_wage_replacement_rate: select_value(
					l_i_wage_replacement_rate,
					insuranceSetting.l_i_wage_replacement_rate
				),
				h_i_standard_rate: select_value(
					h_i_standard_rate,
					insuranceSetting.h_i_standard_rate
				),
				h_i_avg_dependents_count: select_value(
					h_i_avg_dependents_count,
					insuranceSetting.h_i_avg_dependents_count
				),
				v2_h_i_supp_premium_rate: select_value(
					v2_h_i_supp_premium_rate,
					insuranceSetting.v2_h_i_supp_premium_rate
				),
				v2_h_i_dock_tsx_thres: select_value(
					v2_h_i_dock_tsx_thres,
					insuranceSetting.v2_h_i_dock_tsx_thres
				),
				start_date: select_value(
					start_date,
					insuranceSetting.start_date
				),
				end_date: select_value(end_date, insuranceSetting.end_date),
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
			const end_date_string = get_date_string(
				new Date(insuranceRateSettingList[i]!.dataValues.end_date!)
			);
			const start_date = new Date(
				insuranceRateSettingList[i + 1]!.dataValues.start_date
			);
			const new_end_date_string = get_date_string(
				new Date(start_date.setDate(start_date.getDate() - 1))
			);
			if (end_date_string != new_end_date_string) {
				await this.updateInsuranceRateSetting({
					id: insuranceRateSettingList[i]!.dataValues.id,
					end_date: new_end_date_string,
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
