class NFA extends AutomatonBase {

    constructor() {
        super();
    }

    process_string(str) {

        if (!this.transitions[this.start.name]) {
            return false;
        }
        
        let next     = this.transitions[this.start];
        
        let next_arr = next.rules[str[0]];
        console.log(next_arr);

        // for(let i = 0; i <)
    }
}