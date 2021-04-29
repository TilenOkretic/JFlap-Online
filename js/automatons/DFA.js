class DFA extends AutomatonBase {

    constructor() {
        super();
    }

    process_string(str) {
        if (!this.transitions[this.start.name]) {
            return false;
        }
        
        let next = this.transitions[this.start.name][str[0]];
        
        for (let c = 1; c < str.length; c++) {
            const char = str[c];
            if (!next) {
                return false;
            }
            if (!this.transitions[next.name]) {
                return false;
            }
            next = this.transitions[next.name][char];
        }

        return next ? next.finish : false;
    }
    
}