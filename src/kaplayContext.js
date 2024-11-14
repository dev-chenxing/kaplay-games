import kaplay from "kaplay";
import palette from "./palette";
export default function createKaplayContext() {
    const k = kaplay({
        global: false,
        pixelDensity: 2,
        touchToMouse: true,
        debug: true,
        canvas: document.getElementById("kaplay"),
        width: 1280,
        height: 720,
        letterbox: true,
        background: palette.black,
        font: "happy",
    });
    k.debug.inspect = true;
    return k;
}
