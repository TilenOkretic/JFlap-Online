class Tab {

    constructor(name) {
        this.name = name;
    }

    showTabName(pane) {

        while (pane.hasChildNodes()) {
            pane.children.forEach(c => {
                pane.removeChild(c);
            });
        }

        let h = document.createElement('h3');
        h.style.color = 'white';
        h.textContent = this.name + ":";

        pane.appendChild(h);
    }


}