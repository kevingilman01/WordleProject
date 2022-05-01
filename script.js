let arr = []
let numGuesses = 0
let guess = ""
let answer = ""
let bank = []

const fetchWord = async() => {
    let json = await fetch("https://random-word-api.herokuapp.com/word?length=5")
    json = await json.json()
    answer = json[0]
    console.log(json)
}

const fetchBank = async() => {
    let json = await fetch("https://random-word-api.herokuapp.com/all")
    json = await json.json()
    bank = json
    console.log(json)
}

fetchWord()
fetchBank()

const grid = document.getElementById("grid")
const endScreen = document.getElementById("endScreen")
const endText = document.getElementById("endText")
const button = document.getElementById("button")

const setup = () => {
    for(let i = 0; i < 6; i++) {
        const subArr = []
        for(let j = 0; j < 5; j++) {
            const box = document.createElement("div")
            subArr.push(box)
            box.classList.add("box")
            grid.appendChild(box)
        }
        arr.push(subArr)
    }
}

setup()

const keyPress = (e) => {
    if(e.key == "Backspace" && guess.length > 0) {
        guess = guess.slice(0, -1)
        arr[numGuesses][guess.length].textContent = ""
    }
    else if(e.key >= "a" && e.key <= "z" && guess.length < 5) {
        guess += e.key
        console.log(e.key)
    }
    console.log(guess)
    if(e.key == "Enter" && guess.length == 5 && bank.includes(guess)) {
        let temp = answer
        for(let i = 0; i < guess.length; i++) {
            if(guess.charAt(i) == answer.charAt(i)) { //fill green
                arr[numGuesses][i].classList.add("green")
                let str = temp.split('')

                str.splice(temp.indexOf(guess.charAt(i)), 1)
                temp = str.join('')
            }
        }
        for(let i = 0; i < guess.length; i++) {
            if(temp.includes(guess.charAt(i))) { //fill yellow
                arr[numGuesses][i].classList.add("yellow")
                let str = temp.split('')

                str.splice(temp.indexOf(guess.charAt(i)), 1)
                temp = str.join('')
            }
        }
        numGuesses++
        guess = ""
        console.log(temp)
        if(temp == "") {
            endScreen.classList.add("show")
            endText.textContent = `Congratulations,\nYou guessed the word in ${numGuesses} guess${numGuesses == 1 ? "" : "es"}`
            document.removeEventListener("keydown",keyPress)
        }
        else if(numGuesses == 6) {
            endScreen.classList.add("show")
            endText.textContent = `You Lose`
            document.removeEventListener("keydown",keyPress)
        }
    }
    else if(guess.length == 5 && e.key == "Enter") {
        grid.classList.add("shake")
        setTimeout(() => {
            grid.classList.remove("shake")
        }, 300)
    }
    for(let i = 0; i < guess.length; i++) {
        arr[numGuesses][i].textContent = guess.charAt(i).toUpperCase()
    }
}

document.addEventListener("keydown", keyPress)

const resetGame = () => {
    endScreen.classList.remove("show")
    numGuesses = 0
    arr = []
    grid.innerHTML = ""
    document.addEventListener("keydown", keyPress)
    fetchWord()
    setup()
}

button.addEventListener("click", resetGame)