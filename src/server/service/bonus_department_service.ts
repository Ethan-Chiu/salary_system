import { injectable } from "tsyringe";
import { BonusDepartment } from "../database/entity/SALARY/bonus_department";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createBonusDepartmentService,
	updateBonusDepartmentService,
} from "../api/types/parameters_input_type";
import { select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";

@injectable()
export class BonusDepartmentService {
	constructor() {}

	async createBonusDepartment({
		period_id,
		bonus_type,
		department,
		multiplier,
	}: z.infer<typeof createBonusDepartmentService>): Promise<BonusDepartment> {
		const newData = await BonusDepartment.create({
			period_id: period_id,
			bonus_type: bonus_type,
			department: department,
			multiplier: multiplier,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}
	async getMultiplier(period_id: number, bonus_type: BonusTypeEnumType, department: number): Promise<number | undefined> {
        const multiplier = (await BonusDepartment.findOne({
            where: {
                period_id: period_id,
                bonus_type: bonus_type,
				department: department
            }
        }))?.multiplier
        return multiplier
    }
	async getBonusDepartmentById(id: number): Promise<BonusDepartment | null> {
		const bonusDepartment = await BonusDepartment.findOne({
			where: {
				id: id,
			},
		});
		return bonusDepartment;
	}

	async getBonusDepartmentByBonusType(period_id: number, bonus_type: BonusTypeEnumType): Promise<BonusDepartment[] | null> {
		const bonusDepartment = await BonusDepartment.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
			},
		})
		return bonusDepartment;
	}

	async getAllBonusDepartment(): Promise<BonusDepartment[] | null> {
		const bonusDepartment = await BonusDepartment.findAll();
		return bonusDepartment;
	}

	async updateBonusDepartment({
		id,
		department,
		multiplier,
	}: z.infer<typeof updateBonusDepartmentService>): Promise<void> {
		const bonus_department = await this.getBonusDepartmentById(id!);
		if (bonus_department == null) {
			throw new BaseResponseError("BonusDepartment does not exist");
		}

		const affectedCount = await BonusDepartment.update(
			{
				department: select_value(
					department,
					bonus_department.department
				),
				multiplier: select_value(
					multiplier,
					bonus_department.multiplier
				),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusDepartment(id: number): Promise<void> {
		const destroyedRows = await BonusDepartment.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
