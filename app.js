/*##-MODES as const values-##*/
const MODE_ADD_NODES = 'mode_add_nodes';
const MODE_LINK_NODES = 'mode_link_nodes';
const MODE_EDIT_NODES = 'mode_edit_nodes';

const EDIT_TYPE_NODE_NAME = 'node_name';
const EDIT_TYPE_NODE_MOVE = 'node_move';
const EDIT_TYPE_LINK_NAME = 'link_name';

/*###########################*/

let edit = '';
let curMode = '';

let node;
let input;

let automata;

document.querySelectorAll('.sidebar-element').forEach(e => {
    e.addEventListener('click', () => {
        setCurrentMode(e.title);

        createCard(getParsedMode(), 'limegreen');

        node = null;
    });
});

document.getElementById('LA').addEventListener('click', () => {
    automata = new DFA();

    createCard('Automata Workspace Reset', 'orange');
}, true);


function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent(document.querySelector('.app'));
    textFont('Play');

    automata = new DFA();
}


function draw() {

    background(51);


    if (isCurrentMode(MODE_LINK_NODES) && node) {
        fill(0);
        line(node.pos.x, node.pos.y, mouseX, mouseY);
    }


    automata.drawConnections();
    for (let node of getAutomataNodes()) {
        node.show();
    }
}

function keyPressed() {
    if (key === 'Enter') {

    } else if (key === 'k') {
        automata.load_automata();
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
            addNode(new Node(`q${getAutomataNodes().length}`));
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
            createWrapper(node, automata);
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

        if (mouseButton === 'right') {
            return;
        }

        let newNode = getNodeFromPos({
            x: mouseX,
            y: mouseY
        });

        if (node && newNode) {
            setCurrentMode(MODE_LINK_NODES);
            setEditType(EDIT_TYPE_LINK_NAME);
            node.addConnection(newNode);

            // remove currently selected node
            node = null;
        }
    }
}

function mouseDragged() {

    if (isCurrentMode(MODE_EDIT_NODES) && !input) {
        setEditType(EDIT_TYPE_NODE_MOVE);
        
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

    if (isCurrentMode(MODE_EDIT_NODES) && !input) {

        if(!node){
            console.log('new node');
            node = getNodeFromPos({
                x: mouseX,
                y: mouseY
            });
        }

        if (node) {
            setEditType(EDIT_TYPE_NODE_NAME);

            input = createInput(node.name);
            input.elt.id = 'input';
            let xSize = 50;
            input.size(xSize, xSize * 2 / 5);
            input.position(mouseX - xSize / 2, mouseY - xSize / 4);

            document.getElementById("input").addEventListener("keydown", (event) => {
                if (event.key === 'Enter') {
                    node.name = input.value();
                    input.remove();
                    automata.load_automata();
                    input = null;
                    setEditType();
                }
            });
        }
    }
}



/* Utils TODO: create a separate file for utils */