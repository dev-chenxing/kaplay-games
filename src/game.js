import createKaplayContext from "./kaplayContext";

export async function init() {
  const k = createKaplayContext();
  k.setBackground([128, 180, 255]);
  k.loadSprite("bag", `./sprites/bag.png`);

  const player = k.add(["player", k.sprite("bag"), k.pos(k.center()), k.anchor("center"), k.area({ shape: new k.Rect(k.vec2(4, 2), 48, 42) }), k.body(), { orientation: k.vec2(0, 0), speed: 320 }]);

  player.onUpdate(() => {
    // Set the viewport center to player.pos
    k.camPos(player.worldPos());
  });
  k.onKeyDown("left", () => {
    player.move(-player.speed, 0);
    player.flipX = true;
  });
  k.onKeyDown("right", () => {
    player.move(player.speed, 0);
    player.flipX = false;
  });
  k.onKeyDown("up", () => player.move(0, -player.speed));
  k.onKeyDown("down", () => player.move(0, player.speed));
}
