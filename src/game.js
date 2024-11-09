import createKaplayContext from "./kaplayContext";

export async function init() {
    const k = createKaplayContext();
    k.loadSprite("player", "./content/characters/player.png", {});
}
