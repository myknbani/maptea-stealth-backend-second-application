import { createPaginationMetadata } from './create-pagination-metadata';

describe('createPaginationMetadata', () => {
  it('returns correct metadata for the first page', () => {
    // Arrange
    const totalItemsCount = 100;
    const currentPage = 1;
    const itemsPerPage = 10;

    // Act
    const result = createPaginationMetadata(totalItemsCount, currentPage, itemsPerPage);
    // Assert
    expect(result).toEqual({
      totalItemsCount: 100,
      hasNextPage: true,
      hasPreviousPage: false,
      totalPageCount: 10,
    });
  });

  it('returns correct metadata for the last page', () => {
    // Arrange
    const totalItemsCount = 100;
    const currentPage = 10;
    const itemsPerPage = 10;

    // Act
    const result = createPaginationMetadata(totalItemsCount, currentPage, itemsPerPage);
    // Assert
    expect(result).toEqual({
      totalItemsCount: 100,
      hasNextPage: false,
      hasPreviousPage: true,
      totalPageCount: 10,
    });
  });

  it('returns correct metadata for the last page, when itemsPerPage does not divide totalItemsCount evenly', () => {
    // Arrange
    const totalItemsCount = 95;
    const currentPage = 10; // Last page
    const itemsPerPage = 10;

    // Act
    const result = createPaginationMetadata(totalItemsCount, currentPage, itemsPerPage);

    // Assert
    expect(result).toEqual({
      totalItemsCount: 95,
      hasNextPage: false,
      hasPreviousPage: true,
      totalPageCount: 10,
    });
  });

  it('returns correct metadata for a middle page', () => {
    // Arrange
    const totalItemsCount = 100;
    const currentPage = 5;
    const itemsPerPage = 10;

    // Act
    const result = createPaginationMetadata(totalItemsCount, currentPage, itemsPerPage);
    // Assert
    expect(result).toEqual({
      totalItemsCount: 100,
      hasNextPage: true,
      hasPreviousPage: true,
      totalPageCount: 10,
    });
  });

  it('returns correct metadata when there are no items', () => {
    // Arrange
    const totalItemsCount = 0;
    const currentPage = 1;
    const itemsPerPage = 10;

    // Act
    const result = createPaginationMetadata(totalItemsCount, currentPage, itemsPerPage);
    // Assert
    expect(result).toEqual({
      totalItemsCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      totalPageCount: 0,
    });
  });

  it('returns correct metadata when itemsPerPage is greater than totalItemsCount', () => {
    // Arrange
    const totalItemsCount = 5;
    const currentPage = 1;
    const itemsPerPage = 10;

    // Act
    const result = createPaginationMetadata(totalItemsCount, currentPage, itemsPerPage);
    // Assert
    expect(result).toEqual({
      totalItemsCount: 5,
      hasNextPage: false,
      hasPreviousPage: false,
      totalPageCount: 1,
    });
  });

  it('returns correct metadata when currentPage is greater than totalPageCount', () => {
    // Arrange
    const totalItemsCount = 50;
    const currentPage = 6; // More than total pages
    const itemsPerPage = 10;

    // Act
    const result = createPaginationMetadata(totalItemsCount, currentPage, itemsPerPage);
    // Assert
    expect(result).toEqual({
      totalItemsCount: 50,
      hasNextPage: false,
      hasPreviousPage: true,
      totalPageCount: 5,
    });
  });
});
