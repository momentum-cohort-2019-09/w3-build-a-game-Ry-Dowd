class Game {
    constructor() {
        this.canvas = document.querySelector("#canvas")
        this.screen = canvas.getContext('2d')
        this.size = {
            x: this.canvas.width,
            y: this.canvas.height
        }
        this.sprites = []
        this.score = 0
        this.threshold = 0
        this.isAttacking = false
    }
    startGame() {
        let player = new Player(this, this.size)
        this.sprites.push(player)
        this.threshold = 0
        let tick = () => {
            this.update(this.threshold)
            this.draw(this.screen, this.size)
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
        let notDead
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
        let attribute = Math.random()
        this.addSprite(new Enemy(this, spawnPoint, 15 - attribute * 6, .6 + attribute / 2))
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
        if (this.center.x <= 0) {
            this.center.x = 0
        }
        if (this.center.y <= 0) {
            this.center.y = 0
        }
    }
    useItem() {
        if (!this.game.isAttacking) {
            document.querySelector(".cooldown").classList.add("red")
            document.querySelector(".cooldown").textContent = "◊◊"
            this.game.isAttacking = true
            this.game.addSprite(new HurtBox(this.game, this.center))
        }
    }
}
class Enemy {
    constructor(game, position, size, velocity) {
        this.game = game
        this.center = position
        this.size = { x: size, y: size }
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
class HurtBox {
    constructor(game, center) {
        this.game = game
        this.center = center
        this.color = "rgba(0,200,125,.5)"
        // this.type = type
        this.tickCount = 0
        this.size = { x: 50, y: 50 }
    }
    update() {
        this.tickCount++
        let loadbar = []
        console.log("attack tick " + this.tickCount)
        if (this.tickCount === 25) {
            this.size = { x: 0, y: 0 }
        }
        if(this.tickCount%10 === 0){
            document.querySelector(".cooldown").textContent += "◊◊"
            
            // loadbar = loadbar.push("//")
            // document.querySelector(".cooldown").textContent = loadbar.join("")
        }
        if (this.tickCount > 100) {
            this.game.sprites = this.game.sprites.filter(elem => elem!==this)
            this.game.isAttacking = false
            document.querySelector(".cooldown").classList.remove("red")
            document.querySelector(".cooldown").textContent = "READY TO SWING"
        }
    }
}
function colliding(b1, b2) {
    return !(
        b1 === b2 ||
        b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
        b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
        b1.center.x - b1.size.x / 2 < b2.center.x + b2.size.x / 2 ||
        b1.center.y - b1.size.y / 2 < b2.center.y + b2.size.y / 2
    )
}