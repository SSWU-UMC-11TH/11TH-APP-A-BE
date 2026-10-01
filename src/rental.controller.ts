// src/rental.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { RentalService } from './rental.service';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  async createRental(@Body() body: Record<string, any>): Promise<string> {
    return await this.rentalService.createRental(body);
  }
}