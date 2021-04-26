class DFA {

    constructor() {
        this.transitions = [];
        this.NODES = [];
    }

    load_automata() {
        this.NODES.forEach(element => {
            if (element.start) {
                this.start = element;
            } else if (element.finish) {
                this.final = element;
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
        if(node_vec.x  < other_vec.x + 5 && node_vec.x > other_vec.x - 5 ){
            if(node_vec.y > other_vec.y) {
                translate(node_vec.x - off*2, node_vec.y - v.mag() / 2);
                rotate(v.heading() + PI);
                fill(255);
                text(rule, 0, 0);
            }else {
                translate(node_vec.x + off, node_vec.y + v.mag() / 2);
                rotate(v.heading());
                fill(255);
                text(rule, 0, 0);
            }
        }else if (v.heading() > 1.599) {
            if (node_vec.x > other_vec.x) {
                translate(node_vec.x, node_vec.y);
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
                translate(node_vec.x, node_vec.y);
                rotate(v.heading() + PI);
                fill(255);
                text(rule, -v.mag() / 2, off * 2);
            } else {
                translate(node_vec.x, node_vec.y);
                rotate(v.heading() - PI);
                fill(255);
                text(rule, -v.mag() / 2, -off);
            }
        } else {
            if (node_vec.x > other_vec.x) {
                translate(node_vec.x, node_vec.y);
                rotate(v.heading());
                fill(255);
                text(rule, -v.mag() / 2, +off);
            } else {
                translate(node_vec.x, node_vec.y);
                rotate(v.heading());
                fill(255);
                text(rule, v.mag() / 2, -off);
            }
        }


        pop();
    }


    hasTranstion(parent, transition) {
        parent.some((obj) => {
            console.log(obj.next === transition.next);
        });
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