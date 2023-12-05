import React, { useEffect, useReducer } from "react";
import BookCard from "./BookCard";

const initialState = {
  bookSearchResult: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "searched-books":
      return { ...state, bookSearchResult: action.data };

    default:
      throw new Error();
  }
};

const SearchBooks = ({ searchText, userdata, onBack }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    fetch(`/api/search-books?search=${searchText}`, {
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => dispatch({ type: "searched-books", data }));
  }, [searchText]);

  return (
    <div className="my-bookshelf">
      <div id="backbtn">
        <button className="btn small-btn btn-black" onClick={() => onBack()}>
          Back
        </button>
      </div>
      {state.bookSearchResult.items && (
        <div id="home-view">
          {state.bookSearchResult.items.length > 0 &&
            state.bookSearchResult.items.map((data) => (
              <BookCard
                key={data.id}
                data={data}
                isFav={"false"}
                user={userdata}
                onRemoveRefresh={() => {}}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBooks;
