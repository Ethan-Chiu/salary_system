import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { BaseMeta } from "./utils/base_meta"

@Entity("U_SETTINGS")
export class Settings extends BaseMeta {
    @PrimaryGeneratedColumn()
    id: number

    @Column("date")
    payday: Date

    @Column("varchar2", {length: 512})
    anouncement: string
}