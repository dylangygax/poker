// POKER

// DECK


getDeck = () => {
    deck = []
    //construct 52 cards
    for (i = 2; i <= 14; i++) {
        deck.push({suit: "S", rank: i, name: "spades/" + i + ".svg", sorted: false, selected: false})
        deck.push({suit: "H", rank: i, name: "hearts/" + i + ".svg", sorted: false, selected: false})
        deck.push({suit: "D", rank: i, name: "diamonds/" + i + ".svg", sorted: false, selected: false})
        deck.push({suit: "C", rank: i, name: "clubs/" + i + ".svg", sorted: false, selected: false})
    }
    //randomise deck
    shuffledDeck = []
        for (i = 0; i < 52; i++) {
            let pushed = false
            while (pushed === false) {
                let rand = Math.floor(Math.random() * 52)
                if (!(shuffledDeck.includes(deck[rand]))) {
                    shuffledDeck.push(deck[rand])
                    pushed = true
                }
            }
        }
        deck = shuffledDeck
}
//getDeck()
//console.log(deck)

// HAND

class Hand {
    constructor(cards){
        this.cards = cards;
        this.numberOfCardsNeeded = 5 - this.cards.length;
        //this.cards.push(deck.slice(0 , this.numberOfCardsNeeded));
        for (i = 1; i <= this.numberOfCardsNeeded; i++) {
            this.cards.push(deck.shift())
        }
        //console.log(this.cards)
        this.inUseCards = []
        this.selectedCards = []
        this.isFlush = false
        this.isAlmostFlush = false
        this.isStraight = false
        this.isAlmostStraight = false
        this.isStraightFlush = false
        this.isFourOfAKind = false
        this.isFullHouse = false
        this.isThreeOfAKind = false
        this.isTwoPair = false
        this.isPair = false
        // console.log("pizza")
        // Flush 2.0 
        this.suitCounter = [[], [], [], []] // S H D C
        for (i = 0; i <= 4; i++) { // iterates over cards to count suits
            if (this.cards[i].suit === "S") {
                this.suitCounter[0].push (this.cards[i])
            } else if (this.cards[i].suit === "H") {
                this.suitCounter[1].push (this.cards[i])
            } else if (this.cards[i].suit === "D") {
                this.suitCounter[2].push (this.cards[i])
            } else if (this.cards[i].suit === "C") {
                this.suitCounter[3].push (this.cards[i])
            }
        }
        for (i = 0; i <= 3; i++) { //iterates over the four suits checking for a flush
            if (this.suitCounter[i].length === 5) {
                this.isFlush = true
            } else if (this.suitCounter[i].length === 4) {
                this.isAlmostFlush = true
                this.inUseCards = this.suitCounter[i]
            }
        }
        // Sort Cards
        this.sortedRanks = []
        for (i = 0; i < cards.length; i++) {
            this.cards[i].sorted = false
            this.sortedRanks.push(cards[i].rank)
        }
        this.sortedRanks.sort((a,b)=>b-a)
        this.sortedCards = []
        for (i = 0; i < this.sortedRanks.length; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.sortedRanks[i] === this.cards[j].rank && this.cards[j].sorted === false) {
                    this.sortedCards.push(this.cards[j])
                    this.cards[j].sorted = true
                    break
                }
            }
        }
        // console.log(this.sortedCards)
        // Straight Check
        this.straightCounter = 0
        for (i = 0; i <= 3; i++) {
            if (this.sortedCards[i].rank === this.sortedCards[i + 1].rank + 1) { // ERROR HERE
                this.straightCounter += 1
            }
        }
        if (this.straightCounter === 4) {
            this.isStraight = true
        }
        // Almost Straight check. Only tests for the case where you have four in a row, not when you are missing a card in the center ("gutshot"). 
        // This is intentional, as the chances of winning a gutshot are much lower (about half) than the case where you can add a card on top or bottom
        if (this.straightCounter === 3 && this.isAlmostFlush === false) { // inAlmostFlush takes priority since it's a higher hand and more likely 
            this.isAlmostStraight = true
            // sets this.inUseCards to include the four cards that are in a row
            // this.inUseCards = this.sortedCards // IDK why but this equals sign seems like it was assigning both ways. Replaced with the foloowing 3 lines
            for (i = 0; i < 5; i++) {
                this.inUseCards.push(this.sortedCards[i])
            }
            // case where low card is not in straight
            if (this.inUseCards[3].rank !== this.inUseCards[4].rank + 1) {
                this.inUseCards.pop()
            }
            // case where high card is not in straight
            if (this.inUseCards[0].rank !== this.inUseCards[1].rank + 1) {
                this.inUseCards.shift()
            }
        }
        // Matches Check. Fills allMatches with arrays containing arrays of cards with matching suits. 
        // Fills inUseCards with all cards that match at least one other card. 
        // allMatches and inUseCards have the same cards but stored in two levels and one level of structure respectively
        this.allMatches = []
        this.matchesArray = []
        this.inMatch = false
        for (i = 1; i < 5; i++) {
            //console.log(this.sortedCards)
            if (this.sortedCards[i].rank === this.sortedCards[i - 1].rank && this.inMatch === false) {
                this.matchesArray.push(this.sortedCards[i], this.sortedCards[i - 1])
                this.inUseCards.push(this.sortedCards[i], this.sortedCards[i - 1])
                this.inMatch = true
            } else if (this.sortedCards[i].rank === this.sortedCards[i - 1].rank && this.inMatch === true) {
                this.matchesArray.push(this.sortedCards[i])
                this.inUseCards.push(this.sortedCards[i])
            } else if (this.sortedCards[i].rank !== this.sortedCards[i - 1].rank && this.inMatch === true) {
                this.allMatches.push(this.matchesArray)
                this.matchesArray = []
                this.inMatch = false
            }
        }
        // If matchesArray still has a little left (case where the lowest card is part of a pair, three of a kind et cetera)
        if (this.matchesArray.length > 0) {
            this.allMatches.push(this.matchesArray)
        }
        // Uses allMatches to determine the type of hand, for all hand types that are based on matching card ranks
        if (this.allMatches.length === 1) {
            // Four of a Kind
            if (this.allMatches[0].length === 4) {
                this.isFourOfAKind = true
            }
            // Three of a Kind
            else if (this.allMatches[0].length === 3) {
                this.isThreeOfAKind = true
            }
            // Pair
            else if (this.allMatches[0].length === 2) {
                this.isPair = true
            }
        }
        if (this.allMatches.length === 2) {
            // Full House
            if (this.allMatches[0].length === 3 && this.allMatches[1].length === 2) {
                this.isFullHouse = true
            }
            if (this.allMatches[0].length === 2 && this.allMatches[1].length === 3) {
                this.isFullHouse = true
                this.allMatches.push(this.allMatches.shift()) // puts the three of a kind is first, then the pair
            }
            // Two Pair
            if (this.allMatches[0].length === 2 && this.allMatches[1].length === 2) {
                this.isTwoPair = true
                // if (this.allMatches[0][0].rank < this.allMatches[1][0].rank) {
                //    //this.allMatches.push(this.allMatches.shift()) // makes sure higher pair is first
                // }
            } 
        }

        
        //Value of Hand
        this.handValue = 0
        // 8 Straight Flush. 
        if (this.isFlush && this.isStraight) {
            this.handValue = 8 
        }
        // 7 Four of a kind. (PICK)
        else if (this.isFourOfAKind) {
            this.handValue = 7
        }
        // 6 Full house 
        else if (this.isFullHouse) {
            this.handValue = 6
        }
        // 5 Flush 
        else if (this.isFlush) {
            this.handValue = 5 
        }
        // 4 Straight 
        else if (this.isStraight) {
            this.handValue = 4
        }
        // 3 Three of a kind (PICK)
        else if (this.isThreeOfAKind) {
            this.handValue = 3
        }
        // 2 Two pair (PICK)
        else if (this.isTwoPair) {
            this.handValue = 2
        }
        // 1 One Pair (PICK)
        else if (this.isPair) {
            this.handValue = 1
        }
        
        console.log(this.sortedCards)
        // fill in Use cards with highest two cards if there's no hand or almost hand
        if (this.handValue === 0 && this.inUseCards.length === 0) {
            this.inUseCards = [this.sortedCards[0], this.sortedCards[1]]
        }
    }
    // fillCards(){
        
    // }
}

