function initSpriteSheetAnimation() {
    var board = new Board();
    var slice = new AnimatedObject();
    var bugsBunny = new AnimatedObject();
    bugsBunny.intervalTimer = 300;

    slice.setAnimation({
        'animation': {
            'main': ['kreis-sprite1.png', 'kreis-sprite2.png',
                        'kreis-sprite3.png', 'kreis-sprite4.png',
                        'kreis-sprite5.png', 'kreis-sprite6.png',
                        'kreis-sprite7.png', 'kreis-sprite8.png',
                        'kreis-sprite9.png', 'kreis-sprite10.png']
        },
        'info': {
            'main' : '<ul><li>Space = Play/Stop</li><li>l = Schreibe nach links drehen</li><li>r = Schreibe nach rechts drehen</li></ul>'
        }
    });

    bugsBunny.setAnimation({
        'animation': {
            'main': ['bugs_bunny_muscle1.png', 'bugs_bunny_muscle2.png',
                        'bugs_bunny_muscle3.png', 'bugs_bunny_muscle4.png',
                        'bugs_bunny_muscle5.png', 'bugs_bunny_muscle6.png',
                        'bugs_bunny_muscle7.png', 'bugs_bunny_muscle8.png',
                        'bugs_bunny_muscle9.png', 'bugs_bunny_muscle10.png',
                        'bugs_bunny_muscle11.png', 'bugs_bunny_muscle12.png',
                        'bugs_bunny_muscle13.png', 'bugs_bunny_muscle14.png',
                        'bugs_bunny_muscle15.png', 'bugs_bunny_muscle16.png',
                        'bugs_bunny_muscle17.png'],

            'naughty': ['bugs_naughty_animation1.png', 'bugs_naughty_animation2.png',
                            'bugs_naughty_animation3.png', 'bugs_naughty_animation4.png',
                            'bugs_naughty_animation5.png']
        },
        'info': {
            'main': 'Pfeiltaste links 2. Animation.<br> [Quelle: http://www.spriters-resource.com/snes/bugsbunnyrabbitrampage/sheet/44964/]',
            'naughty': 'Pfeiltaste rechts 1. Animation. <br> [Quelle: http://www.spriters-resource.com/snes/bugsbunnyrabbitrampage/sheet/44964/]'
        }
    });

    board.bindKeyAnimations = function () {

        window.onkeydown = function (keyEvent) {
            var keyCode = keyEvent.keyCode;

            switch (keyCode) {

                case 32: //space bar

                    if (!slice.animationStatus) {
                        slice.animate();
                    } else {
                        slice.stopAnimation();
                    }
                    break;

                case 37: // left arrow
                    bugsBunny.animate('naughty');
                    break;

                case 39: // right arrow
                    bugsBunny.animate();
                    break;

                case 76: // l   
                    slice.currentFrame--;
                    slice.loadImage();
                    break;

                case 82: // r   
                    slice.currentFrame++;
                    slice.loadImage();
                    break;

            }
        }
    };

    board.appendObject(slice);
    board.appendObject(bugsBunny);
    board.create();
}

