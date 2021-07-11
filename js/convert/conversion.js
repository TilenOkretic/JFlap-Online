class Conversion {

    constructor(name) {
        this.name = name;
    }

    execute() {}

    load(pane) {
        let btn = document.createElement('button');
        btn.textContent = this.name;
        btn.addEventListener('click', this.execute, true);
        pane.appendChild(btn);
    }

}