const getWinner = () => {
    if (playersHand.handValue > computersHand.handValue) {
        return "win"
    } else if (playersHand.handValue < computersHand.handValue) {
        return "loss"
    } else { // Tie breakers
        if (playersHand.allMatches.length === 1) { // Four of a Kind, Three of a Kind, Pair
            if (playersHand.allMatches[0][0].rank > computersHand.allMatches[0][0].rank) {
                return "win"
            }
            if (playersHand.allMatches[0][0].rank < computersHand.allMatches[0][0].rank) {
                return "loss"
            }
        } else if (playersHand.allMatches.length === 2) { // Full House, Two Pair
            if (playersHand.allMatches[0][0].rank > computersHand.allMatches[0][0].rank) {
                return "win"
            } else if (playersHand.allMatches[0][0].rank < computersHand.allMatches[0][0].rank) {
                return "loss"
            } else {
                if (playersHand.allMatches[1][0].rank > computersHand.allMatches[1][0].rank) {
                    return "win"
                } else if (playersHand.allMatches[1][0].rank < computersHand.allMatches[1][0].rank) {
                    return "loss"
                }
            }
        } 
        // Highest card wins
        for (i = 0; i < 5; i++) { 
            if (playersHand.sortedCards[i].rank > computersHand.sortedCards[i].rank) {
                return "win"
            } else if (playersHand.sortedCards[i].rank < computersHand.sortedCards[i].rank) {
                return "loss"
            }
            console.log(i + " checked")            
        }
        return "win"//this is the case where both players have the exact same value cards. I give the tie breaker to the player. Seems like a nice thing to do. In practice this will really never run

    }
}

