class Game {
    constructor() {
        const canvas = document.querySelector("#canvas")
        const screen = canvas.getContext('2d')
        this.size = {
            x: canvas.width,
            y: canvas.height
        }
        this.sprites = []
        this.score = 0
        this.sprites.push(new Player(this, this.size))
        let threshold = .95
        let tick = () => {
            console.log("ticktickticktick")
            this.update(threshold)
            this.draw(screen, this.size)
            requestAnimationFrame(tick)
        }
        tick()
    }
    addSprite(sprite) {
        this.sprites.push(sprite)
    }
    draw(screen, size) {
        screen.clearRect(0, 0, size.x, size.y)
        for (let sprite of this.sprites) {
            this.render(screen, sprite)
        }
    }
    update(threshold) {
        if (Math.random() > threshold) {
            this.spawnEnemy()
        }
        for (let sprite of this.sprites) {
            sprite.update()
        }
    }
    render(screen, sprite) {
        screen.fillStyle = sprite.color
        screen.fillRect(sprite.center.x - sprite.size.x / 2, sprite.center.y - sprite.size.y / 2, sprite.size.x, sprite.size.y)
    }
    spawnEnemy() {
        let rand = Math.random()
        let spawnPoint = { x: 0, y: 0 }
        let offset = Math.floor(Math.random() * this.size.x)
        if (rand < .25) {
            spawnPoint.x += offset
        } else if (rand < .5) {
            spawnPoint.y += offset
        } else if (rand < .75) {
            spawnPoint.y = this.size.y
            spawnPoint.x += offset
        } else {
            spawnPoint.x = this.size.x
            spawnPoint.y += offset
        }
        this.addSprite(new Enemy(this, spawnPoint, .6 + Math.random() / 2))
    }
}

class Player {
    constructor(game, size) {
        this.game = game
        this.center = { x: size.x / 2, y: size.y / 2 }
        this.size = { x: 15, y: 15 }
        this.inventory = []
        this.color = "blue"
        this.keyboarder = new Keyboarder()
        window.playerPosition = this.center
    }
    update() {
        if (this.keyboarder.isDown(Keyboarder.KEYS.LEFT) || this.keyboarder.isDown(Keyboarder.KEYS.A)) {
            this.center.x -= 2
        }
        if (this.keyboarder.isDown(Keyboarder.KEYS.UP) || this.keyboarder.isDown(Keyboarder.KEYS.W)) {
            this.center.y -= 2
        }
        if (this.keyboarder.isDown(Keyboarder.KEYS.DOWN) || this.keyboarder.isDown(Keyboarder.KEYS.S)) {
            this.center.y += 2
        }
        if (this.keyboarder.isDown(Keyboarder.KEYS.RIGHT) || this.keyboarder.isDown(Keyboarder.KEYS.D)) {
            this.center.x += 2
        }
        if (this.keyboarder.isDown(Keyboarder.KEYS.SPACE)) {
            this.useItem()
        }
        if (this.center.x >= this.game.size.x) {
            this.center.x = this.game.size.x
        }
        if (this.center.y >= this.game.size.y) {
            this.center.y = this.game.size.y
        }
        if (this.center.x <= 0){
            this.center.x = 0
        }
        if(this.center.y <= 0){
            this.center.y = 0
        }
    }
    useItem(){

    }
}
class Enemy {
    constructor(game, position, velocity) {
        this.game = game
        this.center = position
        this.size = { x: 10, y: 10 }
        this.velocity = velocity
        this.color = "green"
        this.angularVelocity = this.aim(window.playerPosition)
    }
    aim(player) {
        let theta = Math.atan2(player.y - this.center.y, player.x - this.center.x)
        let xVel = this.velocity * Math.cos(theta)
        let yVel = this.velocity * Math.sin(theta)

        return { x: xVel, y: yVel }
    }
    update() {
        this.center = { x: this.center.x + this.angularVelocity.x, y: this.center.y + this.angularVelocity.y }
        this.angularVelocity = this.aim(window.playerPosition)
    }
}
class Powerup {
    constructor(game, position, type) {
        this.game = game
        this.position = position
        this.type = type
    }

}