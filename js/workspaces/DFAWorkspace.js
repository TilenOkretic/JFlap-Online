class DFAWorkspace extends WorkspaceBase {

    constructor() {
        super(new DFA(), NodeDFA);
        this.name = 'DFA';
    }


    reset() {
        workspace = new DFAWorkspace();

        let holder = document.querySelector('.bottom_holder');
        if (holder) {
            holder.remove();
            holder = null;
        }

        createCard('DFA Workspace Reset', 'orange');

    }
}