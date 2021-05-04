class DFA extends AutomatonBase {

    constructor() {
        super();
    }

    process_string(str) {

        if (!this.transitions[this.start.name] || !this.transitions[this.start.name].rules[str[0]]) {
            return false;
        }
        let next = this.transitions[this.start.name].rules[str[0]][0];
        for (let j = 1; j < str.length; j++) {
            let rule = str[j];
            next = this.transitions[next.name].rules[rule][0];
        }

        return next ? next.finish : false;
    }

}