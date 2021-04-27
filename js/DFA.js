let t;
class DFA {

    constructor() {
        this.transitions = [];
        this.NODES = [];
        this.nodeIndex = 0;
    }

    getNodeIndex() {
        return this.nodeIndex;
    }

    load_automata() {
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
            this.transitions[conn.parent.name][conn.rule] = conn.next_state;
        });
    }

    process_string(str) {
        let next = this.transitions[this.start.name][str[0]];
        for (let c = 1; c < str.length; c++) {
            const char = str[c];
            if (!next) {
                return false;
            }
            next = this.transitions[next.name][char];
        }

        return next ? next.finish : false;
    }

    getNodeFromName(name) {

        for (let i = 0; i < this.NODES.length; i++) {
            const node = this.NODES[i];
            if (node.name == name) {
                return node;
            }
        }

        return;

    }

    drawConnections() {

        for (let i = 0; i < this.NODES.length; i++) {
            let node = this.NODES[i];
            if (this.transitions[node.name]) {
                for (var key in this.transitions[node.name]) {
                    if (key === 'length' || !this.transitions[node.name].hasOwnProperty(key)) continue;

                    var other = this.transitions[node.name][key];

                    let frules = "";
                    let lst_tran = this.getTranstionsToState(this.transitions[node.name], other);

                    for (let j = 0; j < lst_tran.length; j++) {
                        const key = lst_tran[j];
                        frules += key + ' ';
                    }

                    this.drawConnectionLine(frules, node, other);
                }



            }
        }

    }


    getTranstionsToState(transition, state) {

        let out = [];

        for (var key in transition) {
            if (key === 'length' || !transition.hasOwnProperty(key)) continue;
            let val = transition[key];
            if (val.name === state.name) {
                out.push(key);
            }
        }



        return out;
    }

    drawConnectionLine(rule, node, other) {
        let node_vec = node.pos;
        let other_vec = other.pos;


        let v = p5.Vector.sub(other_vec, node_vec);

        push();

        translate(node_vec.x, node_vec.y);

        if (node_vec.x < other_vec.x) {
            noFill();
            curveBetween(0, 0, v.x, v.y, 0.4, 0.05, 1);
        } else {
            noFill();
            curveBetween(0, 0, v.x, v.y, 0.4, 0.05, 1);
        }

        translate(v.x, v.y);
        rotate(v.heading() + PI / 16);

        let triangle_offset = 8;

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
                t = text(rule, 0, 0);
            } else {
                x = node_vec.x + off;
                y = node_vec.y + v.mag() / 2;
                translate(x, y);
                rotate(v.heading());
                fill(255);
                t = text(rule, 0, 0);
            }
        } else if (v.heading() > 1.599) {
            if (node_vec.x > other_vec.x) {
                x = node_vec.x;
                y = node_vec.y;
                translate(x, y);
                rotate(v.heading() + PI);
                fill(255);
                t = text(rule, -v.mag() / 2, off * 2);
            } else {
                translate(node_vec.x, node_vec.y);
                rotate(v.heading() - PI);
                fill(255);
                t = text(rule, -v.mag() / 2, -off);
            }
        } else if (v.heading() < -1.599) {
            if (node_vec.x > other_vec.x) {
                x = node_vec.x;
                y = node_vec.y;
                translate(x, y);
                rotate(v.heading() + PI);
                fill(255);
                t = text(rule, -v.mag() / 2, off * 2);
            } else {
                x = node_vec.x;
                y = node_vec.y;
                translate(x, y);
                rotate(v.heading() - PI);
                fill(255);
                t = text(rule, -v.mag() / 2, -off);
            }
        } else {
            if (node_vec.x > other_vec.x) {
                x = node_vec.x;
                y = node_vec.y;
                translate(x, y);
                rotate(v.heading());
                fill(255);
                t = text(rule, -v.mag() / 2, +off);
            } else {
                x = node_vec.x;
                y = node_vec.y;
                translate(x, y);
                rotate(v.heading());
                fill(255);
                t = text(rule, v.mag() / 2, -off);
            }
        }

        if (this.isMouseOverText((node_vec.x + other_vec.x) / 2, (node_vec.y + other_vec.y) / 2)) {
            console.log('true');
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

        pop();
    }


    isMouseOverText(x, y) {
        if (mouseX > x - 15 && mouseX < x + 15) {
            if (mouseY > y - 15 && mouseY < y + 15) {
                if (mouseIsPressed && mouseButton === 'left') {
                    return isCurrentMode(MODE_DELETE_NODES);
                }
            }
        }
        return false;
    }


    hasTranstion(parent, transition) {
        parent.some((obj) => {
            console.log(obj.next === transition.next);
        });
    }

    removeNode(node) {

        if (this.start && this.start.name == node.name) {
            this.start = null;
        }

        for (let i = 0; i < this.NODES.length; i++) {
            if (this.NODES[i].name === node.name) {
                this.NODES.splice(i, 1);

                for (let key in this.transitions) {
                    if (key === 'length' || !this.transitions.hasOwnProperty(key)) continue;
                    let val = this.transitions[key];
                    for (let key2 in val) {
                        if (key2 === 'length' || !val.hasOwnProperty(key2)) continue;
                        let val2 = val[key2];
                        if (val2.name == node.name) {
                            this.getNodeFromName(key).removeConnectionWithRule(key2);
                            delete this.transitions[key][key2]
                        }

                    }

                    if (key == node.name) {
                        delete this.transitions[key]
                    }
                }
            }
        }
    }
}