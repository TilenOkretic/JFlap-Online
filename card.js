/* Refactor to be more dynamic */
class Card {

    constructor() {

        let card = document.createElement('div');
        card.className = 'card';
        card.style.transform = 'translate(-300px, 0)';
        document.querySelector('.app').appendChild(card);

        setTimeout(() => {
            card.style.transform = 'translate(100px, 0)';
            card.style.background = 'limegreen';
            card.innerHTML = getParsedMode();;
        }, 100);

        setTimeout(() => {
            card.style.transform = 'translate(-300px,0)';
        }, 2000);

        this.card = card;
    }

    getCard() {
        return this.card;
    }
}