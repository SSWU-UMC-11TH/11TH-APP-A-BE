import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Member } from './member.entity';

@Entity('rating')
@Unique('uk_rating_member_movie', ['member', 'movieId'])
export class Rating {
  @PrimaryGeneratedColumn({ name: 'rating_id', type: 'bigint' })
  ratingId!: number;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: 'member_id' })
  member!: Member;

  @Column({ name: 'movie_id', type: 'bigint' })
  movieId!: number;

  @Column({ type: 'tinyint' })
  score!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
