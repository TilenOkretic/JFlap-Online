class NodeDFA extends NodeBase {

    constructor(name) {
        super(name);
        this.type = 'DFA';
    }


    addConnection(next_state) {

        /* TODO: Rule parsing/cheking, maybe */
        let connection = {
            parent: this,
            next_state,
            rule: EMPTY_RULE
        };

        createInputBox('', 50, (event) => {
            if (event.key === 'Enter') {

                let rule;

                if (getInput().value()) {
                    if (this.hasConnectionWithRule(getInput().value())) {
                        createCard('This node already has a transition with this rule!', 'red');
                        return;
                    } else {
                        rule = getInput().value();
                    }
                }

                if(!rule){
                    createCard('You must define a rule for transition!', 'red');
                    return;
                }
                connection.rule = rule;
                this.connections.push(connection);
                this.hasNextState(connection);
                removeInput();
                getAutomata().load_automata();
            }
        }).position((next_state.pos.x + this.pos.x) / 2, 0.5 * (next_state.pos.y + this.pos.y));



        return connection;
    }

    hasConnectionWithRule(rule) {
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].rule === rule) {
                return true;
            }
        }

        return false;
    }
}