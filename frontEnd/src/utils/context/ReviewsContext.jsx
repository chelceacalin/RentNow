import { createContext, useContext, useState } from "react";

const ReviewsContext = createContext();

export const useReviewsContext = () => useContext(ReviewsContext);

export const ReviewsProvider = ({ children }) => {
  const [refreshReviews, setrefreshReviews] = useState(false);

  return (
    <ReviewsContext.Provider value={{ refreshReviews, setrefreshReviews }}>
      {children}
    </ReviewsContext.Provider>
  );
};
