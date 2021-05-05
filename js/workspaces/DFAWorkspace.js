class DFAWorkspace extends WorkspaceBase {

    constructor() {
        super('DFA', new DFA(), NodeDFA);
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