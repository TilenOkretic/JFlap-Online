
let final;
let start;

let transitions = [];


// main load 
function load_automata() {
    NODES.forEach(element => {
        if(element.start){
            start = element;
        } else if(element.finish) {
            finish = element;
        }

        load_transitions(element);
    });
    
    console.log(start);
}

function load_transitions(node) {
    node.connections.forEach(conn => {
        if(!transitions[conn.parent.name])
        {
            transitions[conn.parent.name] = [];
        }
        transitions[conn.parent.name][conn.rule] = conn.next_state;
    });
}

function process_string(str) {
    let next = transitions[start.name][str[0]];
    for (let c = 1; c < str.length; c++) {
        const char = str[c];
        if(!next){
            return false;
        }
        next = transitions[next.name][char]
    }

    return next ? next.finish : false;
}
