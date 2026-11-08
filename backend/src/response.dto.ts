import { Rating } from './rating.entity';

export class AvailabilityResponseDto {
  constructor(public readonly available: boolean) {}
}

export class RatingResponseDto {
  static from(rating: Rating) {
    return {
      ratingId: rating.ratingId,
      movieId: rating.movieId,
      score: rating.score,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    };
  }
}
