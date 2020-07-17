// POKER

// CHIPS

let chips = 1000
let wager = 0
let raise = 0
let pot = 0

// HAND

//let playersHand = new Hand ([{suit: "S", rank: 14, name: "H10", sorted: false}, {suit: "C", rank: 12, name: "H10", sorted: false}, {suit: "H", rank: 10, name: "H10", sorted: false}, {suit: "S", rank: 9, name: "H10", sorted: false}, {suit: "H", rank: 7, name: "H10", sorted: false}])
//let computersHand = new Hand ([{suit: "H", rank: 14, name: "H10", sorted: false}, {suit: "C", rank: 12, name: "H10", sorted: false}, {suit: "H", rank: 13, name: "H10", sorted: false}, {suit: "S", rank: 11, name: "H10", sorted: false}, {suit: "H", rank: 7, name: "H10", sorted: false}])

class Hand {
    constructor(cards){
        this.cards = cards;
        this.numberOfCardsNeeded = 5 - this.cards.length;
        for (i = 1; i <= this.numberOfCardsNeeded; i++) {
            this.cards.push(deck.shift())
        }
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
        // Flush
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
            if (this.sortedCards[i].rank === this.sortedCards[i + 1].rank + 1) { 
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
            this.inUseCards = [...this.sortedCards] // S P R E A D
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
        // If matchesArray still has a little left (the case where the lowest card is part of a pair, three of a kind et cetera)
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
                this.allMatches.push(this.allMatches.shift()) // puts the three of a kind first, then the pair
            }
            // Two Pair
            if (this.allMatches[0].length === 2 && this.allMatches[1].length === 2) {
                this.isTwoPair = true
            } 
        }

        
        //Value of Hand
        this.handValue = {value: 0, name: "High Card"}
        // 8 Straight Flush. 
        if (this.isFlush && this.isStraight) {
            this.handValue = {value: 8, name: "Straight Flush!!!"} 
        }
        // 7 Four of a kind. (PICK)
        else if (this.isFourOfAKind) {
            this.handValue = {value: 7, name: "Four of a Kind!"} 
        }
        // 6 Full house 
        else if (this.isFullHouse) {
            this.handValue = {value: 6, name: "Full House!"}
        }
        // 5 Flush 
        else if (this.isFlush) {
            this.handValue = {value: 5, name: "Flush"}
        }
        // 4 Straight 
        else if (this.isStraight) {
            this.handValue = {value: 4, name: "Straight"}
        }
        // 3 Three of a kind (PICK)
        else if (this.isThreeOfAKind) {
            this.handValue = {value: 3, name: "Three of a Kind"}
        }
        // 2 Two pair (PICK)
        else if (this.isTwoPair) {
            this.handValue = {value: 2, name: "Two Pair"}
        }
        // 1 One Pair (PICK)
        else if (this.isPair) {
            this.handValue = {value: 1, name: "Pair"}
        }
        // Creating a more specific display name for handValue basedo n the highest card
        if (this.handValue.value === 0) {
            if (this.sortedCards[0].rank <= 10) {
                this.handValue.name = this.sortedCards[0].rank + " High"
            }
            if (this.sortedCards[0].rank === 11) {
                this.handValue.name = "Jack High"
            }
            if (this.sortedCards[0].rank === 12) {
                this.handValue.name = "Queen High"
            }
            if (this.sortedCards[0].rank === 13) {
                this.handValue.name = "King High"
            }
            if (this.sortedCards[0].rank === 14) {
                this.handValue.name = "Ace High"
            }
        }
        
        // fill in Use cards with highest two cards if there's no hand or almost hand
        if (this.handValue.value === 0 && this.inUseCards.length === 0) {
            this.inUseCards = [this.sortedCards[0], this.sortedCards[1]]
        }

        // Organized Cards: for displaying what player and computer has at the end of each round. 
        this.organizedCards = [...this.inUseCards] // S P R E A D
        for (i = 0; i < 5; i++){
            if (!this.organizedCards.includes(this.sortedCards[i])) {
                this.organizedCards.push(this.sortedCards[i])
            }
        }
        // console.log(this.sortedCards)
        // console.log(this.inUseCards)
    }
}

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

