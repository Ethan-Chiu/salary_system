import { injectable } from "tsyringe";
import { BonusAll } from "../database/entity/SALARY/bonus_all";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
    createBonusAllService,
    updateBonusAllService,
} from "../api/types/parameters_input_type";
import { select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";

@injectable()
export class BonusAllService {
    constructor() { }

    async createBonusAll({
        period_id,
        bonus_type,
        multiplier,
    }: z.infer<typeof createBonusAllService>): Promise<BonusAll> {
        const bonusAll = await BonusAll.findOne(
            {
                where: {
                    period_id: period_id,
                    bonus_type: bonus_type,
                    disabled: false,
                },
            }
        );
        if (bonusAll != null) {
            throw new BaseResponseError("BonusAll already exists");
        }
        const newData = await BonusAll.create(
            {
                period_id: period_id,
                bonus_type: bonus_type,
                multiplier: multiplier,
                disabled: false,
                create_by: "system",
                update_by: "system",
            }
        );
        return newData;
    }
    async batchCreateBonusAll(
        data_array: z.infer<typeof createBonusAllService>[]
    ) {
        const new_data_array = data_array.map((data) => {
            return {
                period_id: data.period_id,
                bonus_type: data.bonus_type,
                multiplier: data.multiplier,
                disabled: false,
                create_by: "system",
                update_by: "system",
            };
        });
        await BonusAll.bulkCreate(new_data_array);
    }
    async getMultiplier(
        period_id: number,
        bonus_type: BonusTypeEnumType,
    ): Promise<number> {
        //for develop
        const multiplier = (
            await BonusAll.findOne(
                {
                    where: {
                        period_id: period_id,
                        bonus_type: bonus_type,
                        disabled: false,
                    },
                }
            )
        )?.multiplier;
        return multiplier ?? 1;
    }
    async getBonusAllById(id: number): Promise<BonusAll | null> {
        const bonusAll = await BonusAll.findOne(
            {
                where: { id: id }
            }
        );
        return bonusAll;
    }

    async getBonusAllByBonusType(
        period_id: number,
        bonus_type: BonusTypeEnumType
    ): Promise<BonusAll | null> {
        const bonusAll = await BonusAll.findOne(
            {
                where: {
                    period_id: period_id,
                    bonus_type: bonus_type,
                    disabled: false,
                },
            }
        );
        return bonusAll;
    }

    async getAllBonusAll(): Promise<BonusAll[] | null> {
        const bonusAll = await BonusAll.findAll(
            {
                where: { disabled: false },
            }
        );
        return bonusAll;
    }

    async updateBonusAll({
        id,
        multiplier,
    }: z.infer<typeof updateBonusAllService>): Promise<void> {
        const bonus_all = await this.getBonusAllById(id);
        if (bonus_all == null) {
            throw new BaseResponseError("BonusAll does not exist");
        }
        await this.deleteBonusAll(id);

        await this.createBonusAll(
            {
                period_id: bonus_all.period_id,
                bonus_type: bonus_all.bonus_type,
                multiplier: select_value(
                    multiplier,
                    bonus_all.multiplier
                ),
            }
        );
    }

    async deleteBonusAll(id: number): Promise<void> {
        const destroyedRows = await BonusAll.update(
            { disabled: true },
            { where: { id: id } }
        );
        if (destroyedRows[0] == 0) {
            throw new BaseResponseError("Delete error");
        }
    }
}
