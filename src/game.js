import createKaplayContext from "./kaplayContext";

export async function init() {
  const k = createKaplayContext();
  k.setBackground([128, 180, 255]);
  k.loadSprite("bag", `./sprites/bag.png`);

  const player = k.add(["player", k.sprite("bag"), k.pos(k.center()), k.anchor("center"), k.area({ shape: new k.Rect(k.vec2(4, 2), 48, 42) }), k.body(), { orientation: k.vec2(0, 0), speed: 160 }]);

  player.onUpdate(() => {
    // Set the viewport center to player.pos
    // k.camPos(player.worldPos());

    player.orientation = player.orientation.unit();
    player.move(player.orientation.scale(player.speed));
  });
  k.onKeyDown("left", () => {
    player.orientation.x = -1;
    player.flipX = true;
  });
  k.onKeyDown("right", () => {
    player.orientation.x = 1;
    player.flipX = false;
  });
  k.onKeyDown("up", () => (player.orientation.y = -1));
  k.onKeyDown("down", () => (player.orientation.y = 1));
  k.onKeyRelease("left", () => (player.orientation.x = 0));
  k.onKeyRelease("right", () => (player.orientation.x = 0));
  k.onKeyRelease("up", () => (player.orientation.y = 0));
  k.onKeyRelease("down", () => (player.orientation.y = 0));
}
