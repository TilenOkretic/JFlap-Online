let edit = '';
let curMode = '';
let input;
let node;

let canvas;

let automata;

document.querySelectorAll('.sidebar-element').forEach(e => {
    e.addEventListener('click', () => {
        setCurrentMode(e.value);

        if (e.value === MODE_DELETE_NODES) {
            cursor(`${window.location.href}assets/cancel.png`);
        } else {
            cursor();
        }

        if (e.value === MODE_RUN_INPUTS) {
            canvas = resizeCanvas(windowWidth, windowHeight);
            let holder = document.querySelector('.bottom_holder');
            if(holder){
                holder.style.display ='';
                document.querySelector('.workspace_canvas').style.overflow='scroll';
                document.querySelector('.workspace_canvas').style.overflowX='hidden';
                document.querySelector('.workspace_canvas').style.border='15px solid rgb(10,10,10)';
                document.querySelector('.workspace_canvas').style.borderBottom='none';
            }else {
                createTable();
                document.querySelector('.workspace_canvas').style.overflow='scroll';
                document.querySelector('.workspace_canvas').style.overflowX='hidden';
                document.querySelector('.workspace_canvas').style.border='15px solid rgb(10,10,10)';
                document.querySelector('.workspace_canvas').style.borderBottom='none';
            }
        } else {
            canvas = resizeCanvas(windowWidth, windowHeight);
            let holder = document.querySelector('.bottom_holder');
            if(holder){
                document.querySelector('.workspace_canvas').style.overflow='hidden';
                document.querySelector('.workspace_canvas').style.border='none';
                holder.style.display = 'none';
            }
        }

        createCard(getParsedMode(), 'limegreen');

        node = null;
    });
});

document.getElementById('LA').addEventListener('click', () => {
    automata = new DFA();

    let holder = document.querySelector('.bottom_holder');
    if(holder){
        holder.remove();
        holder = null;
    }

    createCard('Automata Workspace Reset', 'orange');
}, true);


function setup() {
    let workspace = document.querySelector('.workspace');
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent(document.querySelector('.workspace_canvas'));
    textFont('Play');

    automata = new DFA();
}

// When zooming in and out the canvas resizes with the window
function windowResized() {
    canvas = resizeCanvas(windowWidth, windowHeight);
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

    if (isCurrentMode(MODE_DELETE_NODES)) {
        node = getNodeFromPos({
            x: mouseX,
            y: mouseY
        });

        if (node) {
            automata.removeNode(node);
            node = null;
        }
    }




    if (isCurrentMode(MODE_ADD_NODES) || isCurrentMode(MODE_LINK_NODES) && mouseButton != 'right' && !isEditType(EDIT_TYPE_LINK_NAME)) {
        node = getNodeFromPos({
            x: mouseX,
            y: mouseY
        });
    }



    if (isCurrentMode(MODE_ADD_NODES)) {

        if (!node && mouseButton === 'left' && mouseX > 50 && mouseY > 50 && mouseX < width - 50 && mouseY < height - 50) {
            addNode(new Node(`q${automata.getNodeIndex()}`));
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

        node = getNodeFromPos({
            x: mouseX,
            y: mouseY
        });

        if (node) {
            setEditType(EDIT_TYPE_NODE_NAME);

            createInputBox(node.name, 50, (event) => {
                if (event.key === 'Enter') {
                    node.name = input.value();
                    removeInput();
                    automata.load_automata();
                }
            });
        }
    }
}