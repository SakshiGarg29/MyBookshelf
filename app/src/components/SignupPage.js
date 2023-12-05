// Login Component
import React, { useReducer } from "react";

import Input from "./Input";
import Password from "./Password";

const initialState = {
  username: "",
  password: "",
  name: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "set-login-username":
      return { ...state, username: action.username };
    case "set-login-password":
      return { ...state, password: action.password };
    case "set-login-name":
      return { ...state, name: action.name };
    default:
      throw new Error();
  }
};

const SignupPage = ({ onExit, onError }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setUsernameValue = (username) =>
    dispatch({ type: "set-login-username", username });
  const setPasswordValue = (password) =>
    dispatch({ type: "set-login-password", password });
  const setNameValue = (name) => dispatch({ type: "set-login-name", name });
  const doSigup = () => {
    fetch(
      "/api/signup?userid=" +
        state.username +
        "&password=" +
        state.password +
        "&name=" +
        state.name,
      {
        mode: "cors",
        method: "POST",
        body: JSON.stringify({ password: state.password }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          onExit(data[0]);
        } else {
          onError();
        }
      });
  };
  return (
    <div id="loginform">
      <Input
        label="UserName"
        onInput={(evt) => setUsernameValue(evt.target.value)}
        value={state.username}
      />

      <Password
        id="pswd"
        label="Password"
        onInput={(evt) => setPasswordValue(evt.target.value)}
        value={state.password}
      />

      <Input
        id="name"
        label="Name"
        onInput={(evt) => setNameValue(evt.target.value)}
        value={state.name}
      />

      <button className="btn btn-black" onClick={() => doSigup()}>
        Signup
      </button>
    </div>
  );
};

export default SignupPage;
