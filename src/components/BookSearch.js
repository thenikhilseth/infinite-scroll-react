import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function BookSearch(query, pageNumber) {
  const controllerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  //If query changes, delete the output of previous seach query and display results based on new query rather than appending the results.
  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true); //Set loading to true
    setError(false);

    /*** Abort controller Logic */
    //If controller already exists on changeHandle
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    /**Calling API Logic*****/
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
        setHasMore(response.data.docs.length > 0); //To check if we have more books to load.
        setLoading(false); // Set Loading to false when the whole single page is completed.
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          //If the error is axios cancel error because of abort controller, don't display the error because we cancelled it intentionally
          return;
        }
        setError(true);
        console.log("Data Fetching Error");
      });
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
}

export default BookSearch;
