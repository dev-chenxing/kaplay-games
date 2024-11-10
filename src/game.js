import createKaplayContext from "./kaplayContext";

export async function init() {
    const k = createKaplayContext();
    k.loadSprite("player", "./content/characters/player.png", {
        sliceX: 2,
        sliceY: 4,
        anims: {
            "walk-down-idle": 0,
            "walk-left-idle": 2,
            "walk-right-idle": 4,
            "walk-up-idle": 6,
        },
    });
    k.loadSprite("background", "./content/maps/0-0.png");

    const background = k.add([k.sprite("background", { width: k.width() }), k.pos(0, 0), k.fixed()]);
    background.add(["player", k.sprite("player", { width: 144 }), k.pos(1550, 400)]);
}