// const manuallyReplaceCards = (hand) => {
//     hand = new Hand(hand.selectedCards)
// }


// const round = () => {
//     let playersHand = new Hand ([])
//     let computersHand = new Hand ([])
//     // DOM: top of screen displays 5 face down cards (opactity 0 -> 1). *Bottom screen displays the players cards. Deal button disapears. 
//     //     "Deal cards" and "Keep cards" appear. Info from previous turn such as winner et cetera disapears.
    
//     // when user hits keep cards: autoReplaceCards(computersHand)
//     // when user hits Deal Cards: if (playersHand.selectedCards = []) {alert: "pick some card dude"} else {}

// }



//  let playersHand = new Hand ([{suit: "S", rank: 14, name: "H10", sorted: false}, {suit: "C", rank: 12, name: "H10", sorted: false}, {suit: "H", rank: 10, name: "H10", sorted: false}, {suit: "S", rank: 9, name: "H10", sorted: false}, {suit: "H", rank: 7, name: "H10", sorted: false}])
// let computersHand = new Hand ([{suit: "H", rank: 14, name: "H10", sorted: false}, {suit: "C", rank: 12, name: "H10", sorted: false}, {suit: "H", rank: 13, name: "H10", sorted: false}, {suit: "S", rank: 11, name: "H10", sorted: false}, {suit: "H", rank: 7, name: "H10", sorted: false}])


let playersHand = {}
let computersHand = {}

const showPlayersCards = () => {
    playerCard0.setAttribute('src', 'assets/images/cards/' + playersHand.cards[0].name)
    playerCard1.setAttribute('src', 'assets/images/cards/' + playersHand.cards[1].name)
    playerCard2.setAttribute('src', 'assets/images/cards/' + playersHand.cards[2].name)
    playerCard3.setAttribute('src', 'assets/images/cards/' + playersHand.cards[3].name)
    playerCard4.setAttribute('src', 'assets/images/cards/' + playersHand.cards[4].name)
}

