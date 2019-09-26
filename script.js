const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext('2d')

ctx.fillStyle = 'lightgrey'
ctx.fillRect(0,0,300,300)

class Game{
    constructor(){
        this.sprites = []
    }
    spawn(sprite){
        this.sprites.push(sprite)
    }
}

class Player{
    constructor(position){
        this.position = position
    }
}