import createKaplayContext from "./kaplayContext";
import palette from "./palette";

export async function init() {
    const k = createKaplayContext();

    // load assets
    k.loadSprite("bag", "./sprites/bag.png");
    k.loadSprite("spike_grass", "/sprites/spike_grass.png");
    k.loadSprite("sun", "./sprites/sun.png");
    k.loadSprite("cloud", "./sprites/cloud.png");
    k.loadSprite("bean", "./sprites/bean.png");
    k.loadSprite("grass", "./sprites/grass.png");
    k.loadSprite("dirt", "./sprites/dirt.png");
    k.loadBitmapFont("happy", "./fonts/happy_28x36.png", 28, 36);

    // draw sky
    const skyHeight = 300;
    const sky = k.add(["sky", k.rect(k.width(), k.height()), k.color(palette.BLUE), k.pos(0), k.z(-100), k.area({ cursor: "default" }, k.fixed())]);
    const sun = sky.add([k.sprite("sun"), k.anchor("center"), k.pos(k.width() - 90, 50), k.rotate(), k.z(-100)]);
    sun.onUpdate(() => (sun.angle += k.dt() * 12));
    function spawnCloud() {
        const direction = k.choose([k.LEFT, k.RIGHT]);
        sky.add([k.sprite("cloud", { flipX: direction.eq(k.LEFT) }), k.move(direction, k.rand(20, 60)), k.offscreen({ destroy: true }), k.pos(direction.eq(k.LEFT) ? k.width() : 0, k.rand(-20, skyHeight - 20)), k.anchor("bot"), k.z(-50)]);
        k.wait(k.rand(6, 12), spawnCloud);
    }
    spawnCloud();

    // draw levels
    k.setGravity(2400);
    k.addLevel(
        [
            // Design the level layout with symbols
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "====================",
            "--------------------",
        ],
        {
            // The size of each grid
            tileWidth: 64,
            tileHeight: 64,
            // The position of the top left block
            pos: k.vec2(0),
            // Define what each symbol means (in components)
            tiles: {
                "=": () => [k.sprite("grass"), k.area(), k.body({ isStatic: true })],
                "-": () => [k.sprite("dirt")],
            },
        }
    );

    // player
    const player = k.add(["player", k.sprite("bean"), k.pos(k.center()), k.anchor("bot"), k.area(), k.body({ jumpForce: 800 }), { orientation: k.vec2(0, 0), speed: 200, isTalking: false }]);

    // // player movements
    player.onUpdate(() => {
        player.orientation = player.orientation.unit();
        if (!player.isTalking) {
            if (player.orientation.x == -1) player.flipX = true;
            else if (player.orientation.x == 1) player.flipX = false;
            player.move(player.orientation.scale(player.speed));
        }
    });
    k.onKeyDown("left", () => (player.orientation.x = -1));
    k.onKeyDown("right", () => (player.orientation.x = 1));
    k.onKeyRelease("left", () => (player.orientation.x = 0));
    k.onKeyRelease("right", () => (player.orientation.x = 0));
    k.onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump();
        }
    });

    // npcs
    const bag = k.add(["bag", k.sprite("bag"), k.pos(400, 600), k.area(), k.body(), k.state("idle", ["idle", "wander"]), { orientation: k.vec2(0, 0), speed: 50, isTalking: false }]);
    bag.onStateEnter("idle", async () => {
        await k.wait(5);
        bag.enterState("wander");
    });
    bag.onStateEnter("wander", async () => {
        bag.orientation = k.vec2(k.rand(-1, 1), 0).unit();
        await k.wait(5);
        bag.enterState("idle");
    });
    bag.onStateUpdate("wander", async () => {
        if (!bag.isTalking) bag.move(bag.orientation.scale(bag.speed));
    });

    let currentDialog = 0;
    const dialogs = [["[default]Ohhi! I'm just here to say that[/default] [kaplay]KAPLAY[/kaplay] [default]is awesome![/default]"]];
    // textbox
    const textbox = k.add([k.rect(k.width() - 140, 140, { radius: 4 }), k.anchor("center"), k.pos(k.center().x, 500), k.outline(4), k.z(99), { target: null }]);
    textbox.hidden = true;
    const text = textbox.add([
        k.text("Hello World", {
            size: 32,
            width: textbox.width - 230,
            align: "center",
            styles: {
                default: {
                    color: palette.BLACK,
                },
                kaplay: (idx) => ({
                    color: k.Color.fromArray(palette.LIGHT_GREEN),
                    pos: k.vec2(0, k.wave(-4, 4, k.time() * 4 + idx * 0.5)),
                    scale: k.wave(1, 1.2, k.time() * 3 + idx),
                    angle: k.wave(-9, 9, k.time() * 3 + idx),
                }),
            },
            transform: (idx) => {
                return {
                    opacity: idx < text.letterCount ? 1 : 0,
                };
            },
        }),
        k.pos(0),
        k.anchor("center"),
        {
            letterCount: 0,
        },
    ]);
    function startWriting(dialog) {
        text.letterCount = 0;
        text.text = dialog;

        const writing = k.loop(0.1, () => {
            text.letterCount = Math.min(text.letterCount + 1, text.renderedText.length);

            if (text.letterCount === text.renderedText.length) {
                writing.cancel();
            }
        });
    }
    // Update the on screen sprite & text
    function activateDialog(target) {
        player.isTalking = true;
        textbox.target = target;
        textbox.target.isTalking = true;
        textbox.hidden = false;
        const [dialog] = dialogs[currentDialog];
        startWriting(dialog);
    }
    function deactivateDialog() {
        if (!textbox.hidden) {
            player.isTalking = false;
            textbox.target.isTalking = false;
            textbox.target = null;
            textbox.hidden = true;
        }
    }

    k.onKeyDown("space", () => deactivateDialog());

    bag.onCollide("player", () => {
        activateDialog(bag);
    });

    // buttons
    function addButton(parent = k, text = "button", position = k.vec2(200, 100), callback = () => k.debug.log("button clicked")) {
        const btn = parent.add([k.rect(240, 80, { radius: 8 }), k.pos(position), k.area({ cursor: "pointer" }), k.scale(1), k.anchor("center"), k.outline(4)]);
        btn.add([k.text(text), k.anchor("center"), k.color(palette.BLACK)]);
        btn.onHoverUpdate(() => {
            const t = k.time() * 10;
            btn.color = k.hsl2rgb((t / 10) % 1, 0.6, 0.7);
            btn.scale = k.vec2(1.2);
        });
        btn.onHoverEnd(() => {
            btn.scale = k.vec2(1);
            btn.color = k.rgb();
        });
        btn.onClick(callback);
        return btn;
    }
    addButton(k, "Start", k.vec2(200, 100), () => k.addKaboom(k.toWorld(k.mousePos())));
    addButton(k, "Quit", k.vec2(200, 200), () => k.debug.log("bye"));
}
