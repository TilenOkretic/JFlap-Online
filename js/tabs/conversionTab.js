class ConversionTab extends Tab{

    constructor() {
        super('Convert');
        this.functions = [];
        this.functions.push(new MinemizeDFA());
    }

    load(pane) {
        this.functions.forEach(f => {
            f.load(pane);
        });
    }

}