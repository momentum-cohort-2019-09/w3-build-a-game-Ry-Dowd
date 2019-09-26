
class Game {
    constructor() {
        const canvas = document.querySelector("#canvas")
        const screen = canvas.getContext('2d')
        let gameSize = {
            x: canvas.width,
            y: canvas.height
        }
        this.sprites = []
        this.score = 0
        this.sprites.push(new Player(this, gameSize))
        let threshold = .99
       let tick = () => {
           console.log("ticktickticktick")
           this.update(threshold)
           this.draw(screen,gameSize)
           requestAnimationFrame(tick)
       } 
       tick()
    }
    addSprite(sprite) {
        this.sprites.push(sprite)
    }
    draw(screen, gameSize){
        screen.clearRect(0,0,gameSize.x,gameSize.y)
        for(let sprite of this.sprites){
            this.render(screen, sprite)
        }
    }
    update(){

    }
    render(screen, sprite){
        screen.fillStyle = sprite.color
        screen.fillRect(sprite.center.x-sprite.size.x/2,sprite.center.y-sprite.size.y/2,sprite.size.x,sprite.size.y)
    }
}

class Player {
    constructor(game, gameSize) {
        this.game = game
        this.center = {x:gameSize.x/2, y:gameSize.y/2}
        this.size = {x:15,y:15}
        this.inventory = []
        this.color = "blue"
        window.playerPosition = this.center
    }
}
class Enemy {
    constructor(game, position, size, velocity) {
        this.game = game
        this.position = position
        this.size = size
        this.velocity = velocity
        this.color = "red"
        this.angularVelocity = this.aim(this.position, window.playerPosition,this.velocity)
    }
    aim(position, playerPosition, velocity){
        let theta = Math.atan2(playerPosition.y-position.y, playerPosition.x-position.x)
        let xVel = velocity*Math.cos(theta)
        let yVel = velocity*Math.sin(theta)

        return {x: xVel, y: yVel}
    }
}
class Powerup {
    constructor(position, type) {
        this.position = position
        this.type = type
    }
}