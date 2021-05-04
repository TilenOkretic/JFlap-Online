class DeltaTransitionsTableTab {

    constructor() {
        this.name = 'Delta Trnansitions Table';
    }

    load(pane) {

        let holder = document.querySelector('.bottom_holder');
        if(holder){
            holder.style.overflow = 'scroll';
        }

        let h = document.createElement('h3');
        h.style.color = 'white';
        h.textContent = this.name + ":";

        pane.appendChild(h);

        let table = document.createElement('table');

        // table.style.width = '100%';
        table.style.borderSpacing = '0px';
        table.style.marginTop = '20px';
        table.style.marginBottom = '20px';

        let states = workspace.getAutomataNodeNames();
        let rules  = workspace.getAutomataRules();

        // let states = ["q0", "q1", "q2"];
        // let rules = ["a", "b", "c", "e"];

        for (let i = 0; i < states.length + 1; i++) {
            let tr = table.insertRow();
            for (let j = 0; j < rules.length + 1; j++) {
                if (i == 0) {
                    if (j == 0) {
                        var td = tr.insertCell();
                        td.appendChild(document.createTextNode("    * "));
                        td.style.width = '30px';
                        td.style.height = '30px';
                        td.style.border = '2px solid white';
                        td.style.textAlign = 'center';
                        td.style.color = 'white';
                    } else {
                        var td = tr.insertCell();
                        td.appendChild(document.createTextNode(rules[j - 1]));
                        td.style.width = '30px';
                        td.style.height = '30px';
                        if (j == rules.length - 1) {
                            td.style.border = '2px solid white';
                            td.style.borderLeft = 'none';
                        } else {
                            td.style.borderTop = '2px solid white';
                            td.style.borderRight = '2px solid white';
                            td.style.borderBottom = '2px solid white';
                        }
                        td.style.textAlign = 'center';
                        td.style.color = 'white';
                    }
                } else {
                    if (j == 0) {
                        var td = tr.insertCell();
                        td.appendChild(document.createTextNode(states[i - 1]));
                        td.style.width = '30px';
                        td.style.height = '30px';

                        td.style.border = '2px solid white';
                        if (i > 0) {
                            td.style.borderTop = 'none';
                        }

                        td.style.textAlign = 'center';
                        td.style.color = 'white';
                    } else {
                        var td = tr.insertCell();
                        let text = workspace.getStateFromRule(states[i - 1], rules[j - 1]);
                        td.style.color = 'white';
                        if(text === 'Φ'){
                            td.style.color = 'red';
                        }
                        td.appendChild(document.createTextNode(text));
                        td.style.width = '30px';
                        td.style.height = '30px';

                        td.style.border = '2px solid white';
                        if (i > 0) {
                            td.style.borderTop = 'none';
                        }

                        td.style.textAlign = 'center';
                    }

                }
            }


            pane.appendChild(table);

        }

    }
}