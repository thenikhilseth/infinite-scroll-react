import { React, useCallback, useRef, useState } from "react";
import "./App.css";
import BookSearch from "./components/BookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();

  const changeHandler = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  //*********************** Logic to call API for getting Books based on the input query and Page Number */
  const { loading, error, books, hasMore } = BookSearch(query, pageNumber);

  //**********************The Main Logic of Infinite Scrolling*****************************************/
  const lastBookElementRef = useCallback(
    // Here the node referes to our last Book
    (node) => {
      if (loading) return; //If the loading is still on, it means we have more books and this is not the last book, so return
      if (observer.current) {
        // If the observer is observing previous node, disconnect it because we need to make new connection.
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          //If we have more books and it is intersecting with the root, +1 page number.
          //When the last book intersect with root (Matlab jab ham scroll ke bad last book pe phunch jaye)
          console.log("Visible");
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      }); //Creating intersection observer and setting it to current.
      if (node) observer.current.observe(node); //If last book exist, please observe it.
      console.log(node); //Print last book
    },
    [loading, hasMore]
  );

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Enter your query"
        value={query}
        onChange={changeHandler}
      ></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          //If it is the last book, create a reference and call our callback function to implement the infinite scrolling.
          return (
            <div ref={lastBookElementRef} key={index}>
              {book}
            </div>
          );
        }
        return <div key={index}>{book}</div>;
      })}
      <div>{loading ? "Loading..." : null}</div>
      <div>{error ? "Error" : null}</div>
    </div>
  );
}

export default App;
