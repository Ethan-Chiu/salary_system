import { container, injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createInsuranceRateSettingService,
	updateInsuranceRateSettingService,
} from "../api/types/parameters_input_type";
import { InsuranceRateSetting } from "../database/entity/SALARY/insurance_rate_setting";
import { check_date, get_date_string, select_value } from "./helper_function";
import { EHRService } from "./ehr_service";

@injectable()
export class InsuranceRateSettingService {
	constructor() { }

	async createInsuranceRateSetting({
		min_wage_rate,
		l_i_accident_rate,
		l_i_employment_pay_rate,
		l_i_occupational_injury_rate,
		l_i_wage_replacement_rate,
		h_i_standard_rate,
		h_i_avg_dependents_count,
		v2_h_i_supp_pay_rate,
		v2_h_i_deduction_tsx_thres,
		v2_h_i_multiplier,
		start_date,
		end_date,
	}: z.infer<
		typeof createInsuranceRateSettingService
	>): Promise<InsuranceRateSetting> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);
		const newData = await InsuranceRateSetting.create(
			{
				min_wage_rate: min_wage_rate,
				l_i_accident_rate: l_i_accident_rate,
				l_i_employment_pay_rate: l_i_employment_pay_rate,
				l_i_occupational_injury_rate: l_i_occupational_injury_rate,
				l_i_wage_replacement_rate: l_i_wage_replacement_rate,
				h_i_standard_rate: h_i_standard_rate,
				h_i_avg_dependents_count: h_i_avg_dependents_count,
				v2_h_i_supp_pay_rate: v2_h_i_supp_pay_rate,
				v2_h_i_deduction_tsx_thres: v2_h_i_deduction_tsx_thres,
				v2_h_i_multiplier: v2_h_i_multiplier,
				start_date: start_date ?? current_date_string,
				end_date: end_date,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}

	async getCurrentInsuranceRateSetting(
		period_id: number
	): Promise<InsuranceRateSetting | null> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const insuranceRateSettingList = await InsuranceRateSetting.findAll(
			{
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
				order: [["start_date", "DESC"]],
			}
		);
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
		const insuranceRateSettingList = await InsuranceRateSetting.findAll(
			{
				where: { disabled: false },
				order: [["start_date", "DESC"]],
			}
		);
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
		l_i_employment_pay_rate,
		l_i_occupational_injury_rate,
		l_i_wage_replacement_rate,
		h_i_standard_rate,
		h_i_avg_dependents_count,
		v2_h_i_supp_pay_rate,
		v2_h_i_deduction_tsx_thres,
		v2_h_i_multiplier,
		start_date,
		end_date,
	}: z.infer<typeof updateInsuranceRateSettingService>): Promise<void> {
		const insuranceSetting = await this.getInsuranceRateSettingById(id);
		if (insuranceSetting == null) {
			throw new BaseResponseError("InsuranceRateSetting does not exist");
		}

		await this.deleteInsuranceRateSetting(id);

		await this.createInsuranceRateSetting(
			{
				min_wage_rate: select_value(
					min_wage_rate,
					insuranceSetting.min_wage_rate
				),
				l_i_accident_rate: select_value(
					l_i_accident_rate,
					insuranceSetting.l_i_accident_rate
				),
				l_i_employment_pay_rate: select_value(
					l_i_employment_pay_rate,
					insuranceSetting.l_i_employment_pay_rate
				),
				l_i_occupational_injury_rate: select_value(
					l_i_occupational_injury_rate,
					insuranceSetting.l_i_occupational_injury_rate
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
				v2_h_i_supp_pay_rate: select_value(
					v2_h_i_supp_pay_rate,
					insuranceSetting.v2_h_i_supp_pay_rate
				),
				v2_h_i_deduction_tsx_thres: select_value(
					v2_h_i_deduction_tsx_thres,
					insuranceSetting.v2_h_i_deduction_tsx_thres
				),
				v2_h_i_multiplier: select_value(
					v2_h_i_multiplier,
					insuranceSetting.v2_h_i_multiplier
				),
				start_date: select_value(
					start_date,
					insuranceSetting.start_date
				),
				end_date: select_value(end_date, insuranceSetting.end_date),
			},
		);
	}

	async deleteInsuranceRateSetting(id: number): Promise<void> {
		const destroyedRows = await InsuranceRateSetting.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async rescheduleInsuranceRateSetting(): Promise<void> {
		const insuranceRateSettingList = await InsuranceRateSetting.findAll(
			{
				where: { disabled: false },
				order: [["start_date", "ASC"], ["update_date", "ASC"]],
			}
		);

		for (let i = 0; i < insuranceRateSettingList.length - 1; i += 1) {
			const end_date_string = insuranceRateSettingList[i]!.end_date ? get_date_string(
				new Date(insuranceRateSettingList[i]!.end_date!)
			) : null;
			const start_date = new Date(
				insuranceRateSettingList[i + 1]!.start_date
			);
			const new_end_date_string = get_date_string(
				new Date(start_date.setDate(start_date.getDate() - 1))
			);
			if (end_date_string != new_end_date_string) {
				if (new_end_date_string < insuranceRateSettingList[i]!.start_date) {
					await this.deleteInsuranceRateSetting(insuranceRateSettingList[i]!.id);
				}
				else {
					await this.updateInsuranceRateSetting({
						id: insuranceRateSettingList[i]!.id,
						end_date: new_end_date_string,
					});
				}
			}
		}

		if (
			insuranceRateSettingList[insuranceRateSettingList.length - 1]!.end_date != null
		) {
			await this.updateInsuranceRateSetting({
				id: insuranceRateSettingList[insuranceRateSettingList.length - 1]!.id,
				end_date: null,
			});
		}
	}
}
