let workspace;

function setup() {
    document.querySelectorAll('.sidebar-element').forEach(e => {
        e.addEventListener('click', () => {
            setCurrentMode(e.value);

            if (e.value == 'exit') {
                window.open('/', '_self');
            }

            if (e.value === MODE_DELETE_NODES) {
                cursor(`${window.location.href}assets/cancel.png`);
            } else {
                cursor();
            }

            if (e.value === MODE_RUN_INPUTS) {
                resizeCanvas(windowWidth, windowHeight);
                let holder = document.querySelector('.bottom_holder');
                if (holder) {
                    holder.remove();
                    document.querySelector('.workspace_canvas').style.overflow = 'scroll';
                    document.querySelector('.workspace_canvas').style.overflowX = 'hidden';
                } else {
                    createHolder();
                    document.querySelector('.workspace_canvas').style.overflow = 'scroll';
                    document.querySelector('.workspace_canvas').style.overflowX = 'hidden';
                }
            } else if (e.value !== MODE_EDIT_NODES) {
                resizeCanvas(windowWidth, windowHeight);
                let holder = document.querySelector('.bottom_holder');
                if (holder) {
                    document.querySelector('.workspace_canvas').style.overflow = 'hidden';
                    document.querySelector('.workspace_canvas').style.border = 'none';
                    holder.remove();
                }
            }

            createCard(getParsedMode(), 'limegreen');

            setNode();
        });
    });

    document.querySelector('#DFA').addEventListener('click', () => {
        workspace = new DFAWorkspace();
        document.querySelector('.preload').style.display = 'none';
        document.querySelector('.app').style.display = '';
    });

    document.querySelector('#NFA').addEventListener('click', () => {
        workspace = new NFAWorkspace();
        document.querySelector('.preload').style.display = 'none';
        document.querySelector('.app').style.display = '';
    });

    document.getElementById('LA').addEventListener('click', () => {
        if (workspace) {
            workspace.reset();
        }
    }, true);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    if (workspace) {
        workspace.render();
    }
}

function keyPressed() {}

function mousePressed() {
    if (workspace) {
        workspace.mousePressed();
    }
}

function mouseReleased() {
    if (workspace) {
        workspace.mouseReleased();
    }
}

function mouseDragged() {
    if (workspace) {
        workspace.mouseDragged();
    }
}

function doubleClicked() {
    if (workspace) {
        workspace.doubleClicked();
    }
}