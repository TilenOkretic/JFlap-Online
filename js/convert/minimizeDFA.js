class MinemizeDFA extends Conversion {

    constructor() {
        super('Minimize DFA');
    }


    execute() {
        let automata = getAutomata();
        let {
            nfs: nfs0,
            fs: fs0
        } = automata.getZeroEquivalance();

        let removeUnreachable = (nfs, fs) => {
            for (let i = 0; i < nfs.length; i++) {
                if (!workspace.getAutomata().hasTransitionIn(nfs[i])) {
                    nfs.splice(i, 1);
                }
            }
            for (let i = 0; i < fs.length; i++) {
                if (!workspace.getAutomata().hasTransitionIn(fs[i])) {
                    fs.splice(i, 1);
                }
            }

            return {
                nfs,
                fs
            };
        }

        let {
            nfs,
            fs
        } = removeUnreachable(nfs0, fs0);

    }

}