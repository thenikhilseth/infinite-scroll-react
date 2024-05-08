import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function BookSearch(query, pageNumber) {
  const controllerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    //If controller already exists on changeHandle
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    axios({
      method: "GET",
      url: "https://openlibrary.org/search.json",
      params: {
        q: query,
        page: pageNumber,
      },
      signal,
    })
      .then((response) => {
        console.log(response.data);
        setBooks((prevBooks) => {
          return [
            ...prevBooks,
            ...response.data.docs.map((book) => {
              return book.title;
            }),
          ];
        });
        setHasMore(response.data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        setError(true);
        if (axios.isCancel(e)) {
          //If the error is axios cancel error because of abort controller, don't display the error because we cancelled it intentionally
          return;
        }
        console.log("Data Fetching Error");
      });
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
}

export default BookSearch;
