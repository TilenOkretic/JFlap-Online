/* Renama to Utils*/


let createCard = (text = 'placeholder text', color = 'limegreen', x = 100, y = 0) => {

    let card = document.createElement('div');
    card.className = 'card';
    card.style.transform = 'translate(-300px, 0)';
    document.querySelector('.app').appendChild(card);

    setTimeout(() => {
        card.style.transform = `translate(${x}px, ${y}px)`;
        card.style.background = color;
        card.innerHTML = text;
    }, 100);

    setTimeout(() => {
        card.style.transform = 'translate(-300px,0)';
    }, 2000);

};

let createWrapper = (node, automata) => {
    let wrapper = createDiv();
    wrapper.position(mouseX, mouseY);
    wrapper.addClass('wrapper');

    setCustomElement('start', wrapper, 'selector', () => {
        if (startNodeExist()) {
            if (getStartNode() != node) {
                createCard('Start node is already defined!', 'red');
            }
        }
        node.setStart(!startNodeExist());
        automata.load_automata();
    });

    setCustomElement('finish', wrapper, 'selector', () => {
        node.setFinish(!node.finish);
        automata.load_automata();
    });

};