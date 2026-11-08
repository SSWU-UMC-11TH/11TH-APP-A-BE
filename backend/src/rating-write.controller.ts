import { Body, Controller, Delete, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { RatingWriteService } from './rating-write.service';
import { CreateRatingDto, UpdateRatingDto } from './write.dto';

@Controller('members')
export class RatingWriteController {
  constructor(private readonly service: RatingWriteService) {}

  @Post(':memberId/ratings')
  create(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() dto: CreateRatingDto,
  ) {
    return this.service.create(memberId, dto);
  }

  @Patch(':memberId/ratings/:ratingId')
  update(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.service.update(ratingId, memberId, dto);
  }

  @Delete(':memberId/ratings/:ratingId')
  @HttpCode(204)
  async delete(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    await this.service.delete(ratingId, memberId);
  }
}
