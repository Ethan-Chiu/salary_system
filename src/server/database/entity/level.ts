import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Char } from "./utils/utils";
import { BaseMeta } from "./utils/base_meta";

@Entity("U_LEVEL")
export class Level extends BaseMeta {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("int")
	level: number;
}
