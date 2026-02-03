import { PageInfo } from '../models/page-info.model';

/**
 * Creates pagination metadata based on the total number of items, current page, and items per page.
 * This helps frontends render pagination controls correctly.
 *
 * @param totalItemsCount The total number of items available.
 * @param currentPage The current page number.
 * @param itemsPerPage The number of items displayed per page.
 * @returns An object containing pagination metadata.
 */
export function createPaginationMetadata(
  totalItemsCount: number,
  currentPage: number,
  itemsPerPage: number,
): PageInfo {
  const totalPageCount = Math.ceil(totalItemsCount / itemsPerPage);
  return {
    totalItemsCount,
    hasNextPage: currentPage < totalPageCount,
    hasPreviousPage: currentPage > 1,
    totalPageCount,
  };
}
