import { injectable } from "tsyringe";
import { BonusDepartment } from "../database/entity/bonus_department";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createBonusDepartmentInput,
	updateBonusDepartmentInput,
} from "../api/input_type/parameters_input";
import { select_value } from "./helper_function";


@injectable()
export class BonusDepartmentService {
	constructor() {}

	async createBonusDepartment({
		department,
        multiplier,
	}: z.infer<typeof createBonusDepartmentInput>): Promise<BonusDepartment> {
		const newData = await BonusDepartment.create({
            department: department,
            multiplier: multiplier,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getBonusDepartmentById(id: number): Promise<BonusDepartment | null> {
		const bonusDepartment = await BonusDepartment.findOne({
			where: {
				id: id,
			},
		});
		return bonusDepartment;
	}

    async getCurrentBonusDepartment(): Promise<BonusDepartment[] | null> {
		const bonusDepartment = this.getAllBonusDepartment();
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
	}: z.infer<typeof updateBonusDepartmentInput>): Promise<void> {
		const bonus_department = await this.getBonusDepartmentById(id!);
		if (bonus_department == null) {
			throw new BaseResponseError("BonusDepartment does not exist");
		}

		const affectedCount = await BonusDepartment.update(
			{
				department: select_value(department ,bonus_department.department),
				multiplier: select_value(multiplier ,bonus_department.multiplier),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusDepartment(id: number): Promise<void> {
		const now = new Date();
        BonusDepartment.destroy(
            { where: { id: id } }
        );
	}
}
