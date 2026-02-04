import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

/**
 * Information about the current page. While the naming is the same, this is not comformant to the
 * Relay specifications, for simplicity.
 *
 * {@link https://www.apollographql.com/docs/graphos/schema-design/guides/relay-style-connections}
 */
@ObjectType()
export class PageInfo {
  /**
   * Items per page.
   */
  @Field(() => Int)
  readonly itemsPerPage: number;

  /**
   * The total number of items available.
   */
  @Field(() => Int)
  readonly totalItemsCount: number;

  /**
   * The current page number (1-based).
   */
  @Field(() => Int)
  readonly currentPage: number;

  /**
   * Whether there's a next page.
   */
  @Expose()
  get hasNextPage(): boolean {
    return this.currentPage < this.totalPageCount;
  }

  /**
   * Whether there's a previous page.
   */
  @Expose()
  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  /**
   * The total number of pages available.
   */
  @Field(() => Int)
  @Expose()
  get totalPageCount(): number {
    return Math.ceil(this.totalItemsCount / this.itemsPerPage);
  }

  constructor(data: Pick<PageInfo, 'itemsPerPage' | 'totalItemsCount' | 'currentPage'>) {
    Object.assign(this, data);
  }
}
