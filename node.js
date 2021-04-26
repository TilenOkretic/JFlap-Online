class Node {
    constructor(name) {
        this.setPos(mouseX, mouseY);
        this.name = name;

        this.p = 50;

        this.id = int(random(0, 100000));


        this.start = false;
        this.finish = false;

        this.connections  = [];
    }

    setPos(x, y) {
        this.pos = createVector(x,y);
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

        fill(133, 151, 49);
        strokeWeight(2);
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
        

        if(chars.length == i || this.connections.length == 0){
            return this.finish;
        }

        for (let i = 0; i < this.connections.length; i++) {
            const conn = this.connections[i];
            if(conn.rule == chars[i]){
                console.log(conn.next_state);
                return conn.next_state.process_char(chars, ++i, conn.next_state);
            }
            
        }

    }

    addConnection(next_state) {

        /* TODO: Rule parsing/cheking, maybe */
        let connection = {
            parent: this,
            next_state,
            rule: '-'
        };

        input = createInput('');
        input.elt.id = 'input';
        let xSize = 50;

        input.size(xSize, xSize * 2 / 5);
        input.position((next_state.pos.x + this.pos.x)/2  , 0.5 * (next_state.pos.y + this.pos.y) );


        document.getElementById("input").addEventListener("keydown", (event) => {
            if (event.key === 'Enter') {
                connection.rule = input.value();
                this.connections.push(connection);
                this.hasNextState(connection);
                input.remove();
                automata.load_automata();
                setEdit();
            }
        }, false);




        return connection;
    }

    hasNextState(state) {
        state.next_state.connections.forEach(conn => {
            if (conn.next_state.name == state.parent.name) {
                state.next_state.top = true;
                return true;
            }
        });
        return false;
    }

}