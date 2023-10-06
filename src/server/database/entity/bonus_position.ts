import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { BaseMeta } from "./base_meta"

@Entity("U_BONUS_POSITION")
export class BonusPosition extends BaseMeta {
    @PrimaryGeneratedColumn()
    id: number

    @Column("int")
    position: number

    @Column("nvarchar2", {length: 2})
    position_type: string

    @Column("float")
    multiplier: number
}