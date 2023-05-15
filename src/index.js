import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reducer, { initialState } from "./reducer";
import { StateProvider } from "./StateProvider";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
