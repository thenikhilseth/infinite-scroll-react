import { React, useState } from "react";
import "./App.css";
import BookSearch from "./components/BookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const changeHandler = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  BookSearch(query, pageNumber);

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Enter your query"
        value={query}
        onChange={changeHandler}
      ></input>
      <div>Title</div>
      <div>Title</div>
      <div>Title</div>
      <div>Title</div>
      <div>Loading...</div>
      <div>Error</div>
    </div>
  );
}

export default App;
