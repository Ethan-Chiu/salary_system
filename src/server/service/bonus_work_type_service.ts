import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createBonusSeniorityService,
	createBonusWorkTypeService,
	updateBonusSeniorityService,
    updateBonusWorkTypeService,
} from "../api/types/parameters_input_type";
import {BonusWorkType } from "../database/entity/SALARY/bonus_work_type";
import { select_value } from "./helper_function";
import { workerData } from "worker_threads";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";

@injectable()
export class BonusWorkTypeService {
	constructor() {}

	async createBonusWorkType({
		period_id,
		bonus_type,
		work_type,
		multiplier,
	}: z.infer<typeof createBonusWorkTypeService>): Promise<BonusWorkType> {
		const newData = await BonusWorkType.create({
			period_id: period_id,
			bonus_type: bonus_type,
			work_type: work_type,
			multiplier: multiplier,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getBonusWorkTypeById(id: number): Promise<BonusWorkType | null> {
		const bonusWorkType = await BonusWorkType.findOne({
			where: {
				id: id,
			},
		});
		return bonusWorkType;
	}

	async getBonusWorkTypeByBonusType(period_id: number, bonus_type: BonusTypeEnumType): Promise<BonusWorkType[] | null> {
        const bonusWorkType = await BonusWorkType.findAll({
            where: {
                period_id: period_id,
                bonus_type: bonus_type
            }
        })
		return bonusWorkType;
	}
    async getMultiplier(period_id: number, bonus_type: BonusTypeEnumType, work_type: string): Promise<number | undefined> {
        const multiplier = (await BonusWorkType.findOne({
            where: {
                period_id: period_id,
                bonus_type: bonus_type,
                work_type: work_type
            }
        }))?.multiplier
        return multiplier
    }
	async getAllBonusWorkType(): Promise<BonusWorkType[] | null> {
		const bonusWorkType = await BonusWorkType.findAll();
		return bonusWorkType;
	}

	async updateBonusWorkType({
		id,
		work_type,
		multiplier,
	}: z.infer<typeof updateBonusWorkTypeService>): Promise<void> {
		const bonus_work_type = await this.getBonusWorkTypeById(id!);
		if (bonus_work_type == null) {
			throw new BaseResponseError("BonusWorkType does not exist");
		}

		const affectedCount = await BonusWorkType.update(
			{
				work_type: select_value(work_type, bonus_work_type.work_type),
				multiplier: select_value(
					multiplier,
					bonus_work_type.multiplier
				),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusWorkType(id: number): Promise<void> {
		const destroyedRows = await BonusWorkType.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
