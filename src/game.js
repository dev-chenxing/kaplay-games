import createKaplayContext from "./kaplayContext";

export async function init() {
    const k = createKaplayContext();
    k.setBackground([128, 180, 255]);
    k.loadSprite("bag", `./sprites/bag.png`);

    const player = k.add(["player", k.sprite("bag"), k.pos(k.center()), k.anchor("center"), k.area({ shape: new k.Rect(k.vec2(4, 2), 48, 42) }), k.body(), { orientation: k.vec2(0, 0) }]);
    player;
}
