class RunInputsTab {


    constructor() {
        this.name = 'Run Inputs';
    }

    load(pane) {


        let h = document.createElement('h3');
        h.style.color = 'white';
        h.textContent = this.name+":";
        
        pane.appendChild(h);


        let table = document.createElement('div');
        table.className = 'input_table';
        
        addInputToTable(table);

        pane.appendChild(table);

        let btn = document.createElement('button');
        btn.textContent = 'Run';
        btn.style.width = '120px';
        btn.style.marginTop = '2rem';

        btn.addEventListener('click', () => {
            if (!getAutomata().hasStartNode()) {
                createCard('No START node available!', 'red');
                return;
            }
            for (let i = 0; i < table.children.length; i++) {
                let pocket_elements = table.children[i].children;
                for (let j = 0; j < pocket_elements.length; j++) {
                    const input_text = pocket_elements[j].children[0].value;
                    const label = pocket_elements[j].children[1];
                    if (input_text) {
                        let out = getAutomata().process_string(input_text);
                        label.textContent = out ? "Accepted" : "Rejected";
                    }
                }
            }
        });
        pane.appendChild(btn);

    }

}