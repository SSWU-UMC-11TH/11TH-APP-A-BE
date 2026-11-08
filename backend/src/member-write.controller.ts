import { Body, Controller, Post } from '@nestjs/common';
import { MemberWriteService } from './member-write.service';
import { CreateMemberDto } from './write.dto';

@Controller('members')
export class MemberWriteController {
  constructor(private readonly service: MemberWriteService) {}

  @Post()
  signUp(@Body() dto: CreateMemberDto) {
    return this.service.signUp(dto);
  }
}
