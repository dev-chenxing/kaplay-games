import createKaplayContext from "./kaplayContext";
import palette from "./palette";

export async function init() {
    const k = createKaplayContext();
    k.loadSprite("bag", "./sprites/bag.png");
    k.loadSprite("spike_grass", "/sprites/spike_grass.png");
    k.loadSprite("sun", "./sprites/sun.png");
    k.loadSprite("cloud", "./sprites/cloud.png");
    k.loadSprite("bean", "./sprites/bean.png");

    const sky_height = 300;
    const sky = k.add(["sky", k.rect(k.width(), sky_height), k.color(palette.blue), k.outline(4, palette.black), k.pos(k.vec2(0, 0)), k.z(-100), k.area(), k.body({ isStatic: true })]);
    const sun = sky.add([k.sprite("sun"), k.anchor("center"), k.pos(k.width() - 90, 90), k.rotate(), k.z(-100)]);
    sun.onUpdate(() => (sun.angle += k.dt() * 12));
    function spawnCloud() {
        const direction = k.choose([k.LEFT, k.RIGHT]);
        sky.add([k.sprite("cloud", { flipX: direction.eq(k.LEFT) }), k.move(direction, k.rand(20, 60)), k.offscreen({ destroy: true }), k.pos(direction.eq(k.LEFT) ? k.width() : 0, k.rand(-20, 180)), k.anchor("top"), k.z(-50)]);
        k.wait(k.rand(6, 12), spawnCloud);
    }
    spawnCloud();

    const ground = k.add(["ground", k.rect(k.width(), k.height() - sky_height), k.color(palette.green), k.outline(4, palette.black), k.pos(k.vec2(0, sky_height)), k.z(-100)]);
    // Adds 5 thousand sprites which can be a bean or a bag in random positions
    const sprites = [];

    for (let i = 0; i < 75; i++) {
        sprites.push({
            sprite: "spike_grass",
            pos: k.vec2(k.rand(0, k.width()), k.rand(0, k.height())),
            anchor: "center",
        });
    }

    ground.onDraw(() => {
        sprites.forEach((sprite) => {
            k.drawSprite(sprite);
        });
    });

    const player = k.add(["player", k.sprite("bag"), k.pos(k.width() / 2, k.height() / 2), k.anchor("center"), k.area({ shape: new k.Rect(k.vec2(0, 0), 48, 42) }), k.body(), { orientation: k.vec2(0, 0), speed: 200 }]);

    player.onUpdate(() => {
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
