import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * Information about the current page. While the naming is the same, this is not comformant to the
 * Relay specifications, for simplicity.
 *
 * {@link https://www.apollographql.com/docs/graphos/schema-design/guides/relay-style-connections}
 */
@ObjectType()
export class PageInfo {
  /**
   * The total number of items available.
   */
  @Field(() => Int)
  totalItemsCount: number;

  /**
   * Whether there's a next page.
   */
  hasNextPage: boolean;

  /**
   * Whether there's a previus page.
   */
  hasPreviousPage: boolean;

  /**
   * The total number of pages available.
   */
  @Field(() => Int)
  totalPageCount: number;
}
