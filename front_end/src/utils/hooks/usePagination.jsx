import { useCallback, useState } from "react";

export const usePagination = () => {
  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 15,
    totalPages: 1,
  });

  const handlePageChange = useCallback((newPageNo) => {
    setPagination((prev) => ({
      ...prev,
      pageNo: newPageNo,
    }));
  }, []);

  const handlePageSizeChange = useCallback((event) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      pageNo: 1,
    }));
  }, []);

  const setTotalPages = (totalPages) => {
    setPagination((prev) => ({
      ...prev,
      totalPages: totalPages,
    }));
  };

  return {
    pagination,
    handlePageChange,
    handlePageSizeChange,
    setTotalPages,
  };
};
