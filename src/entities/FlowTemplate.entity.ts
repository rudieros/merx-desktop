import 'reflect-metadata'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('FlowTemplate')
class FlowTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;
}

export default FlowTemplate;
