import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Flow')
class Flow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;
}

export default Flow;
