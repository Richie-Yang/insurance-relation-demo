import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PolicyHolders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  code?: string;

  @Column()
  name: string;

  @Column()
  registration_date: Date;

  @Column({
    nullable: true,
  })
  introducer_code?: string;
}
