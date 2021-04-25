let final;
let start;

let transitions = [];


// main load 
function load_automata() {
    NODES.forEach(element => {
        if (element.start) {
            start = element;
        } else if (element.finish) {
            finish = element;
        }

        load_transitions(element);
    });

    console.log(start);
}

function load_transitions(node) {
    node.connections.forEach(conn => {
        if (!transitions[conn.parent.name]) {
            transitions[conn.parent.name] = {
                arr: [],
                rules: [conn.rule]
            };
        } else {
            if (transitions[conn.parent.name].rules.indexOf(conn.rule) == -1) {
                transitions[conn.parent.name].rules.push(conn.rule);
            }
        }
        transitions[conn.parent.name].arr[conn.rule] = conn.next_state;
    });
}

function process_string(str) {
    let next = transitions[start.name].arr[str[0]];
    for (let c = 1; c < str.length; c++) {
        const char = str[c];
        if (!next) {
            return false;
        }
        next = transitions[next.name].arr[char];
    }

    return next ? next.finish : false;
}


document.getElementById('LA').addEventListener('click', load_automata, true);


function getNodeFromName(name) {

    for (let i = 0; i < NODES.length; i++) {
        const node = NODES[i];
        if (node.name == name) {
            return node;
        }
    }

    return;

}

function drawConnections() {

    for (let i = 0; i < NODES.length; i++) {
        let node = NODES[i];
        if (transitions[node.name]) {
            let arr = transitions[node.name].arr;
            let rules = transitions[node.name].rules;
            let frule = "";
            for (let j = 0; j < rules.length; j++) {
                if (j < rules.length - 1) {
                    frule += `${rules[j]},`
                } else {
                    frule += `${rules[j]}`
                }
            }

            let other = arr[rules[0]];
            drawConnectionLine(frule, node, other);
        }
    }

}

function drawConnectionLine(rule, node, other) {
    let x1 = node.pos.x;
    let y1 = node.pos.y;
    let r1 = node.p / 2;

    let x2 = other.pos.x;
    let y2 = other.pos.y;
    let r2 = other.p / 2;

    let ΔY = y2 - y1
    let ΔX = x2 - x1

    let L = sqrt((ΔX * ΔX + ΔY * ΔY));

    let r1L = r1 / L;
    let r2L = r2 / L;

    let y12 = y1 + ΔY * r1L;
    let y22 = y2 - ΔY * r2L;

    let x12 = x1 + ΔX * r1L;
    let x22 = x2 - ΔX * r2L;

    let tx = (x12 + x22) / 2 + 14;
    let ty = (y12 + y22) / 2 - 14;
    // console.log(connection);
    if (other.top) {
        ty = (y12 + y22) / 2 + 24;
    }

    fill(255);
    text(rule, tx, ty);
    noFill();
    strokeWeight(3);
    beginShape();
    vertex(x12, y12);

    // TODO: line separation

    vertex(x22, y22);
    endShape();
}