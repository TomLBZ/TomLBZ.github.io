function genpic(element,w,h,pixpicwidth,pixpicheight,ballnum,pixballrad,ballinitialv,groundconst) {
    var canvasWidth=w;
    var canvasHeight=h;
    var picwidth = canvasWidth*0.75;
    var picheight = canvasHeight*0.75;
    var picoffset = picheight * -0.06;
    var boxcstrmargin = picwidth*0.01;
    var hangpoint = picheight*0.01;

    var ballrad = picwidth *0.05;
    var ballbtmmargin = picwidth*0.2;
    var ballvertspan=picheight*0.2;
    var ballxrange=picwidth;
    var ballhangptfrombtm = picheight*0.01;

    var Engine = Matter.Engine;
    var Render = Matter.Render;
    var World = Matter.World;
    var Bodies = Matter.Bodies;
    var Constraint = Matter.Constraint;
    var MouseConstraint = Matter.MouseConstraint;
    var Mouse = Matter.Mouse;
    var engine = Engine.create();

    var render = Render.create({
        element: element,
        engine: engine,
        options: {
            width: canvasWidth,
            height: canvasHeight,
            background: '#000000',
            showAngleIndicator: false,
            wireframes: false
        }
    });

    var boxAWidth = picwidth;
    var boxAHeight = picheight;
    var boxAOffsetY = picoffset;
    var boxConstraintMargin = boxcstrmargin;
    var constraintStyle = {
        strokeStyle: 'lightgray',
        lineWidth: 2
    };
    var boxA = Bodies.rectangle(canvasWidth / 2, canvasHeight / 2 + boxAOffsetY, boxAWidth, boxAHeight, {
        density: 0.1,
        frictionAir: 0.000000,
        restitution: 0.2,
        friction: 0.2,
        render: {
            sprite: {
                texture: './images/GreenVortex_01.png',
                xScale: picwidth / pixpicwidth,
                yScale: picheight / pixpicheight
            }
        }
    });
    var constraint1 = Constraint.create({
        pointA: { x: canvasWidth / 2, y: hangpoint },
        bodyB: boxA,
        pointB: { x: - (boxAWidth / 4 - boxConstraintMargin), y: - (boxAHeight / 2 - boxConstraintMargin) },
        // stiffness: 0.5,
        damping: 0.02,
        render: constraintStyle
    });
    var constraint2 = Constraint.create({
        pointA: { x: canvasWidth / 2, y: hangpoint },
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
        let ballMargin = ballxrange;
        let ballBottomMargin = ballbtmmargin;
        let ballVerticalSpan = ballvertspan;
        let ballRadius = ballrad;
        let pixelBallRadius = pixballrad;

        let firstBallX = ballMargin;
        let firstBallY = canvasHeight - ballBottomMargin - ballVerticalSpan;
        let lastBallX = canvasWidth - ballMargin;
        let MiddleBallY = canvasHeight - ballBottomMargin;

        function ithBallX(idx) {
            return firstBallX + (lastBallX - firstBallX) * (idx / (ballnum - 1));
        }
        function ithBallY(idx) {
            let midium = 0.5;
            let maxRatio = 1 * (midium - Math.abs(midium - (idx / (ballnum - 1))));
            return firstBallY + (MiddleBallY - firstBallY) * maxRatio;
        }
        for (let i = 0; i < ballnum; i++) {
            console.log("# Add Ball", ithBallX(i), ithBallY(i));
            var ball = Bodies.rectangle(ithBallX(i), ithBallY(i), ballRadius, ballRadius, {
                density: 0.2,
                frictionAir: 0.002,
                restitution: 0.20,
                friction: 0.02,
                render: {
                    sprite: {
                        //texture: './img/' + '[' + i + ']' + words[i] + '.png',
                        texture: './images/Square44x44Logo.targetsize-24_altform-unplated.png',
                        xScale: ballRadius / pixelBallRadius,
                        yScale: ballRadius / pixelBallRadius
                    }
                }
            });

            let randVec = { x: Math.random() * ballinitialv - ballinitialv*0.5, y: 0 };
            Matter.Body.setVelocity(ball, randVec);

            var constraint = Constraint.create({
                bodyA: boxA,
                pointA: { x: ithBallX(i) - canvasWidth / 2, y: boxAHeight / 2 - ballhangptfrombtm },
                bodyB: ball,
                pointB: { x: 0, y: -10 },
                // stiffness: 0.2,
                damping: 0.1,
                render: constraintStyle
            });
            balls.push(ball);
            balls.push(constraint);
        }
        console.log(balls);
        return balls;
    }
    var grounds = [];
    var ground1 = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, groundconst, {
        isStatic: true
    });
    var ground2 = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, groundconst, {
        isStatic: true
    });
    var ground3 = Bodies.rectangle(0, canvasHeight / 2, groundconst, canvasHeight, {
        isStatic: true
    });
    var ground4 = Bodies.rectangle(canvasWidth, canvasHeight / 2, groundconst, canvasHeight, {
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

function main(){
    var pixpicwidth = 538;
    var pixpicheight=538;
    var pixballrad = 22;
    var groundconst = 40;
    var ballinitialv = 4;
    var numball = 7;
    var maincanvasel=document.getElementById("main-canvas-element");
    var oldpicwidth = maincanvasel.clientWidth;
    var oldpicheight = oldpicwidth;
    var neww,newh;
    genpic(maincanvasel,oldpicwidth,oldpicheight,pixpicwidth,pixpicheight,numball,pixballrad,ballinitialv,groundconst);

    var rs = new ResizeSensor(maincanvasel, function(){ 
        neww = document.getElementById("main-canvas-element").clientWidth;
        newh = neww;
        var canv = maincanvasel.getElementsByTagName("canvas");
        if (neww != oldpicwidth) {
            console.log('content dimension changed');
            oldpicwidth = neww;
            oldpicheight=newh;
            genpic(maincanvasel,neww,newh,pixpicwidth,pixpicheight,numball,pixballrad,ballinitialv,groundconst);
        }
        while(canv.length > 1) canv[0].remove();
    });
}

main();