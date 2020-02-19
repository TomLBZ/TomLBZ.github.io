function main() {
    var canvasWidth = 1200;
    var canvasHeight = 700;

    var Engine = Matter.Engine;
    var Render = Matter.Render;
    var World = Matter.World;
    var Bodies = Matter.Bodies;
    var Constraint = Matter.Constraint;
    var MouseConstraint = Matter.MouseConstraint;
    var Mouse = Matter.Mouse;
    var engine = Engine.create();

    var render = Render.create({
        element: document.querySelector("#main-canvas-element"),
        engine: engine,
        options: {
            width: canvasWidth,
            height: canvasHeight,
            background: '#ffffff',
            showAngleIndicator: false,
            wireframes: false
        }
    });

    var boxAWidth = 538;
    var boxAHeight = 538;
    var boxAOffsetY = -100;
    var boxConstraintMargin = 10;
    var constraintStyle = {
        strokeStyle: 'lightgray',
        lineWidth: 2
    };
    var boxA = Bodies.rectangle(canvasWidth / 2, canvasHeight / 2 + boxAOffsetY, boxAWidth, boxAHeight, {
        density: 0.1,
        frictionAir: 0.000000,
        restitution: 0.2,
        friction: 0.5,
        render: {
            sprite: {
                texture: './images/GreenVortex_01.png'
            }
        }
    });
    var constraint1 = Constraint.create({
        pointA: { x: canvasWidth / 2, y: 20 },
        bodyB: boxA,
        pointB: { x: - (boxAWidth / 4 - boxConstraintMargin), y: - (boxAHeight / 2 - boxConstraintMargin) },
        // stiffness: 0.5,
        damping: 0.01,
        render: constraintStyle
    });
    var constraint2 = Constraint.create({
        pointA: { x: canvasWidth / 2, y: 20 },
        bodyB: boxA,
        pointB: { x: (boxAWidth / 4 - boxConstraintMargin), y: - (boxAHeight / 2 - boxConstraintMargin) },
        // stiffness: 0.5,
        damping: 0.02,
        render: constraintStyle
    });
    World.add(engine.world, [boxA, constraint1, constraint2]);

    function addMouseControl() {
        var mouse = Mouse.create(render.canvas);
        var mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                // allow bodies on mouse to rotate
                angularStiffness: 0,
                render: {
                    visible: false
                }
            }
        });
        World.add(engine.world, mouseConstraint);
    }

    function buildBalls() {
        let balls = [];
        let ballMargin = 270;
        let ballBottomMargin = 120;
        let ballVerticalSpan = 120;
        let ballRadius = 20;
        let pixelBallRadius = 128;

        let firstBallX = ballMargin;
        let firstBallY = canvasHeight - ballBottomMargin - ballVerticalSpan;
        let lastBallX = canvasWidth - ballMargin;
        let MiddleBallY = canvasHeight - ballBottomMargin;

        //let words = "HAPPY22THBIRTHDAY";
        function ithBallX(idx) {
            return firstBallX + (lastBallX - firstBallX) * (idx / (words.length - 1));
        }
        function ithBallY(idx) {
            let midium = 0.5;
            let maxRatio = 2 * (midium - Math.abs(midium - (idx / (words.length - 1))));
            return firstBallY + (MiddleBallY - firstBallY) * maxRatio;
        }
        for (let i = 0; i < 14; i++) {//for (let i = 0; i < words.length; i++) {
            console.log("# Add Ball", ithBallX(i), ithBallY(i));
            var ball = Bodies.circle(ithBallX(i), ithBallY(i), ballRadius, {
                density: 0.2,
                frictionAir: 0.001,
                restitution: 0.20,
                friction: 0.01,
                render: {
                    sprite: {
                        //texture: './img/' + '[' + i + ']' + words[i] + '.png',
                        texture: './images/BadgeLogo.scale-100.png',
                        xScale: ballRadius / pixelBallRadius,
                        yScale: ballRadius / pixelBallRadius
                    }
                }
            });

            let randVec = { x: Math.random() * 8 - 4, y: 0 };
            Matter.Body.setVelocity(ball, randVec);

            var constraint = Constraint.create({
                bodyA: boxA,
                pointA: { x: ithBallX(i) - canvasWidth / 2, y: boxAHeight / 2 - 10 },
                bodyB: ball,
                pointB: { x: 0, y: -12 },
                // stiffness: 0.2,
                damping: 0.02,
                render: constraintStyle
            });
            balls.push(ball);
            balls.push(constraint);
        }
        console.log(balls);
        return balls;
    }
    var grounds = [];
    var ground1 = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 40, {
        isStatic: true
    });
    var ground2 = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 40, {
        isStatic: true
    });
    var ground3 = Bodies.rectangle(0, canvasHeight / 2, 40, canvasHeight, {
        isStatic: true
    });
    var ground4 = Bodies.rectangle(canvasWidth, canvasHeight / 2, 40, canvasHeight, {
        isStatic: true
    });
    grounds.push(ground1);
    grounds.push(ground2);
    grounds.push(ground3);
    grounds.push(ground4);
    // World.add(engine.world, grounds);
    World.add(engine.world, buildBalls());
    addMouseControl();
    Engine.run(engine);
    Render.run(render);
};

main();