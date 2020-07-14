// POKER

// DECK

deck = []
getDeck = () => {
    //construct 52 cards
    for (i = 2; i <= 14; i++) {
        deck.push({suit: "S", rank: i, name: "S" + i, sorted: false})
        deck.push({suit: "H", rank: i, name: "H" + i, sorted: false})
        deck.push({suit: "D", rank: i, name: "D" + i, sorted: false})
        deck.push({suit: "C", rank: i, name: "C" + i, sorted: false})
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
getDeck()
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
        this.inUseCards = []
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
        console.log("pizza")
        // Flush 
        this.suitMatchesCounter = 0
        for (i = 1; i < cards.length; i++) {
            if (cards[i].suit === this.cards[0].suit) {
                this.suitMatchesCounter = this.suitMatchesCounter + 1
            } 
        }
        if (this.suitMatchesCounter === 4) {
            this.isFlush = true
        } else if (this.suitMatchesCounter === 3) {
            this.isAlmostFlush = true
        } // Here: test for case where first card is the odd one out re: suit
        // Sort Cards
        this.sortedRanks = []
        for (i = 0; i < cards.length; i++) {
            this.sortedRanks.push(cards[i].rank)
        }
        this.sortedRanks.sort((a,b)=>b-a)
        this.unsortedCards = this.cards
        this.sortedCards = []
        for (i = 0; i < this.sortedRanks.length; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.sortedRanks[i] === this.unsortedCards[j].rank && this.unsortedCards[j].sorted === false) {
                    this.sortedCards.push(this.unsortedCards[j])
                    this.unsortedCards[j].sorted = true
                    break
                }
            }
        }
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
        //only tests for the case where you have four in a row, not when you are issing a card in the center ("gutshot")
        if (this.straightCounter === 3 && this.isAlmostFlush === false) { 
            this.isAlmostStraight = true
        }
        // Matches Check
        this.allMatches = []
        this.matchesArray = []
        this.inMatch = false
        for (i = 1; i < 5; i++) {
            if (this.sortedCards[i].rank === this.sortedCards[i - 1].rank && this.inMatch === false) {
                this.matchesArray.push(this.sortedCards[i], this.sortedCards[i - 1])
                this.inMatch = true
                console.log (i + " gives first condition")
            } else if (this.sortedCards[i].rank === this.sortedCards[i - 1].rank && this.inMatch === true) {
                this.matchesArray.push(this.sortedCards[i])
                console.log (i + " gives second condition")
            } else if (this.sortedCards[i].rank !== this.sortedCards[i - 1].rank && this.inMatch === true) {
                this.allMatches.push(this.matchesArray)
                this.matchesArray = []
                this.inMatch = false
                console.log (i + " gives third condition")
            }
            console.log(i + "yuh")
        }
        if (this.matchesArray.length > 0) {
            this.allMatches.push(this.matchesArray)
        }
        
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
            if ((this.allMatches[0].length === 3 && this.allMatches[1].length === 2) || (this.allMatches[0].length === 2 && this.allMatches[1].length === 3)) {
                this.isFullHouse = true
            }
            // Two Pair
            else if (this.allMatches[0].length === 2 && this.allMatches[1].length === 2) {
                this.isTwoPair = true
            }
        }
        // Staight Flush
        // if (this.isFlush === true && this.isStraight === true) {
        //     this.isStraightFlush = true
        // }
        
        //Value of Hand
        this.handValue = 0
        // 8 Straight Flush. 
        if (this.isFlush && this.isStraight) {
            this.handValue = 8 
        }
        // 7 Four of a kind. 
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
        // 3 Three of a kind 
        else if (this.isThreeOfAKind) {
            this.handValue = 3
        }
        // 2 Two pair 
        else if (this.isTwoPair) {
            this.handValue = 2
        }
        // 1 One Pair
        else if (this.isPair) {
            this.handValue = 1
        }
        
    }
    // fillCards(){
        
    // }
}

//console.log(deck.length)
//let playersHand = new Hand ([{suit: "S", rank: 8, name: "H10", sorted: false}, {suit: "S", rank: 9, name: "H10", sorted: false}, {suit: "S", rank: 11, name: "H10", sorted: false}, {suit: "S", rank: 10, name: "H10", sorted: false}, {suit: "S", rank: 7, name: "H10", sorted: false}])
let playersHand = new Hand ([])
let computersHand = new Hand ([])
//console.log(deck.length)
//playersHand.fillCards()
//console.log(playersHand)

const getWinner = () => {
    if (playersHand.handValue > computersHand.handValue) {
        console.log("You Win!!")
    } else if (playersHand.handValue < computersHand.handValue) {
        console.log("You Luz!!")
    } else {
        if (playersHand.allMatches.length > 0) {
            console.log("big YEE")
        } else {
            if (playersHand.sortedCards[0].rank > computersHand.sortedCards[0].rank) {
                console.log("You win!!")
            } else if (playersHand.sortedCards[0].rank < computersHand.sortedCards[0].rank) {
                console.log("You Luz!!")
            } else {
                console.log("medium YEE")
            }
        }
    }
}




// console.log(playersHand.cards)
// console.log(playersHand.unsortedCards)
// console.log(playersHand.sortedRanks)
// console.log(playersHand.sortedCards)
// console.log(playersHand.straightCounter)
// console.log(playersHand.isStraight)
// console.log(playersHand.isAlmostStraight)
console.log(playersHand)
console.log(computersHand)
console.log(playersHand.handValue)
console.log(computersHand.handValue)


getWinner()
