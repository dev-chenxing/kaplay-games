import kaplay from "kaplay";
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
        background: [31, 16, 42],
    });
    k.debug.inspect = true;
    return k;
}
