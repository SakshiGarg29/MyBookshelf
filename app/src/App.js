import React, { useEffect, useReducer } from "react";
import Input from "./components/Input.js";
import SearchBooks from "./components/SearchBooks.js";
import BookCard from "./components/BookCard.js";
import LoginPage from "./components/LoginPage.js";
import SignupPage from "./components/SignupPage.js";

const initialState = {
  shelfedBook: [],
  searchKeyword: "",
  showUI: "show-login",
  user: {},
  error: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "search-books":
      return { ...state, bookSearchResult: action.data };
    case "find-books":
      return { ...state, showUI: "show-searched-books" };
    case "shelfed-books":
      let newuser = state.user;
      let newinterests = [];
      action.data.forEach((element) => {
        newinterests.push(element.selfLink);
      });
      newuser.interestedIn = newinterests;
      return { ...state, shelfedBook: action.data, user: newuser };
    case "show-signup-page":
      return { ...state, showUI: "show-signup" };
    case "show-login-page":
      return {
        ...state,
        showUI: "show-login",
        user: {},
        shelfedBook: [],
        searchKeyword: "",
      };
    case "success-user-login":
      return {
        ...state,
        showUI: "home-view",
        user: action.data,
      };
    case "exit-search":
      return {
        ...state,
        showUI: "home-view",
      };
    case "set-search-keyword":
      return {
        ...state,
        searchKeyword: action.keyword,
      };
    case "exit-add-error":
      return {
        ...state,
        showUI: "show-login-error",
        error: "Wrong credentials unable to login !",
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const filterBooks = (keyword) =>
    dispatch({ type: "set-search-keyword", keyword });
  console.log(state.user);
  useEffect(() => {
    console.log(state.user);
    if (state.user && state.user.username)
      fetch("/api/shelf/find?userid=" + state.user.username, { mode: "cors" })
        .then((res) => res.json())
        .then((data) => dispatch({ type: "shelfed-books", data }));
  }, [state.user]);
  return (
    <div className="my-bookshelf">
      <h1>Your Book Shelf</h1>
      {(state.showUI === "show-login" ||
        state.showUI === "show-login-error") && (
        <div className="box">
          <div id="login">
            Please login
            <LoginPage
              onExit={(data) => dispatch({ type: "success-user-login", data })}
              onError={() => dispatch({ type: "exit-add-error" })}
            />
          </div>

          <div
            id="tosignup"
            onClick={() => dispatch({ type: "show-signup-page" })}
          >
            Or Signup
          </div>
        </div>
      )}
      {state.showUI === "show-login-error" && (
        <div className="error-message">{state.error}</div>
      )}
      {state.showUI === "show-signup" && (
        <div>
          <div id="signup">Signup Here</div>
          <SignupPage
            onExit={(data) => dispatch({ type: "success-user-login", data })}
            onError={() => dispatch({ type: "exit-add-error" })}
          />
          <div
            id="tologin"
            onClick={() => dispatch({ type: "show-login-page" })}
          >
            Or Login
          </div>
        </div>
      )}
      {state.showUI === "home-view" && (
        <div id="home-view">
          <div className="myuser">
            Welcome:{" "}
            <div className="username">{state.user.name.toUpperCase()}</div>
            <div className="logout logout-hover">
              <button
                className="btn btn-green small-btn"
                onClick={() => dispatch({ type: "show-login-page" })}
              >
                Logout
              </button>{" "}
            </div>
          </div>
          <div id="controls">
            <Input
              label="FIND BOOKS"
              placeholder="Type book name or keyword and click SearchBooks button"
              onInput={(evt) => filterBooks(evt.target.value)}
              value={state.searchKeyword}
            />
            <button
              className="btn btn-black search-hover"
              onClick={() => dispatch({ type: "find-books" })}
            >
              SearchBooks
            </button>
          </div>
          <div id="shelfbooks">
            {state.shelfedBook && (
              <div id="home-view">
                {state.shelfedBook.length > 0 &&
                  state.shelfedBook.map((data) => (
                    <BookCard
                      key={data.id}
                      data={data}
                      isFav={"true"}
                      user={state.user}
                      onRemoveRefresh={() => {
                        setTimeout(
                          () =>
                            fetch(
                              "/api/shelf/find?userid=" + state.user.username,
                              { mode: "cors" }
                            )
                              .then((res) => res.json())
                              .then((data) =>
                                dispatch({ type: "shelfed-books", data })
                              )
                              .then(() => dispatch({ type: "exit-search" })),
                          2000
                        );
                      }}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* onBack={() => dispatch({ type: "exit-search" })} */}
      {state.showUI === "show-searched-books" && (
        <SearchBooks
          searchText={state.searchKeyword}
          userdata={state.user}
          onBack={() => {
            fetch("/api/shelf/find?userid=" + state.user.username, {
              mode: "cors",
            })
              .then((res) => res.json())
              .then((data) => dispatch({ type: "shelfed-books", data }))
              .then(() => dispatch({ type: "exit-search" }));
          }}
        />
      )}
    </div>
  );
};

export default App;