const getWinner = () => {
    if (playersHand.handValue.value > computersHand.handValue.value) {
        return "win"
    } else if (playersHand.handValue.value < computersHand.handValue.value) {
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

//////////////////////////// Display functions

const showPlayersCards = () => {
    playerCard0.setAttribute('src', 'assets/images/cards/' + playersHand.cards[0].name)
    playerCard1.setAttribute('src', 'assets/images/cards/' + playersHand.cards[1].name)
    playerCard2.setAttribute('src', 'assets/images/cards/' + playersHand.cards[2].name)
    playerCard3.setAttribute('src', 'assets/images/cards/' + playersHand.cards[3].name)
    playerCard4.setAttribute('src', 'assets/images/cards/' + playersHand.cards[4].name)
}

const showPlayersCardsAtEnd = () => {
    playerCard0.setAttribute('src', 'assets/images/cards/' + playersHand.organizedCards[0].name)
    playerCard1.setAttribute('src', 'assets/images/cards/' + playersHand.organizedCards[1].name)
    playerCard2.setAttribute('src', 'assets/images/cards/' + playersHand.organizedCards[2].name)
    playerCard3.setAttribute('src', 'assets/images/cards/' + playersHand.organizedCards[3].name)
    playerCard4.setAttribute('src', 'assets/images/cards/' + playersHand.organizedCards[4].name)
    playerCard0.classList.remove('selected-card')
    playerCard1.classList.remove('selected-card')
    playerCard2.classList.remove('selected-card')
    playerCard3.classList.remove('selected-card')
    playerCard4.classList.remove('selected-card')
}

const showComputerCards = () => {
    computerCard0.setAttribute('src', 'assets/images/cards/' + computersHand.organizedCards[0].name)
    computerCard1.setAttribute('src', 'assets/images/cards/' + computersHand.organizedCards[1].name)
    computerCard2.setAttribute('src', 'assets/images/cards/' + computersHand.organizedCards[2].name)
    computerCard3.setAttribute('src', 'assets/images/cards/' + computersHand.organizedCards[3].name)
    computerCard4.setAttribute('src', 'assets/images/cards/' + computersHand.organizedCards[4].name)
}

const showBacksOfComputerCards = () => {
    computerCard0.setAttribute('src', 'assets/images/cards/backs/blue.svg')
    computerCard1.setAttribute('src', 'assets/images/cards/backs/blue.svg')
    computerCard2.setAttribute('src', 'assets/images/cards/backs/blue.svg')
    computerCard3.setAttribute('src', 'assets/images/cards/backs/blue.svg')
    computerCard4.setAttribute('src', 'assets/images/cards/backs/blue.svg')
}

const displayFinalInfo = () => {
    playersHandText.innerText = playersHand.handValue.name
    console.log(playersHand.handValue.name)
    computersHandText.innerText = computersHand.handValue.name
    helpfulText.innerText = 'Click the deck to deal another hand!'
    showComputerCards()
    showPlayersCardsAtEnd()
    pot = 0
    chipsCounter.innerText = "Chips: " + chips
    potCounter.innerText = "Pot: " + pot
    computersOffer.innerText = ""
    foldButton2.classList.add('hidden')
    callButton.classList.add('hidden')
    wagerBox.classList.add('hidden')
    drawCardButton.classList.add('hidden')
    holdCardButton.classList.add('hidden')
    foldButton.classList.add('hidden')
}



/////////////////////////////// Functional functions

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
    //     "Deal cards" and "Keep cards" appear. 
    winnerText.innerText = ""
    playersHandText.innerText = ""
    computersHandText.innerText = ""
    helpfulText.innerText = ""
    wagerBox.classList.remove('hidden')
    drawCardButton.classList.remove('hidden')
    holdCardButton.classList.remove('hidden')
    foldButton.classList.remove('hidden')
}

const checkSelected = () => {
    console.log(playersHand.cards)
    for (i = 0; i < 5; i++) {
        if (playersHand.cards[i].selected === true) {
            return true
        }
    }
    return false
}

const getWager = () => {
    if (99 < parseInt(document.getElementById('wager-box').value) && parseInt(document.getElementById('wager-box').value) <= chips) {
        wager = document.getElementById('wager-box').value
        console.log(wager)
        pot = parseInt(wager) * 2
        console.log(pot)
        chips = chips - parseInt(wager)
        console.log(chips)
        chipsCounter.innerText = "Chips: " + chips
        potCounter.innerText = "Pot: " + pot
        return true
    } else {
        alert("wager must be at least 100 and no more than chips")
        return false
    }
}

const manuallyReplaceCards = () => {
    for (i = 0; i < 5; i++) {
        if (playersHand.cards[i].selected === false) {
            playersHand.selectedCards.push(playersHand.cards[i])
        }
    }
    playersHand = new Hand(playersHand.selectedCards)
}

const autoReplaceCards = () => {
    if (computersHand.handValue.value === 7 || computersHand.handValue.value <= 3) {
        computersHand = new Hand(computersHand.inUseCards)
    }
    console.log("replace haha")
    console.log(computersHand.sortedCards)
    console.log(computersHand.handValue)
}

const getRaise = () => {
    wagerBox.classList.add('hidden')
    drawCardButton.classList.add('hidden')
    holdCardButton.classList.add('hidden')
    foldButton.classList.add('hidden')
    if (chips >= 100) {
        raise = computersHand.handValue.value + 3
        console.log(raise)
        raise = raise + Math.floor(Math.random() * 5)
        console.log(raise)
        raise = Math.max(Math.min(raise, 10), 0)
        console.log(raise)
        raise = Math.floor(raise * chips * .1)
        console.log(raise)
        computersOffer.innerText = "Dealer raises " + raise + " call or fold?"
        foldButton2.classList.remove('hidden')
        callButton.classList.remove('hidden')
    } else {
        finishRound()
    }
}

const finishRound = () => {
    if (getWinner() === "win") {
        winnerText.innerText = "You win!!"
        console.log("YOU WIN!!")
        chips = chips + pot
    }
    if (getWinner() === "loss") {
        winnerText.innerText = "You lose!!"
        console.log("YOU LOSE!!")
    }
    displayFinalInfo()
}

const fold = () => {
    winnerText.innerText = "Fold!"
    displayFinalInfo()
}

////////////////////// DOM Elements

// Deal Button
// const dealButton = document.getElementById('deal')
const dealButton = document.querySelector('.deck-card')
dealButton.addEventListener('click', function(){
    console.log("yeet")
    deal()
})

// Wager Box
const wagerBox = document.getElementById('wager-box')

// Draw Cards Button
const drawCardButton = document.getElementById('draw-cards')
drawCardButton.addEventListener('click', function(){
    //console.log("yeet 2049")
    if (checkSelected()) {
        if (getWager() === true) {
            manuallyReplaceCards()
            showPlayersCardsAtEnd()
            autoReplaceCards()
            getRaise()
        }
    } else {
        alert("pick some cards to discard, you damned fool!")
    }
})

// Hold Cards Button
const holdCardButton = document.getElementById('hold-cards')
holdCardButton.addEventListener('click', function(){
    //console.log("yeet 2049")
    //getWager()
    if (getWager() === true) {
        autoReplaceCards()
        getRaise()
    }
})

// Fold button
const foldButton = document.getElementById('fold')
foldButton.addEventListener('click', function(){
    fold()
})

// Fold Button 2
const foldButton2 = document.getElementById('fold2')
foldButton2.addEventListener('click', function(){
    fold()
})

// Chips counter
const chipsCounter = document.getElementById('chips-counter')

// Pot counter
const potCounter = document.getElementById('pot-counter')

// Player Cards
const playerCard0 = document.getElementById('pc0')
const playerCard1 = document.getElementById('pc1')
const playerCard2 = document.getElementById('pc2')
const playerCard3 = document.getElementById('pc3')
const playerCard4 = document.getElementById('pc4')

// Player Cards - functionality
playerCard0.addEventListener('click', function(){
    playersHand.cards[0].selected = !(playersHand.cards[0].selected)
    playerCard0.classList.toggle('selected-card')
    console.log(playersHand.cards[0].selected)
})
playerCard1.addEventListener('click', function(){
    playersHand.cards[1].selected = !(playersHand.cards[1].selected)
    playerCard1.classList.toggle('selected-card')
    console.log(playersHand.cards[1].selected)
})
playerCard2.addEventListener('click', function(){
    playersHand.cards[2].selected = !(playersHand.cards[2].selected)
    playerCard2.classList.toggle('selected-card')
    console.log(playersHand.cards[2].selected)
})
playerCard3.addEventListener('click', function(){
    playersHand.cards[3].selected = !(playersHand.cards[3].selected)
    playerCard3.classList.toggle('selected-card')
    console.log(playersHand.cards[3].selected)
})
playerCard4.addEventListener('click', function(){
    playersHand.cards[4].selected = !(playersHand.cards[4].selected)
    playerCard4.classList.toggle('selected-card')
    console.log(playersHand.cards[4].selected)
})

// Computer Cards
const computerCard0 = document.getElementById('cc0')
const computerCard1 = document.getElementById('cc1')
const computerCard2 = document.getElementById('cc2')
const computerCard3 = document.getElementById('cc3')
const computerCard4 = document.getElementById('cc4')

// Winner text
const winnerText = document.getElementById('winner-text')

// Player's hand value
const playersHandText = document.getElementById('players-hand-value')

// Computer's Hand value
const computersHandText = document.getElementById('computers-hand-value')

// Helpful text
const helpfulText = document.getElementById('helpful-text')

// Computer's offer
const computersOffer = document.getElementById('computers-raise')

// Call Button
const callButton = document.getElementById('call')
callButton.addEventListener('click', function(){
    console.log("call button pressed")
    chips = chips - raise
    pot = pot + (raise * 2)
    chipsCounter.innerText = "Chips: " + chips
    potCounter.innerText = "Pot: " + pot
    finishRound()
})




/* 
TO DO Thursday night:
    reorganize code according to the list above this to do list. look to clean things up and use ... where needed X
    impliment calling or not of computer's wager X
    and use of hidden class X
    IF FIRST TWO AREN'T DONE IN THE MORNING, START HERE ANYWAY:
    bust screen for when chips drops below 100
    Penguins! penguin background and penguin backs for the cards
    sounds
    create options menu and menus for sound and background (with two themes)
    animations for cards entering leaving hand (especially Dealer's hand)
    mobile responsive design
    unlocking system 

    QUESTIONS:
    how to get rid/add border
    animations for cards entering leaving hand (especially Dealer's hand)




HIDDEN CLASS, DISPLAY: NONE

functionality improvements:
raise minimum bet to 100?
*/