const showComputerCards = () => {
    computerCard0.setAttribute('src', 'assets/images/cards/' + computersHand.cards[0].name)
    computerCard1.setAttribute('src', 'assets/images/cards/' + computersHand.cards[1].name)
    computerCard2.setAttribute('src', 'assets/images/cards/' + computersHand.cards[2].name)
    computerCard3.setAttribute('src', 'assets/images/cards/' + computersHand.cards[3].name)
    computerCard4.setAttribute('src', 'assets/images/cards/' + computersHand.cards[4].name)
}

const showBacksOfComputerCards = () => {
    computerCard0.setAttribute('src', 'assets/images/cards/backs/blue.svg')
    computerCard1.setAttribute('src', 'assets/images/cards/backs/blue.svg')
    computerCard2.setAttribute('src', 'assets/images/cards/backs/blue.svg')
    computerCard3.setAttribute('src', 'assets/images/cards/backs/blue.svg')
    computerCard4.setAttribute('src', 'assets/images/cards/backs/blue.svg')
}

const deal = () => {
    getDeck()
    playersHand = new Hand ([])
    computersHand = new Hand ([])
    console.log(playersHand.sortedCards)
    console.log(playersHand.handValue)
    console.log(computersHand.sortedCards)
    console.log(computersHand.handValue)
    console.log(computersHand.inUseCards)
    console.log(getWinner())
    // DOM: top of screen displays 5 face down cards (opactity 0 -> 1). 
    // Bottom screen displays the players cards. Deal button disapears. 
    showPlayersCards()
    showBacksOfComputerCards()
    //     "Deal cards" and "Keep cards" appear. Info from previous turn such as winner et cetera disapears.
}

const autoReplaceCards = () => {
    if (computersHand.handValue === 7 || computersHand.handValue <= 3) {
        computersHand = new Hand(computersHand.inUseCards)
    }
    console.log("replace haha")
    console.log(computersHand.sortedCards)
    console.log(computersHand.handValue)
}

const manuallyReplaceCards = () => {
    for (i = 0; i < 5; i++) {
        if (playersHand.cards[i].selected === true) {
            playersHand.selectedCards.push(playersHand.cards[i])
        }
    }
    playersHand = new Hand(playersHand.selectedCards)
}


const finishRound = () => {
    autoReplaceCards()
    // DOM: Deal button appears. Top of screen displays computer's cards. Hand is displayed in text for both computer and player      
    showComputerCards()
    if (getWinner() === "win") {
        //display "You win!!"
        console.log("YOU WIN!!")
    }
    if (getWinner() === "loss") {
        //display "You lose!!"
        console.log("YOU LOSE!!")
    }
}

// Deal Button
// const dealButton = document.getElementById('deal')
const dealButton = document.querySelector('.deck-card')
dealButton.addEventListener('click', function(){
    console.log("yeet")
    deal()
})

// Hold Cards Button
const holdCardButton = document.getElementById('hold-cards')
holdCardButton.addEventListener('click', function(){
    //console.log("yeet 2049")
    finishRound()
})

// Draw Cards Button

const drawCardButton = document.getElementById('draw-cards')
drawCardButton.addEventListener('click', function(){
    //console.log("yeet 2049")
    manuallyReplaceCards()
    showPlayersCards()
    finishRound()
})

// Player Cards
const playerCard0 = document.getElementById('pc0')
const playerCard1 = document.getElementById('pc1')
const playerCard2 = document.getElementById('pc2')
const playerCard3 = document.getElementById('pc3')
const playerCard4 = document.getElementById('pc4')

