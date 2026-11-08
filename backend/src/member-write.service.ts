import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Member } from './member.entity';
import { CreateMemberDto } from './write.dto';

@Injectable()
export class MemberWriteService {
  constructor(
    @InjectRepository(Member)
    private readonly members: Repository<Member>,
  ) {}

  async signUp(dto: CreateMemberDto) {
    if (Buffer.byteLength(dto.password, 'utf8') > 72) {
      throw new BadRequestException('비밀번호는 72바이트 이하여야 합니다.');
    }
    if (await this.members.exists({ where: { email: dto.email } })) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }
    if (await this.members.exists({ where: { nickname: dto.nickname } })) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }
    const saved = await this.members.save(this.members.create({
      email: dto.email,
      nickname: dto.nickname,
      password: await bcrypt.hash(dto.password, 10),
    }));
    return {
      memberId: saved.memberId,
      email: saved.email,
      nickname: saved.nickname,
    };
  }
}
