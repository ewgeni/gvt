Board = function () {
    this.boardHtmlAreaId = 'animationBoard';
    this.boardHtmlArea = '<div id="'+ this.boardHtmlAreaId +'"></div>';
    this.objects = [];
}

Board.prototype.create = function () {
    this.appendToDocumentBody();

    for (var i = 0; i < this.objects.length; i++) {
        var currentObj = this.objects[i];
        var slotId = this.addSlot(i);
        currentObj.load(slotId);
    }

    this.bindKeyAnimations();
}

Board.prototype.appendToDocumentBody  = function () {
    document.body.innerHTML += this.boardHtmlArea;
}

Board.prototype.appendObject = function (object) {
    this.objects.push(object);
    return this;
}

Board.prototype.bindKeyAnimations = function () {
}

Board.prototype.addSlot = function (objectNr) {
    var boardSlotId = 'slot' + objectNr;
    var slotContainer = this.buildSlotContainerWithContent(boardSlotId);

    document.getElementById(this.boardHtmlAreaId).appendChild(slotContainer);

    return boardSlotId;
}

Board.prototype.buildSlotContainerWithContent = function (boardSlotId) {
    var slotMainContainer = document.createElement("div");
    slotMainContainer.className = 'slot-main-container';

    var slotObj = this.getSlotObj(boardSlotId);
    var slotInfo = this.getInfoForSlot(boardSlotId);

    slotMainContainer.appendChild(slotObj);
    slotMainContainer.appendChild(slotInfo);

    return slotMainContainer;
}

Board.prototype.getSlotObj = function (boardSlotId) {
    var containerTmp = this.getContainerTemplate('obj');

    var slotObj = document.createElement("img");
    slotObj.id = boardSlotId;

    containerTmp.childNodes[0].innerHTML = 'Animation';
    containerTmp.childNodes[1].appendChild(slotObj);
   
    return containerTmp;
}

Board.prototype.getInfoForSlot = function (boardSlotId) {
    var containerTmp = this.getContainerTemplate('info');

    containerTmp.childNodes[0].innerHTML = 'Info';
    containerTmp.childNodes[1].id = boardSlotId + '-info';

    return containerTmp;
}

Board.prototype.getContainerTemplate = function (identifier) {
    var slotContainer = document.createElement("div");
    var slotTitle = document.createElement("div");
    var slotContent = document.createElement("div");

    slotContainer.className = 'container slot-' + identifier + '-container';
    slotTitle.className = 'title slot-' + identifier + '-title';
    slotContent.className = 'content slot-' + identifier + '-content';

    slotContainer.appendChild(slotTitle);
    slotContainer.appendChild(slotContent);

    return slotContainer;
}