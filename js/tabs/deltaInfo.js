class DeltaInfoTab {

    constructor() {
        this.name = 'Delta Trnansitions';
    }

    load(pane) {

        let h = document.createElement('h3');
        h.style.color = 'white';
        h.textContent = this.name+":";
        
        pane.appendChild(h);

        workspace.getDeltaTransitions().forEach(element => {
            let p = document.createElement('p');
            p.style.color = 'white';
            p.textContent = element;
            pane.appendChild(p);
        });


    }

}