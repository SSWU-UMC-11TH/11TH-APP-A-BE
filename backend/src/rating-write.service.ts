import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { Rating } from './rating.entity';
import { CreateRatingDto, UpdateRatingDto } from './write.dto';

@Injectable()
export class RatingWriteService {
  constructor(
    @InjectRepository(Member) private readonly members: Repository<Member>,
    @InjectRepository(Rating) private readonly ratings: Repository<Rating>,
  ) {}

  async create(memberId: number, dto: CreateRatingDto) {
    const member = await this.members.findOneBy({ memberId });
    if (!member) throw new NotFoundException('존재하지 않는 회원입니다.');

    const exists = await this.ratings.exists({
      where: { member: { memberId }, movieId: dto.movieId },
    });
    if (exists) throw new ConflictException('이미 이 영화에 평점을 남겼습니다.');

    const saved = await this.ratings.save(this.ratings.create({
      member, movieId: dto.movieId,
      score: dto.score, comment: dto.comment ?? null,
    }));
    return saved.ratingId;
  }

  private async findOwned(ratingId: number, memberId: number) {
    const rating = await this.ratings.findOne({
      where: { ratingId }, relations: { member: true },
    });
    if (!rating) throw new NotFoundException('존재하지 않는 평점입니다.');
    if (String(rating.member.memberId) !== String(memberId)) {
      throw new ForbiddenException('본인이 작성한 평점만 변경할 수 있습니다.');
    }
    return rating;
  }

  async update(ratingId: number, memberId: number, dto: UpdateRatingDto) {
    const rating = await this.findOwned(ratingId, memberId);
    rating.score = dto.score;
    rating.comment = dto.comment ?? null;
    await this.ratings.save(rating);
    return null;
  }

  async delete(ratingId: number, memberId: number) {
    const rating = await this.findOwned(ratingId, memberId);
    await this.ratings.remove(rating);
  }
}
