import { PageInfo } from './page-info.model';

describe('createPaginationMetadata', () => {
  it('returns correct metadata for the first page', () => {
    // Arrange
    const totalItemsCount = 100;
    const currentPage = 1;
    const itemsPerPage = 10;

    // Act
    const result = new PageInfo({ totalItemsCount, currentPage, itemsPerPage });

    // Assert
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPageCount).toBe(10);
    expect(result.offset).toBe(0);
  });

  it('returns correct metadata for the last page', () => {
    // Arrange
    const totalItemsCount = 100;
    const currentPage = 10;
    const itemsPerPage = 10;

    // Act
    const result = new PageInfo({ totalItemsCount, currentPage, itemsPerPage });

    // Assert
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.totalPageCount).toBe(10);
    expect(result.offset).toBe(90);
  });

  it('returns correct metadata for the last page, when itemsPerPage does not divide totalItemsCount evenly', () => {
    // Arrange
    const totalItemsCount = 95;
    const currentPage = 10; // Last page
    const itemsPerPage = 10;

    // Act
    const result = new PageInfo({ totalItemsCount, currentPage, itemsPerPage });

    // Assert
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.totalPageCount).toBe(10);
    expect(result.offset).toBe(90);
  });

  it('returns correct metadata for a middle page', () => {
    // Arrange
    const totalItemsCount = 100;
    const currentPage = 5;
    const itemsPerPage = 10;

    // Act
    const result = new PageInfo({ totalItemsCount, currentPage, itemsPerPage });

    // Assert
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.totalPageCount).toBe(10);
    expect(result.offset).toBe(40);
  });

  it('returns correct metadata when there are no items', () => {
    // Arrange
    const totalItemsCount = 0;
    const currentPage = 1;
    const itemsPerPage = 10;

    // Act
    const result = new PageInfo({ totalItemsCount, currentPage, itemsPerPage });

    // Assert
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPageCount).toBe(0);
    expect(result.offset).toBe(0);
  });

  it('returns correct metadata when itemsPerPage is greater than totalItemsCount', () => {
    // Arrange
    const totalItemsCount = 5;
    const currentPage = 1;
    const itemsPerPage = 10;

    // Act
    const result = new PageInfo({ totalItemsCount, currentPage, itemsPerPage });

    // Assert
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPageCount).toBe(1);
    expect(result.offset).toBe(0);
  });

  it('returns correct metadata when currentPage is greater than totalPageCount', () => {
    // Arrange
    const totalItemsCount = 50;
    const currentPage = 6; // More than total pages
    const itemsPerPage = 10;

    // Act
    const result = new PageInfo({ totalItemsCount, currentPage, itemsPerPage });

    // Assert
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.totalPageCount).toBe(5);
    expect(result.offset).toBe(50);
  });

  it('throws an error when totalItemsCount is not set and totalPageCount is accessed', () => {
    // Arrange
    const currentPage = 1;
    const itemsPerPage = 10;

    // Act
    const result = new PageInfo({ currentPage, itemsPerPage });

    // Assert
    expect(() => result.totalPageCount).toThrow(
      'totalItemsCount must be set to calculate totalPageCount',
    );
  });
});
