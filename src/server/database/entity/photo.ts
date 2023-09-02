import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number

    // type need to be specified
    @Column({
        type: "nchar",
        length: 100,
    })
    name: string

    @Column("nvarchar2")
    filename: string

    @Column("int")
    views: number

    @Column()
    isPublished: boolean
}