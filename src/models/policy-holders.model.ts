import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsString, IsInt, IsDate, IsOptional } from 'class-validator';

export { PolicyHolders, CreatePolicyHoldersBody };

@Entity()
class PolicyHolders {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @Column({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  code?: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsDate()
  registration_date: Date;

  @Column({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  introducer_code?: string;
}

@Entity()
class CreatePolicyHoldersBody {
  @Column()
  @IsInt()
  maxCount: number;
}
