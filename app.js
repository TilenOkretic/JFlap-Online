/*##-MODES as const values-##*/
const MODE_ADD_NODES = 'mode_add_nodes';
const MODE_LINK_NODES = 'mode_link_nodes';
/*###########################*/

let EDITING = false;
let NODES = [];

let curMode = '';
let node = undefined;
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
        if (input && node) {
            node.name = input.value();
            input.remove();
            setEditing(false);
        }
    } else if (key === 'k') {
        load_automata();
    }
}

function mousePressed() {
    node = getNodeFromPos({
        x: mouseX,
        y: mouseY
    });
    if (isCurrentMode(MODE_ADD_NODES)) {
        if (!isEditing() && node && mouseButton === 'right') {
            setEditing();

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
        if (document.querySelector('.wrapper') != null && isEditing() && node && mouseButton === 'left') {
            document.querySelector('.wrapper').remove();
            setEditing();
            return false;
        }

        if (document.querySelector('.wrapper') && mouseButton === 'left') {
            document.querySelector('.wrapper').remove();
        } else if (!node && !isEditing() && mouseButton === 'left' && mouseX > 50 && mouseY > 50 && mouseX < width - 50 && mouseY < height - 50) {
            NODES.push(new Node(`q${NODES.length}`));
        }
    }
}

function mouseReleased() {

    let newNode = getNodeFromPos({
        x: mouseX,
        y: mouseY
    });

    if (isCurrentMode(MODE_LINK_NODES)) {
        if (node && newNode) {
            // Create connection betwen nodes
            node.addConnection(newNode);

            // remove currently selected node
            node = null;
        }
    }
}

function mouseDragged() {

    if (isCurrentMode(MODE_ADD_NODES)) {
        if (isEditing()) {
            return false;
        }

        if (node) {
            //moving nodes when mouse is dragged
            node.setPos(mouseX, mouseY);
        }
    }
}

function doubleClicked() {

    if (isCurrentMode(MODE_ADD_NODES)) {
        if (isEditing()) {
            return;
        }

        node = getNodeFromPos({
            x: mouseX,
            y: mouseY
        });
        if (node) {
            setEditing(true);
            input = createInput(node.name);
            let xSize = 50;
            input.size(xSize, xSize * 2 / 5);
            input.position(mouseX - xSize / 2, mouseY - xSize / 4);

        }
    }
}



/* Utils */

function getNodeFromPos(pos) {


    if (isEditing()) {
        return node;
    }
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
    return EDITING;
}

function setEditing(val = !isEditing()) {
    EDITING = val;
    return EDITING;
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
    tmp = tmp.slice(1,tmp.length);
    let out = "";
    tmp.forEach((c)=>{
        out += c+" ";
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