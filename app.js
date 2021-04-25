/*##-MODES as const values-##*/
const MODE_ADD_NODES = 'mode_add_nodes';
const MODE_LINK_NODES = 'mode_link_nodes';
const MODE_EDIT_NODES = 'mode_edit_nodes';

const EDIT_TYPE_NODE_NAME = 'node_name';
const EDIT_TYPE_NODE_MOVE = 'node_move';
const EDIT_TYPE_LINK_NAME = 'link_name';

/*###########################*/

let edit = '';
let NODES = [];

let curMode = '';
let node;
let input;

document.querySelectorAll('.sidebar-element').forEach(e => {
    e.addEventListener('click', () => {
        setCurrentMode(e.title);

        new Card();

        node = null;

    });
});



function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent(document.querySelector('.app'));
    textFont('Play');
}


function draw() {

    background(51);

    for (let node of NODES) {
        node.show();
    }

    if (isCurrentMode(MODE_LINK_NODES) && node) {
        fill(0);
        line(node.pos.x, node.pos.y, mouseX, mouseY);
    }

}

function keyPressed() {
    if (key === 'Enter') {

    } else if (key === 'k') {
        load_automata();
    }
}

function mousePressed() {

    if (isCurrentMode(MODE_ADD_NODES) || isCurrentMode(MODE_LINK_NODES) && mouseButton != 'right' && !isEditType(EDIT_TYPE_LINK_NAME)) {
        node = getNodeFromPos({
            x: mouseX,
            y: mouseY
        });
    }

    if (isCurrentMode(MODE_ADD_NODES)) {

        if (!node && mouseButton === 'left' && mouseX > 50 && mouseY > 50 && mouseX < width - 50 && mouseY < height - 50) {
            addNode(new Node(`q${NODES.length}`));
        }
    } else if (isCurrentMode(MODE_EDIT_NODES)) {

        if (document.querySelector('.wrapper') != null && node && mouseButton === 'left') {
            document.querySelector('.wrapper').remove();
            return false;
        }

        if (mouseButton === 'right') {

            node = getNodeFromPos({
                x: mouseX,
                y: mouseY
            });

            // TODO: make a wrapper class
            let wrapper = createDiv();
            wrapper.position(mouseX, mouseY);
            wrapper.addClass('wrapper');

            if (!startNodeExist()) {
                setCustomElement('start', wrapper, 'selector', () => {
                    node.setStart(!node.start);
                });
            }

            setCustomElement('finish', wrapper, 'selector', () => {
                node.setFinish(!node.finish);
            });

            document.addEventListener('contextmenu', event => event.preventDefault());
            return false;
        }

        if (document.querySelector('.wrapper') && mouseButton === 'left') {
            document.querySelector('.wrapper').remove();
        }
    }
}

function mouseReleased() {


    if (isCurrentMode(MODE_LINK_NODES) && !isEditType(EDIT_TYPE_LINK_NAME)) {

        if(mouseButton === 'right'){
            return;
        }

        let newNode = getNodeFromPos({
            x: mouseX,
            y: mouseY
        });

        if (node && newNode) {
            setCurrentMode(MODE_LINK_NODES);
            setEdit(EDIT_TYPE_LINK_NAME);
            console.log(getEdit());
            node.addConnection(newNode);

            // remove currently selected node
            node = null;
        }
    }
}

function mouseDragged() {

    if (isCurrentMode(MODE_EDIT_NODES)) {
        setEdit(EDIT_TYPE_NODE_MOVE);
        node = getNodeFromPos({
            x: mouseX,
            y: mouseY
        });

        if (node && isEditType(EDIT_TYPE_NODE_MOVE)) {
            node.setPos(mouseX, mouseY);
        }
    }
}

function doubleClicked() {

    if (isCurrentMode(MODE_EDIT_NODES)) {

        node = getNodeFromPos({
            x: mouseX,
            y: mouseY
        });

        if (node) {
            setEdit(EDIT_TYPE_NODE_NAME);

            input = createInput(node.name);
            input.elt.id = 'input';
            let xSize = 50;
            input.size(xSize, xSize * 2 / 5);
            input.position(mouseX - xSize / 2, mouseY - xSize / 4);

            document.getElementById("input").addEventListener("keydown", (event) => {
                if (event.key === 'Enter') {

                    node.name = input.value();
                    input.remove();
                    setEdit();
                }
            });
        }
    }
}



/* Utils */

function getNodeFromPos(pos) {

    for (let i = 0; i < NODES.length; i++) {
        let dis = sqrt((pos.x - NODES[i].pos.x) * (pos.x - NODES[i].pos.x) + (pos.y - NODES[i].pos.y) * (pos.y - NODES[i].pos.y));
        if (dis < NODES[i].p) {
            return NODES[i];
        }
    }
}

function setCustomElement(text, parent, elmClass = '', onSelected) {
    let elm = createDiv(`${text}`);
    elm.addClass(elmClass);
    elm.parent(parent);
    if (onSelected) {
        elm.mousePressed(() => {
            isEditing(false);
            onSelected();
        })
    }
}

function startNodeExist() {
    for (let i = 0; i < NODES.length; i++) {
        const node = NODES[i];
        if (node.start) {
            return true;
        }
    }
    return false;
}

function isEditing() {
    return isCurrentMode(MODE_EDIT_NODES) || isCurrentMode(MODE_LINK_NODES);
}

function setEdit(type = '') {
    edit = type;
    return edit;
}

function getEdit() {
    return isEditing() ? edit : 'not editing';
}

function isEditType(type) {
    return getEdit() === type;
}


function getCurrentMode() {
    return curMode;
}

function setCurrentMode(mode) {
    curMode = mode;
    return this.curMode;
}

function getParsedMode() {
    let tmp = curMode.split('_');
    tmp = tmp.slice(1, tmp.length);
    let out = "";
    tmp.forEach((c) => {
        out += c + " ";
    });
    return out;
}

function isCurrentMode(mode) {
    return getCurrentMode() === mode;
}

function setNode(new_node) {
    node = new_node;
    return node;
}

function getNode() {
    return node;
}

function hasNode() {
    return node ? true : false;
}

function addNode(node) {
    NODES.push(node);
    setNode(node);
    return node;
}