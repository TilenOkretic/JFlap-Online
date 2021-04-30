class NFAWorkspace extends WorkspaceBase {

    constructor() {
        super(new NFA(), NodeNFA);
        this.name = 'NFA';
    }
    
}