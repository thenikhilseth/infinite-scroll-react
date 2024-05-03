import React, { useEffect } from "react";
import axios from "axios";

function BookSearch(query, pageNumber) {
  useEffect(() => {
    axios({
      method: "GET",
      url: "https://openlibrary.org/search.json",
      params: {
        q: query,
        page: pageNumber,
      },
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [query, pageNumber]);

  return null;
}

export default BookSearch;
