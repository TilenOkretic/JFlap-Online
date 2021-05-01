class NodeBase {
    constructor(name) {
        this.setPos(mouseX, mouseY);
        this.name = name;

        this.p = 50;

        this.id = int(random(0, 100000));


        this.start = false;
        this.finish = false;

        this.connections = [];
    }

    setPos(x, y) {
        this.pos = createVector(x, y);
        return this.pos;
    }

    setStart(val) {
        this.start = val;
        return this.start;
    }

    setFinish(val) {
        this.finish = val;
        return this.finish;
    }

    show() {

        // fill(133, 151, 49); this is the old green
        fill(255,255,47);
        strokeWeight(4);
        ellipse(this.pos.x, this.pos.y, this.p, this.p);


        if (this.start) {
            fill(255);
            triangle(this.pos.x - this.p / 2, this.pos.y, this.pos.x - this.p / 2 - 20, this.pos.y + 30, this.pos.x - this.p / 2 - 20, this.pos.y - 30)
        }

        if (this.finish) {
            noFill();
            ellipse(this.pos.x, this.pos.y, this.p - 8, this.p - 8);
        }

        fill(0);
        textSize(this.p * 0.4);
        textAlign(CENTER);
        text(this.name, this.pos.x, this.pos.y + 6);


    }

    process_char(chars, i) {

        if (chars.length == i || this.connections.length == 0) {
            return this.finish;
        }

        for (let i = 0; i < this.connections.length; i++) {
            const conn = this.connections[i];
            if (conn.rule == chars[i]) {
                return conn.next_state.process_char(chars, ++i, conn.next_state);
            }
        }
    }

    addConnection(next_state) {
    }

    hasConnectionWithRule(rule) {
    }

    removeConnectionWithRule(rule) {
        this.connections = this.connections.filter(data => data.rule != rule);
    }

    hasNextState(state) {
        state.next_state.connections.forEach(conn => {
            if (conn.next_state.name == state.parent.name) {
                return true;
            }
        });
        return false;
    }

    setName(name){
        this.name = name;
        return this.name;
    }

    getName() {
        return this.name;
    }
}