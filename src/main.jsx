import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as game from "./game";
import UI from "./ui";
import "./index.css";

createRoot(document.getElementById("ui")).render(
    <StrictMode>
        <UI />
    </StrictMode>
);

game.init();
