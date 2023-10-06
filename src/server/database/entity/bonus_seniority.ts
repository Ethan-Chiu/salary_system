import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { BaseMeta } from "./utils/base_meta"

@Entity("U_BONUS_SENIORITY")
export class BonusSeniority extends BaseMeta {
    @PrimaryGeneratedColumn()
    id: number

    @Column("int")
    seniority: number

    @Column("float")
    multiplier: number
}
