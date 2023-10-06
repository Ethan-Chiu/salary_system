import { CreateDateColumn, UpdateDateColumn } from "typeorm"

export abstract class BaseMeta {
    @CreateDateColumn()
    created_date: Date

    @UpdateDateColumn()
    updated_date: Date
}