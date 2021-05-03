class WorkspaceBase {

    constructor(automata, nodeType) {
        let canvas = createCanvas(windowWidth, windowHeight);
        canvas.parent(document.querySelector('.workspace_canvas'));
        textFont('Play');

        this.nodeType = nodeType;

        if (!automata) {
            createCard('Automata must be defined!', 'red');
            return;
        } else {
            this.automata = automata;
        }
    }

    render() {

        background(51);

        if (isCurrentMode(MODE_LINK_NODES) && hasNode()) {
            fill(0);
            line(node.pos.x, node.pos.y, mouseX, mouseY);
        }


        this.automata.render();

    }

    mousePressed() {

        if (isCurrentMode(MODE_DELETE_NODES)) {
            setNode(getNodeFromPos({
                x: mouseX,
                y: mouseY
            }));

            if (hasNode()) {
                this.automata.removeNode(getNode());
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
                addNode(new this.nodeType(`q${this.automata.getNodeIndex()}`));
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
                createWrapper(getNode(), this.automata);
                document.addEventListener('contextmenu', event => event.preventDefault());
                return false;
            }

            if (document.querySelector('.wrapper') && mouseButton === 'left') {
                document.querySelector('.wrapper').remove();
            }
        }
    }

    mouseReleased() {

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

    mouseDragged() {
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

    doubleClicked() {
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

    getAutomata() {
        return this.automata;
    }

    getTransitions() {
        return this.getAutomata().transitions;
    }

    getTransition(name) {
        return this.getAutomata().transitions[name];
    }

    getTransitionRules(name) {
        return this.getAutomata().transitions[name].rules;
    }

    getResultOfDeltaTransition(name, rule) {
        return this.getAutomata().transitions[name].rules[rule];
    }

    getAutomataNodes() {
        return this.automata.NODES;
    }

    
    getDeltaTransitions() {
        let out_arr = [];
        const DELTA = '𝛿';
        for (let transition_start in this.getTransitions()) {
            if (!this.getTransitions().hasOwnProperty(transition_start)) return;
            for (let rule in this.getTransitionRules(transition_start)) {
                for (let endpoint in this.getResultOfDeltaTransition(transition_start, rule)) {
                    let out = this.getResultOfDeltaTransition(transition_start, rule)[endpoint].name;
                    let string = `${DELTA}(${transition_start}, ${rule}) = ${out}`;
                    out_arr.push(string);
                }
            }
        }
        console.log(out_arr);
        return out_arr;
    }
    reset() {}

}