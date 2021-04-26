/* Refactor to be more dynamic */


let createCard = (text='placeholder text', color='limegreen', x=100, y=0) => {

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

}