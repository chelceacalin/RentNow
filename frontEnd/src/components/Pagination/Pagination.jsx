import React from 'react';
import { Box, Button, Select, MenuItem, Pagination as MuiPagination } from '@mui/material';

const Pagination = ({
  pageNo,
  totalPages,
  updatePageNumber,
  handleSelectChange,
  pageSize
}) => {
  const getPreviousPage = () => {
    if (pageNo > 1) updatePageNumber(pageNo - 1);
  };

  const getNextPage = () => {
    if (pageNo < totalPages) updatePageNumber(pageNo + 1);
  };

  const handlePageClick = (pageNumber) => {
    updatePageNumber(pageNumber);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="primary.main" color="white">
      <Box display="flex" alignItems="center">
        <Box mr={2}>Results per page:</Box>
        <Select
          value={pageSize}
          onChange={handleSelectChange}
          variant="outlined"
          size="small"
          style={{ backgroundColor: 'white', color: 'black' }}
        >
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>
      </Box>
      <MuiPagination
        count={parseInt(totalPages, 10)}
        page={pageNo}
        onChange={(_, value) => handlePageClick(value)}
        color="secondary"
        variant="outlined"
      />
      <Box display="flex" alignItems="center">
        <Button variant="contained" color="secondary" onClick={getPreviousPage}>
          Previous
        </Button>
        <Button variant="contained" color="secondary" onClick={getNextPage} style={{ marginLeft: '8px' }}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Pagination;
