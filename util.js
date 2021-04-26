let createCard = (text = 'placeholder text', color = 'limegreen', x = 100, y = 0) => {

    let card = document.createElement('div');
    card.className = 'card';
    card.style.transform = 'translate(-300px, 0)';
    document.querySelector('.app').appendChild(card);

    setTimeout(() => {
        card.style.transform = `translate(${x}px, ${y}px)`;
        card.style.background = color;
        card.innerHTML = text;
    }, 100);

    setTimeout(() => {
        card.style.transform = 'translate(-300px,0)';
    }, 2000);

};

let createWrapper = (node, automata) => {
    let wrapper = createDiv();
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