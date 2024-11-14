import kaplay from "kaplay";
import palette from "./palette";
export default function createKaplayContext() {
  const k = kaplay({
    width: 1280,
    height: 720,
    letterbox: true,
    debug: true,
    font: "happy",
    pixelDensity: 2,
    canvas: document.getElementById("kaplay"),
    background: palette.black,
    touchToMouse: true,
    global: false
  });
  k.debug.inspect = false;
  return k;
}
