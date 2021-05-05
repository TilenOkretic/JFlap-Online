class NFAWorkspace extends WorkspaceBase {

    constructor() {
        super('NFA', new NFA(), NodeNFA);
    }

    reset() {
        workspace = new NFAWorkspace();

        let holder = document.querySelector('.bottom_holder');
        if (holder) {
            holder.remove();
            holder = null;
        }

        createCard('NFA Workspace Reset', 'orange');

    }
    
}