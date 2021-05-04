class AutomatonBase {

    constructor() {
        this.transitions = [];
        this.NODES = [];
        this.nodeIndex = 0;
    }

    getNodeIndex() {
        return this.nodeIndex;
    }

    load_automata(flag) {

        if(flag){
            this.transitions = [];
        }

        this.NODES.forEach(element => {
            if (element.start) {
                this.start = element;
            }
            this.load_transitions(element);
        });
    }

    load_transitions(node) {

        node.connections.forEach(conn => {

            if (!this.transitions[conn.parent.name]) {
                this.transitions[conn.parent.name] = [];
            }
            if (!this.transitions[conn.parent.name].rules) {
                this.transitions[conn.parent.name].rules = [];
            }
            if (!this.transitions[conn.parent.name].rules[conn.rule]) {
                this.transitions[conn.parent.name].rules[conn.rule] = [];
            }
            if (!this.hasRuleNextState(this.transitions[conn.parent.name], conn.rule, conn.next_state)) {
                this.transitions[conn.parent.name].rules[conn.rule].push(conn.next_state);
            }
        });

    }

    process_string(str) {}

    getNodeFromName(name) {

        for (let i = 0; i < this.NODES.length; i++) {
            const node = this.NODES[i];
            if (node.name == name) {
                return node;
            }
        }

        return;

    }

    render() {
        for (let i = 0; i < this.NODES.length; i++) {
            let node = this.NODES[i];
            let transition = this.transitions[node.name];
            if (transition) {
                for (let rule in transition.rules) {
                    let next_states = transition.rules[rule];
                    for (let i = 0; i < next_states.length; i++) {
                        let frule = "";
                        const other = next_states[i];
                        this.getRulesToState(transition, other).forEach(e => {
                            frule += e
                        });
                        this.drawConnectionLine(frule, node, other);
                    }
                }
            }
        }
        for (let node of this.NODES) {
            node.show();
        }
    }

    getRulesToState(transition, state) {

        let out = [];
        // q0: [rules:]
        for (let rule in transition.rules) {
            let next_states = transition.rules[rule];
            for (let i = 0; i < next_states.length; i++) {
                if (next_states[i].name === state.name) {
                    if (!out.includes(rule)) {
                        out.push(rule);
                    }
                }
            }
        }


        return out;
    }

    drawConnectionLine(rule, node, other) {
        let node_vec = node.pos;
        let other_vec = other.pos;


        let triangle_offset = 8;
        let v = p5.Vector.sub(other_vec, node_vec);

        push();

        translate(node_vec.x, node_vec.y);

        noFill();
        if (node.name === other.name) {

            beginShape();
            curveVertex(-6, 0);

            curveVertex(-8, -node.p / 2);
            curveVertex(-1, -node.p / 2 * 2);
            curveVertex(8, -node.p / 2);

            curveVertex(6, 20);

            endShape();

            fill(255);
            text(rule, 0, -node.p * 1.05);
            noFill();

            // triangle when connected to slef 
            line(8, -node.p / 2, 2, -node.p * 0.7);
            line(8, -node.p / 2, 11, -node.p * 0.7);
            pop();
        } else {

            if (node_vec.x < other_vec.x) {
                noFill();
                curveBetween(0, 0, v.x, v.y, 0.4, 0.05, 1);
            } else {
                noFill();
                curveBetween(0, 0, v.x, v.y, 0.4, 0.05, 1);
            }
        }
        if (node.name === other.name) {

            if (this.isMouseOverText(node_vec.x, node_vec.y - node.p * 1.05)) {
                for (let i = 0; i < rule.split(',').length; i++) {
                    let one_rule = rule[i];

                    for (let key in this.transitions[node.name]) {
                        if (key === 'length' || !this.transitions[node.name].hasOwnProperty(key)) continue;
                        if (key === one_rule) {
                            node.removeConnectionWithRule(one_rule);
                            delete this.transitions[node.name][key];
                        }
                    }
                }
            }

        } else {
            translate(v.x, v.y);
            rotate(v.heading() + PI / 16);
            strokeWeight(3);
            line(-other.p / 2, 3, -other.p / 2 - triangle_offset * 2.5, triangle_offset + 3);
            line(-other.p / 2, 3, -other.p / 2 - triangle_offset * 2.5, -triangle_offset + 3);


            pop();

            push();

            let off = 12;
            let x;
            let y;
            if (node_vec.x < other_vec.x + 5 && node_vec.x > other_vec.x - 5) {
                if (node_vec.y > other_vec.y) {
                    x = node_vec.x - off * 2;
                    y = node_vec.y - v.mag() / 2;
                    translate(x, y);
                    rotate(v.heading() + PI);
                    fill(255);
                    text(rule, 0, 0);
                } else {
                    x = node_vec.x + off;
                    y = node_vec.y + v.mag() / 2;
                    translate(x, y);
                    rotate(v.heading());
                    fill(255);
                    text(rule, 0, 0);
                }
            } else if (v.heading() > 1.599) {
                if (node_vec.x > other_vec.x) {
                    x = node_vec.x;
                    y = node_vec.y;
                    translate(x, y);
                    rotate(v.heading() + PI);
                    fill(255);
                    text(rule, -v.mag() / 2, off * 2);
                } else {
                    translate(node_vec.x, node_vec.y);
                    rotate(v.heading() - PI);
                    fill(255);
                    text(rule, -v.mag() / 2, -off);
                }
            } else if (v.heading() < -1.599) {
                if (node_vec.x > other_vec.x) {
                    x = node_vec.x;
                    y = node_vec.y;
                    translate(x, y);
                    rotate(v.heading() + PI);
                    fill(255);
                    text(rule, -v.mag() / 2, off * 2);
                } else {
                    x = node_vec.x;
                    y = node_vec.y;
                    translate(x, y);
                    rotate(v.heading() - PI);
                    fill(255);
                    text(rule, -v.mag() / 2, -off);
                }
            } else {
                if (node_vec.x >= other_vec.x) {
                    x = node_vec.x;
                    y = node_vec.y;
                    translate(x, y);
                    rotate(v.heading());
                    fill(255);
                    text(rule, v.mag() / 2, -off);
                } else {
                    x = node_vec.x;
                    y = node_vec.y;
                    translate(x, y);
                    rotate(v.heading());
                    fill(255);
                    text(rule, v.mag() / 2, -off * 2);
                }
            }

            if (this.isMouseOverText((node_vec.x + other_vec.x) / 2, (node_vec.y + other_vec.y) / 2)) {
                for (let i = 0; i < rule.split(',').length; i++) {
                    let one_rule = rule[i];
                    console.log(one_rule);
                    for (let rule in this.transitions[node.name].rules) {
                        if (rule === one_rule) {
                            node.removeConnectionWithRule(one_rule);
                            delete this.transitions[node.name].rules[rule];
                        }
                    }
                }
            }

            pop();
        }
    }

    isMouseOverText(x, y) {
        if (mouseX > (x - 15) && mouseX < (x + 15)) {
            if (mouseY > (y - 15) && mouseY < (y + 15)) {
                if (mouseIsPressed && mouseButton === 'left') {
                    return isCurrentMode(MODE_DELETE_NODES);
                }
            }
        }
        return false;
    }

    removeNode(node) {

        if (this.start && this.start.name == node.name) {
            this.start = null;
        }

        for (let i = 0; i < this.NODES.length; i++) {
            if (this.NODES[i].name === node.name) {
                this.NODES.splice(i, 1);

                for (let transition in this.transitions) {
                    for (let rule in this.transitions[transition].rules) {
                        for (let next in this.transitions[transition].rules[rule]) {
                            let parent_node = this.transitions[transition].rules[rule][next];
                            if (node.name === parent_node.name) {
                                delete this.transitions[transition].rules[rule];
                            }
                        }
                    }
                }
            }
        }
    }

    hasStartNode() {
        return this.start ? true : false;
    }

    hasTransitionWithRule(rule) {
        for (let key in this.transitions) {
            if (this.transitions[key].rules.includes(rule)) {
                return true;
            }
        }
        return false;
    }

    // hasNextState(next_state) {
    //     for (let key in this.transitions) {
    //         for (let key2 in this.transitions[key].rules) {
    //             if (this.transitions[key].rules[key2].includes(next_state)) {
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }

    hasRuleNextState(transition, rule, next_state) {
        if (transition.rules[rule].includes(next_state)) {
            return true;
        }
        return false;
    }
}