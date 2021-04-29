// this is basically a variable that stores the "current workspace"
//  move this to the serverside
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
            resizeCanvas(windowWidth, windowHeight);
            let holder = document.querySelector('.bottom_holder');
            if (holder) {
                holder.style.display = '';
                document.querySelector('.workspace_canvas').style.overflow = 'scroll';
                document.querySelector('.workspace_canvas').style.overflowX = 'hidden';
                document.querySelector('.workspace_canvas').style.border = '15px solid rgb(10,10,10)';
                document.querySelector('.workspace_canvas').style.borderBottom = 'none';
            } else {
                createTable();
                document.querySelector('.workspace_canvas').style.overflow = 'scroll';
                document.querySelector('.workspace_canvas').style.overflowX = 'hidden';
                document.querySelector('.workspace_canvas').style.border = '15px solid rgb(10,10,10)';
                document.querySelector('.workspace_canvas').style.borderBottom = 'none';
            }
        } else {
            resizeCanvas(windowWidth, windowHeight);
            let holder = document.querySelector('.bottom_holder');
            if (holder) {
                document.querySelector('.workspace_canvas').style.overflow = 'hidden';
                document.querySelector('.workspace_canvas').style.border = 'none';
                holder.style.display = 'none';
            }
        }

        createCard(getParsedMode(), 'limegreen');

        setNode();
    });
});

document.getElementById('LA').addEventListener('click', () => {
    automata = new DFA();

    let holder = document.querySelector('.bottom_holder');
    if (holder) {
        holder.remove();
        holder = null;
    }

    createCard('Automata Workspace Reset', 'orange');
}, true);


function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent(document.querySelector('.workspace_canvas'));
    textFont('Play');

    automata = new DFA();
}

// When zooming in and out the canvas resizes with the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {

    background(51);


    if (isCurrentMode(MODE_LINK_NODES) && hasNode()) {
        fill(0);
        line(node.pos.x, node.pos.y, mouseX, mouseY);
    }


    automata.drawConnections();
    for (let node of getAutomataNodes()) {
        node.show();
    }
}

function keyPressed() {}

function mousePressed() {

    if (isCurrentMode(MODE_DELETE_NODES)) {
        setNode(getNodeFromPos({
            x: mouseX,
            y: mouseY
        }));

        if (hasNode()) {
            automata.removeNode(getNode());
            setNode();
        }
    }




    if (isCurrentMode(MODE_ADD_NODES) || isCurrentMode(MODE_LINK_NODES) && mouseButton != 'right' && !isEditType(EDIT_TYPE_LINK_NAME)) {
        setNode(getNodeFromPos({
            x: mouseX,
            y: mouseY
        }));
    }



    if (isCurrentMode(MODE_ADD_NODES)) {

        if (!hasNode() && mouseButton === 'left' && mouseX > 50 && mouseY > 50 && mouseX < width - 50 && mouseY < height - 50) {
            addNode(new Node(`q${automata.getNodeIndex()}`));
        }
    } else if (isCurrentMode(MODE_EDIT_NODES)) {

        if (document.querySelector('.wrapper') != null && node && mouseButton === 'left') {
            document.querySelector('.wrapper').remove();
            return false;
        }

        if (mouseButton === 'right') {

            setNode(getNodeFromPos({
                x: mouseX,
                y: mouseY
            }));

            // TODO: make a wrapper class
            createWrapper(getNode(), automata);
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

        if (hasNode() && newNode) {
            setCurrentMode(MODE_LINK_NODES);
            setEditType(EDIT_TYPE_LINK_NAME);
            getNode().addConnection(newNode);
            setNode();
        }
    }
}

function mouseDragged() {

    if (isCurrentMode(MODE_EDIT_NODES) && !hasInput()) {
        setEditType(EDIT_TYPE_NODE_MOVE);

        setNode(getNodeFromPos({
            x: mouseX,
            y: mouseY
        }));

        if (hasNode() && isEditType(EDIT_TYPE_NODE_MOVE)) {
            getNode().setPos(mouseX, mouseY);
        }
    }
}

function doubleClicked() {

    if (isCurrentMode(MODE_EDIT_NODES) && !hasInput()) {

        setNode(getNodeFromPos({
            x: mouseX,
            y: mouseY
        }));

        if (hasNode()) {
            setEditType(EDIT_TYPE_NODE_NAME);

            createInputBox(getNode().getName(), 50, (event) => {
                if (event.key === 'Enter') {
                    getNode().setName(getInput().value());
                    removeInput();
                    automata.load_automata();
                }
            });
        }
    }
}