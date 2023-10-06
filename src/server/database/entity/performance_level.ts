import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseMeta } from './utils/base_meta';
import { Char } from './utils/utils';

@Entity('U_PERFORMANCE_LEVEL')
export class PerformanceLevel extends BaseMeta{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar2', { length: Char(32) })
    performance_level: string;

    @Column('float')
    multiplier: number;
}
