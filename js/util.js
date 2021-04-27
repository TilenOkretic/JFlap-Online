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

    let wrapper = document.querySelector('.wrapper');

    if (wrapper) {
        wrapper.remove();
    }

    setEditType(EDIT_TYPE_NODE_FUNCTION);
    wrapper = createDiv();
    wrapper.position(mouseX, mouseY);
    wrapper.addClass('wrapper');

    setCustomElement('start', wrapper, 'selector', () => {
        if (startNodeExist()) {
            if (getStartNode() != node) {
                createCard('Start node is already defined!', 'red');
            }
        }
        node.setStart(!startNodeExist());
        automata.load_automata();
    });

    setCustomElement('finish', wrapper, 'selector', () => {
        node.setFinish(!node.finish);
        automata.load_automata();
    });

};

let createInputBox = (text, size = 50, keyPressEvent) => {
    if (!input) {
        input = createInput(text);
        input.elt.id = 'input';
        input.elt.focus();
        input.size(size, size * 2 / 5);
        input.position(mouseX - size / 2, mouseY - size / 4);
        document.getElementById("input").addEventListener("keydown", (event) => {
            console.log(event.key);
            if (event.key == 'Escape') {
                removeInput();
            }
        });
        document.getElementById("input").addEventListener("keydown", keyPressEvent);
    } else {
        createCard('An Input already exists!');
    }

    return input;
};

function removeInput() {
    if (input) {
        input.remove();
        input = null;
        setEditType();
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
    //find two control points off this line
    var original = p5.Vector.sub(createVector(x2, y2), createVector(x1, y1));
    var inline = original.copy().normalize().mult(original.mag() * d);
    var rotated = inline.copy().rotate(radians(90) + flip * radians(180)).normalize().mult(original.mag() * h);
    var p1 = p5.Vector.add(p5.Vector.add(inline, rotated), createVector(x1, y1));
    //line(x1, y1, p1.x, p1.y); //show control line
    rotated.mult(-1);
    var p2 = p5.Vector.add(p5.Vector.add(inline, rotated).mult(-1), createVector(x2, y2));
    //line(x2, y2, p2.x, p2.y); //show control line
    bezier(x1, y1, p1.x, p1.y, p2.x, p2.y, x2, y2)
}

/*#####################-Nodes-###############################*/
{
    function getNodeFromPos(pos) {

        for (let i = 0; i < getAutomataNodes().length; i++) {
            let dis = sqrt((pos.x - getAutomataNodes()[i].pos.x) * (pos.x - getAutomataNodes()[i].pos.x) + (pos.y - getAutomataNodes()[i].pos.y) * (pos.y - getAutomataNodes()[i].pos.y));
            if (dis < getAutomataNodes()[i].p) {
                return getAutomataNodes()[i];
            }
        }
    }

    function startNodeExist() {
        for (let i = 0; i < getAutomataNodes().length; i++) {
            const node = getAutomataNodes()[i];
            if (node.start) {
                return true;
            }
        }
        return false;
    }

    function getStartNode() {

        if (!startNodeExist()) {
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
        getAutomataNodes().push(node);
        setNode(node);
        return node;
    }

    function getAutomataNodes() {
        return automata.NODES;
    }
}
/*###########################################################*/

/*#####################-Modes-###############################*/
{
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

    function isEditingMode() {
        return isCurrentMode(MODE_EDIT_NODES) || isCurrentMode(MODE_LINK_NODES);
    }

    function setEditType(type = '') {
        edit = type;
        return edit;
    }

    function getEditType() {
        return isEditingMode() ? edit : 'not editing';
    }

    function isEditType(type) {
        return getEditType() === type;
    }
}
/*###########################################################*/