/*#####################-CONST VALUES-########################*/

const MODE_ADD_NODES = 'mode_add_nodes';
const MODE_EDIT_NODES = 'mode_edit_nodes';
const MODE_DELETE_NODES = 'mode_delete_nodes';
const MODE_LINK_NODES = 'mode_link_nodes';
const MODE_RUN_INPUTS = 'mode_run_inputs';

const EDIT_TYPE_NODE_NAME = 'node_name';
const EDIT_TYPE_NODE_MOVE = 'node_move';
const EDIT_TYPE_NODE_FUNCTION = 'node_function';
const EDIT_TYPE_LINK_NAME = 'link_name';

const EMPTY_RULE = 'ɛ';

/*###########################################################*/
let createCard = (text = 'placeholder text', color = 'limegreen', x = 100, y = 0) => {

    let card = document.createElement('div');
    card.className = 'card';
    card.style.transform = `translate(-${x}px, -${y}px)`;
    document.querySelector('.app').appendChild(card);

    setTimeout(() => {
        card.style.transform = `translate(${x}px, ${y}px)`;
        card.style.background = color;
        card.innerHTML = text;
    }, 100);

    setTimeout(() => {
        card.style.transform = `translate(-${card.getBoundingClientRect().width + 100}px,0)`;
        setTimeout(() => {
            card.remove();
        }, 2000);
    }, 2000);


};

let createWrapper = (node, automata) => {

    if (!node) {
        createCard('RIGHT CLICK ON A NODE!', 'red');
        return;
    }
    let wrapper = document.querySelector('.wrapper');

    if (wrapper) {
        wrapper.remove();
    }

    setEditType(EDIT_TYPE_NODE_FUNCTION);
    wrapper = createDiv();
    wrapper.position(mouseX, mouseY);
    wrapper.addClass('wrapper');

    setCustomElement('start', wrapper, 'selector', () => {
        if (startNodeExists()) {
            if (getStartNode() != getNode()) {
                createCard('Start node is already defined!', 'red');
            }
        }
        node.setStart(!startNodeExists());
        automata.load_automata();
    });

    setCustomElement('finish', wrapper, 'selector', () => {
        node.setFinish(!node.finish);
        automata.load_automata();
    });

};

let createHolder = () => {
    let workspace_div = document.querySelector('.workspace');

    let holder = document.createElement('div');
    holder.className = 'bottom_holder';
    
    let tab = document.createElement('div');
    tab.className = 'tab';

    let pane = document.createElement('div');
    pane.className = 'pane';

    let table = document.createElement('div');
    table.className = 'input_table';

    let btnHolder = document.createElement('div');
    btnHolder.className = 'btnHolder';
    btnHolder.style.bottom = '0';

    addInputToTable(table);

    pane.appendChild(table);

    let btn = document.createElement('button');
    btn.textContent = 'Run';
    btn.style.width = '120px';
    btn.style.marginTop = '2rem';

    btn.addEventListener('click', () => {
        if (!getAutomata().hasStartNode()) {
            createCard('No START node available!', 'red');
            return;
        }
        for (let i = 0; i < table.children.length; i++) {
            let pocket_elements = table.children[i].children;
            for (let j = 0; j < pocket_elements.length; j++) {
                const input_text = pocket_elements[j].children[0].value;
                const label = pocket_elements[j].children[1];
                if (input_text) {
                    let out = getAutomata().process_string(input_text);
                    label.textContent = out ? "Accepted" : "Rejected";
                }
            }
        }
    });

    tab.appendChild(btnHolder);

    tab.appendChild(pane);
    tab.appendChild(btn);

    workspace.getDeltaTransitions().forEach(e => {
        let p = document.createElement('p');
        p.textContent = e;
        p.style.color = 'white';
        holder.appendChild(p);
    });

    holder.appendChild(tab);

    workspace_div.appendChild(holder);
};

function removeInput() {
    if (hasInput()) {
        getInput().remove();
        setInput()
        setEditType();
    }
}

function addInputToTable(table) {
    let inp;
    let lab;
    let pocket;
    if (table.children.length == 0 || document.getElementsByClassName('pocket')[document.getElementsByClassName('pocket').length - 1].children.length % 4 == 0) {
        pocket = document.createElement('div');
        pocket.className = 'pocket';
    } else {
        pocket = document.getElementsByClassName('pocket')[document.getElementsByClassName('pocket').length - 1];
    }
    let row = document.createElement('div');

    inp = document.createElement('input');
    inp.addEventListener('click', () => {
        if (!inp.className.includes('extended')) {
            addInputToTable(table);
            inp.className += 'extended';
            inp.focus();
        }
    });
    lab = document.createElement('lable');
    lab.style.color = 'white';
    lab.style.marginLeft = '2rem';

    row.appendChild(inp);
    row.appendChild(lab);
    pocket.appendChild(row);
    pocket.style.marginRight = '2rem';

    if (table.children.length == 0 || document.getElementsByClassName('pocket')[document.getElementsByClassName('pocket').length - 1].children.length % 4 == 0) {
        table.appendChild(pocket);
    }
}

