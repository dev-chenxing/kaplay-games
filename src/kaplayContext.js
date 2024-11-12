import kaplay from "kaplay";
export default function createKaplayContext() {
    const k = kaplay({
        global: false,
        pixelDensity: 2,
        touchToMouse: true,
        debug: true,
        canvas: document.getElementById("kaplay"),
    });
    k.debug.inspect = true;
    return k;
}
