
class Game {
    constructor() {
        const canvas1 = document.querySelector("#canvas1")
        const screen = canvas.getContext('2d')
        let gameSize = {
            x: canvas.width,
            y: canvas.height
        }
        this.sprites = []
        this.score = 0
        this.sprites.push(new Player(this, gameSize))

        
    }
    addSprite(sprite) {
        this.sprites.push(sprite)
    }
    draw(screen, gameSize){
        screen.clearRect(0,0,gameSize.x,gameSize.y)
        for(let sprite of sprites){
            render(screen, sprite)
        }
    }
}

class Player {
    constructor(game, gameSize) {
        this.game = game
        this.center = {x:gameSize.x/2, y:gameSize.y/2}
        this.size = {x:15,y:15}
        this.inventory = []
    }
}
class Enemy {
    constructor(game, position, size, velocity) {
        this.game = game
        this.position = position
        this.size = size
        this.velocity = velocity
    }
    get
}
class Powerup {
    constructor(position, type) {
        this.position = position
        this.type = type
    }
}