function setCustomElement(text, parent, elmClass = '', onSelected) {
    let elm = createDiv(`${text}`);
    elm.addClass(elmClass);
    elm.parent(parent);
    if (onSelected) {
        elm.mousePressed(() => {
            /* TODO:  set state to editing */
            onSelected();
        })
    }
}

function curveBetween(x1, y1, x2, y2, d, h, flip) {
    var original = p5.Vector.sub(createVector(x2, y2), createVector(x1, y1));
    var inline = original.copy().normalize().mult(original.mag() * d);
    var rotated = inline.copy().rotate(radians(90) + flip * radians(180)).normalize().mult(original.mag() * h);
    var p1 = p5.Vector.add(p5.Vector.add(inline, rotated), createVector(x1, y1));
    rotated.mult(-1);
    var p2 = p5.Vector.add(p5.Vector.add(inline, rotated).mult(-1), createVector(x2, y2));
    bezier(x1, y1, p1.x, p1.y, p2.x, p2.y, x2, y2)
}

/*#####################-Nodes-###############################*/

function getNodeFromPos(pos) {

    for (let i = 0; i < getAutomataNodes().length; i++) {
        let dis = sqrt((pos.x - getAutomataNodes()[i].pos.x) * (pos.x - getAutomataNodes()[i].pos.x) + (pos.y - getAutomataNodes()[i].pos.y) * (pos.y - getAutomataNodes()[i].pos.y));
        if (dis < getAutomataNodes()[i].p) {
            return getAutomataNodes()[i];
        }
    }
}

function startNodeExists() {
    for (let i = 0; i < getAutomataNodes().length; i++) {
        const node = getAutomataNodes()[i];
        if (node.start) {
            return true;
        }
    }
    return false;
}

function getStartNode() {

    if (!startNodeExists()) {
        return;
    }

    for (let i = 0; i < getAutomataNodes().length; i++) {
        const node = getAutomataNodes()[i];
        if (node.start) {
            return node;
        }
    }
    return null;
}

function setNode(new_node) {
    this.node = new_node;
    return this.node;
}

function getNode() {
    return this.node;
}

function hasNode() {
    return this.node ? true : false;
}

function addNode(node) {
    getAutomataNodes().push(node);
    setNode(node);
    getAutomata().nodeIndex += 1;
    return getNode();
}

function getAutomataNodes() {
    return workspace.getAutomataNodes();
}

function getAutomata() {
    return workspace.automata;
}

/*###########################################################*/

/*#####################-Modes-###############################*/
function getCurrentMode() {
    return this.curMode;
}

function setCurrentMode(mode) {
    this.curMode = mode;
    return this.curMode;
}

function getParsedMode() {
    let tmp = getCurrentMode().split('_');
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

function isEditingMode() {
    return isCurrentMode(MODE_EDIT_NODES) || isCurrentMode(MODE_LINK_NODES);
}

function setEditType(type = '') {
    this.editType = type;
    return this.editType;
}

function getEditType() {
    return isEditingMode() ? this.editType : 'not editing';
}

function isEditType(type) {
    return getEditType() === type;
}

/*###########################################################*/

/*#####################-Transitions-#########################*/


/*###########################################################*/
/*######################-Inputs-#############################*/

let createInputBox = (text, size = 50, keyPressEvent, pos) => {
    if (!getInput()) {
        this.input = createInput(text);
        getInput().elt.id = 'input';
        getInput().elt.focus();
        getInput().size(size, size * 2 / 5);
        if (pos) {
            getInput().position(pos.x, pos.y);
        } else {
            getInput().position(mouseX - size / 2, mouseY - size / 4);
        }
        document.getElementById("input").addEventListener("keydown", (event) => {
            if (event.key == 'Escape') {
                removeInput();
            }
        });
        document.getElementById("input").addEventListener("keydown", keyPressEvent);
    } else {
        createCard('An Input already exists!');
    }

    return getInput();
};

function getInput() {
    return this.input;
}

function hasInput() {
    return getInput() ? true : false;
}

function setInput(input) {
    this.input = input;
    return getInput();
}

/*###########################################################*/