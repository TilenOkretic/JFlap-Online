class NFAWorkspace extends WorkspaceBase {

    constructor() {
        super(new NFA(), NodeNFA);
        this.name = 'NFA';
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