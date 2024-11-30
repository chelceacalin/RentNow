import {
  Box,
  MenuItem,
  Pagination as MuiPagination,
  Select,
} from "@mui/material";

const Pagination = ({
  pageNo,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <Box className="pagination ">
      <div className="flex items-center">
        <span className="mr-2">Results per page:</span>
        <Select
          value={pageSize}
          onChange={onPageSizeChange}
          variant="outlined"
          size="small"
          className="bg-white-text-black"
        >
          {[5, 10, 15, 20].map((elem) => (
            <MenuItem key={elem} value={elem}>
              {elem}
            </MenuItem>
          ))}
        </Select>
      </div>
      <MuiPagination
        count={totalPages}
        page={pageNo}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        variant="text"
        sx={{
          "& .MuiPaginationItem-root": {
            color: "white",
          },
        }}
      />
      <div className="flex items-center"></div>
    </Box>
  );
};

export default Pagination;
