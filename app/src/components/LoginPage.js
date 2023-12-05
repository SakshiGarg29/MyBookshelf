// Login Component
import React, { useReducer } from "react";

import Input from "./Input";
import Password from "./Password";

const initialState = {
  username: "",
  password: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "set-login-username":
      return { ...state, username: action.username };
    case "set-login-password":
      return { ...state, password: action.password };
    default:
      throw new Error();
  }
};

const LoginPage = ({ onExit, onError }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setUsernameValue = (username) =>
    dispatch({ type: "set-login-username", username });
  const setPasswordValue = (password) =>
    dispatch({ type: "set-login-password", password });
  const doLogin = () => {
    fetch(
      "/api/login?userid=" + state.username + "&password=" + state.password,
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

      <button className="btn btn-black" onClick={() => doLogin()}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
