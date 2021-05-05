class NodeNFA extends NodeBase {

    constructor(name) {
        super(name);
        this.type = 'NFA';
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

                let rule = EMPTY_RULE;

                if (getInput().value()) {
                    rule = getInput().value();
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

    addConnectionWithRule(next_state, rule) {

        /* TODO: Rule parsing/cheking, maybe */
        let connection = {
            parent: this,
            next_state,
            rule: EMPTY_RULE
        };
        if (rule) {
            connection.rule = rule;
        }
        this.connections.push(connection);
        this.hasNextState(connection);
        getAutomata().load_automata();
        return connection ? true : false;
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