import kaplay from "kaplay";
export default function createKaplayContext() {
    return kaplay({
        global: false,
        pixelDensity: 2,
        touchToMouse: true,
        debug: true,
        debugKey: "`",
        canvas: document.getElementById("kaplay"),
    });
}
