class NFA extends AutomatonBase {

    constructor() {
        super();
    }

    process_string(str) {
        return this.process_transition(this.transitions[this.start.name], str);
    }

    process_transition(transition, str) {
        if(!str){
            return false;
        }

        let next_arr = transition.rules[str[0]];
        if(!next_arr){
            return false;
        }

        for (let i = 0; i < next_arr.length; i++) {
            let next = next_arr[i];
            let next_transition = this.transitions[next.name];
            if(next_transition){
                if(this.process_transition(next_transition, str.slice(1))){
                    return true;
                }
            }

            if(next.finish && str.length ==1){
                return true;
            }
        }

        return false;
    }
}