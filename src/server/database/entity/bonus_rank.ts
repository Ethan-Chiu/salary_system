import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { BaseMeta } from "./base_meta"

@Entity("U_BONUS_RANK")
export class BonusRank extends BaseMeta {
    @PrimaryGeneratedColumn()
    id: number

    @Column("int")
    rank: number

    @Column("float")
    multiplier: number
}