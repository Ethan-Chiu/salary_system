import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createBasicInfoInput,
	updateBasicInfoInput,
} from "../api/input_type/parameters_input";
import { BasicInfo } from "../database/entity/basic_info";

@injectable()
export class BasicInfoService {
	constructor() {}

	async createBasicInfo({
		payday,
		announcement,
	}: z.infer<typeof createBasicInfoInput>): Promise<BasicInfo> {
		const newData = await BasicInfo.create({
			payday: payday,
			announcement: announcement,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getBasicInfoById(id: number): Promise<BasicInfo | null> {
		const basicInfo = await BasicInfo.findOne({
			where: {
				id: id,
			},
		});
		return basicInfo;
	}

	async getCurrentBasicInfo(): Promise<BasicInfo | null> {
		const basicInfoList = await this.getAllBasicInfo();
		if (basicInfoList.length > 1) {
			throw new BaseResponseError("more than one active BasicInfo");
		}

		const basicInfo = basicInfoList.length == 1 ? basicInfoList[0]! : null;

		return basicInfo;
	}

	async getAllBasicInfo(): Promise<BasicInfo[]> {
		const basicInfo = await BasicInfo.findAll();
		return basicInfo;
	}

	async updateBasicInfo({
		id,
		payday,
		announcement,
	}: z.infer<typeof updateBasicInfoInput>): Promise<void> {
		const basicInfo = await this.getBasicInfoById(id!);
		if (basicInfo == null) {
			throw new BaseResponseError("BasicInfo does not exist");
		}

		const affectedCount = await BasicInfo.update(
			{
				payday: payday ?? basicInfo.payday,
				announcement: announcement ?? basicInfo.announcement,
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBasicInfo(id: number): Promise<void> {
		const destroyedRows = await BasicInfo.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
