import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { Rating } from './rating.entity';
import { AvailabilityResponseDto, RatingResponseDto } from './response.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Member)
    private readonly members: Repository<Member>,
    @InjectRepository(Rating)
    private readonly ratings: Repository<Rating>,
  ) {}

  async checkNickname(nickname: string) {
    const exists = await this.members.exists({ where: { nickname } });
    return new AvailabilityResponseDto(!exists);
  }

  async checkEmail(email: string) {
    const exists = await this.members.exists({ where: { email } });
    return new AvailabilityResponseDto(!exists);
  }

  async getRatings(memberId: number) {
    const exists = await this.members.exists({ where: { memberId } });
    if (!exists) {
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }

    const ratings = await this.ratings.find({
      where: { member: { memberId } },
      order: { ratingId: 'DESC' },
    });
    return ratings.map(RatingResponseDto.from);
  }
}
