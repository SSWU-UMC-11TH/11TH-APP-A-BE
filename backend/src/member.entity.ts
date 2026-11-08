import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('member')
export class Member {
  @PrimaryGeneratedColumn({ name: 'member_id', type: 'bigint' })
  memberId!: number;

  @Column({ type: 'varchar', length: 254, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 60, select: false })
  password!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nickname!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
