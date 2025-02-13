import "./assets/main.css";

import { StrictMode } from "react";
import { Routes, Route, HashRouter } from "react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CreateFamilyMember from "./CreateFamilyMember";
import UpdateFamilyMember from "./UpdateFamilyMember";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <StrictMode>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create" element={<CreateFamilyMember />} />
        <Route path="/update" element={<UpdateFamilyMember />} />
      </Routes>
    </StrictMode>
  </HashRouter>,
);
