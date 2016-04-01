AnimatedObject = function () {
    this.spriteImages = [];
    this.animations = [];
    this.animationInfo = '';
    this.currentFrame = 0;
    this.timerId = 0;
    this.intervalTimer = 200; // in ms
    this.animationStatus = false;   //false = stop, true = running
    this.boardPlace = '';
}

AnimatedObject.prototype.load = function (boardSlotId) {
    this.boardPlace = boardSlotId;
    this.animate();
}

AnimatedObject.prototype.setAnimation = function (animation) {
    this.animations.push(animation);
    return this;
}

AnimatedObject.prototype.animate = function (extraAnimation) {
    var self = this;
    var animation = (typeof extraAnimation === 'undefined') ? 'main' : extraAnimation;

    this.loadAnimation(animation);

    this.setAnimationInfo();
    this.timerId = setInterval(function () { self.startAnimationCycle(); }, self.intervalTimer);
    this.animationStatus = true;
}

AnimatedObject.prototype.loadAnimation = function (animation) {

    var animationName;
    for (var j = 0; j <= this.animations.length - 1; j++) {

        var objectAnimations = this.animations[j]['animation'];
        var animationInfos = this.animations[j]['info'];

        for (animationName in objectAnimations) {
            if (animationName === animation) {
                this.spriteImages = objectAnimations[animationName];
                this.animationInfo = animationInfos[animationName];
            }
        }
    }

    this.stopAnimation();//clear interval timer to avoid animation speed multiplication
}

AnimatedObject.prototype.setAnimationInfo = function () {
    var infoSlot = this.boardPlace + '-info';
    document.getElementById(infoSlot).innerHTML = this.animationInfo;
}

AnimatedObject.prototype.startAnimationCycle = function () {

    if (this.currentFrame > (this.spriteImages.length - 1)) {
        this.currentFrame = 0;
    }

    this.loadImage();

    this.currentFrame++;
}

AnimatedObject.prototype.stopAnimation = function () {
    clearInterval(this.timerId);
    this.animationStatus = false;
}

AnimatedObject.prototype.loadImage = function () {

    if (this.currentFrame > (this.spriteImages.length - 1)) {
        this.currentFrame = 0;
    }

    if (this.currentFrame < 0) {
        this.currentFrame = this.spriteImages.length - 1;
    }

    var self = this;
    var dir = '../images/';
    var imgSrc = dir + this.spriteImages[this.currentFrame];
    var currentImage = new Image();

    currentImage.onload = function () {
        var img = document.getElementById(self.boardPlace);
        img.setAttribute('src', this.src);
    };

    currentImage.src = imgSrc;
}
