import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('members')
export class MovieController {
  constructor(private readonly service: MovieService) {}

  @Get('nickname/:nickname')
  checkNickname(@Param('nickname') nickname: string) {
    return this.service.checkNickname(nickname);
  }

  @Get('email/:email')
  checkEmail(@Param('email') email: string) {
    return this.service.checkEmail(email);
  }

  @Get(':memberId/ratings')
  getRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getRatings(memberId);
  }
}