// Player Cards - functionality
playerCard0.addEventListener('click', function(){
    playersHand.cards[0].selected = !(playersHand.cards[0].selected)
    console.log(playersHand.cards[0].selected)
    //playerCard0.setAttribute('class', '.red-border')
})
playerCard1.addEventListener('click', function(){
    playersHand.cards[1].selected = !(playersHand.cards[1].selected)
    console.log(playersHand.cards[1].selected)
})
playerCard2.addEventListener('click', function(){
    playersHand.cards[2].selected = !(playersHand.cards[2].selected)
    console.log(playersHand.cards[2].selected)
})
playerCard3.addEventListener('click', function(){
    playersHand.cards[3].selected = !(playersHand.cards[3].selected)
    console.log(playersHand.cards[3].selected)
})
playerCard4.addEventListener('click', function(){
    playersHand.cards[4].selected = !(playersHand.cards[4].selected)
    console.log(playersHand.cards[4].selected)
})

// Computer Cards

const computerCard0 = document.getElementById('cc0')
const computerCard1 = document.getElementById('cc1')
const computerCard2 = document.getElementById('cc2')
const computerCard3 = document.getElementById('cc3')
const computerCard4 = document.getElementById('cc4')

// let playersHand = new Hand ([])
// let computersHand = new Hand ([])
// console.log(playersHand.sortedCards)
// console.log(playersHand.handValue)
// console.log(computersHand.sortedCards)
// console.log(computersHand.handValue)
// console.log(computersHand.inUseCards)
// console.log(getWinner())


/* TO DO
    Complete tie breaker stuff
        make sure that Full house and two pair are correctly ordered X
        ultimate tie breaker X
    Complete logic for filling inUseCards, using allMatches X
    Computer AI
    Psuedocode entire game
    Create visual layout


*/


/*

game():
initial load of page elements
when user hits "Deal" button: turn()

turn():

1. User hits "Deal" button. 
    The user receives 5 cards they can see at the bottom of the screen. At the top is five cards face down -- the computer's hand. 
    User now has the option of two buttons: "Draw cards" or "Keep cards"

    Unseen: create two new Hands
    DOM: top of screen displays 5 face down cards (opactity 0 -> 1). *Bottom screen displays the players cards. Deal button disapears. 
        "Deal cards" and "Keep cards" appear. Info from previous turn such as winner et cetera disapears.
    
2. Three possibilities here:
    User hits "Keep Cards". Nothing happens. Proceed to next step.
    User selects several of the cards by clicking, then clicks "Draw Cards". The cards selected are replaced by new cards. Proceed to next step.
    User selects no cards but hits "Draw Cards" anyway. An alert is displayed: "Click on the cards you want to discard before clicking 'Draw Cards'". Do not proceed.

    DOM: If "Keep cards", proceed to next step
        If user clicks "Draw Cards" without selecting cards: alert displayed
        If user clicks cards: cards move up to show they are selected
        If user then clicks "Draw Cards": playersHand = new Hand(playersHand.selectedCards. *Bottom screen displays the players cards. proceed to next step
    "Deal cards" and "Keep cards" disappear.
        

3.  Here the computer replaces cards. There is some kind of visual or textual indication how many cards are being drawn. 
    The computer will decide how many/which cards to replace by a deterministic algorythm based on the hand they currently have. A rough idea of how that'd work:
        For Straight Flush, Flush, Straight, Full House: replace 0
        For Four of a Kind and Two Pair: replace 1 
        For Three of a Kind: replace 2 
        For Pair: replace 3
        For No Hand: replace 3 lowest cards

        computerDraws()

4. The computer's cards are revealed. The hand (e.g. Full House, Two Pair) is declared in text for both the user and the computer. 
    Text displays "You win!" or "You lose!" 
    User has the option of a "Deal" button 
    Cards are returned to the deck and deck reshuffled

    getWinner()
    DOM: winner element displays "You win!" or "You lose!" Top of screen displays computer's cards. Hand is displayed in text for both computer and player
            Deal button appears. 

Organisation of page:

            LEFT                                                CENTERED                                        RIGHT
Top third   "Dealer's Hand" [computerHand.handValueName]        Computer's cards                                (options panel)

Center third Winner messege                                     pereptually face down "deck" card               Deal button

Bottom third "Your Hand" [playersHand.handValueName]            Player's cards                                  "Draw cards"/"Hold Cards" buttons

DOM elements needed:


*/