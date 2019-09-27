class Game {
    constructor() {
        this.canvas = document.querySelector("#canvas")
        this.screen = canvas.getContext('2d')
        this.size = {
            x: this.canvas.width,
            y: this.canvas.height
        }
        this.keyboarder = new Keyboarder()
        this.gameOver = true
        this.sprites = []
        this.score = 0
        this.isAttacking = false
        this.started = false
    }
    startGame() {
        this.sprites = []
        this.score = 0
        this.player = new Player(this, this.size)
        this.sprites.push(this.player)
        this.gameOver = false
        this.threshold = .95
        let tick = () => {
            this.update(this.threshold)
            this.draw(this.screen, this.size)
            requestAnimationFrame(tick)
        }
        if(!this.started){
            this.started = true
            tick()
        }
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
        if (this.isAttacking) {
            let dying = []
            for (let sprite of this.sprites) {
                if (colliding(this.weapon, sprite)) {
                    dying.push(sprite)
                    this.sprites.push(new Spatter(this, sprite.center))
                }
            }
            this.score += dying.length
            this.sprites = this.sprites.filter(sprite => !dying.includes(sprite))
            document.querySelector(".points").textContent = this.score
        }
        for (let sprite of this.sprites) {
            if (colliding(this.player, sprite)) {
                this.gameOver = true
                this.threshold = 0
            }
        }
        if (Math.random() > threshold) {
            this.spawnEnemy()
        }
        for (let sprite of this.sprites) {
            sprite.update()
        }
        if (this.gameOver) {
            if (this.keyboarder.isDown(Keyboarder.KEYS.SPACE)) {
                // window.cancelAnimationFrame()
                this.startGame()
            }
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
        if (!this.game.gameOver) {
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
        this.type = "bad"
        this.theta = 0
        this.angularVelocity = this.aim(window.playerPosition)
    }
    aim(player) {
        this.theta = Math.atan2(player.y - this.center.y, player.x - this.center.x)
        let xVel = this.velocity * Math.cos(this.theta)
        let yVel = this.velocity * Math.sin(this.theta)

        return { x: xVel, y: yVel }
    }
    update() {
        this.center = { x: this.center.x + this.angularVelocity.x, y: this.center.y + this.angularVelocity.y }
        this.angularVelocity = this.aim(window.playerPosition)
    }
}
class Powerup {
    constructor(game, position, item) {
        this.game = game
        this.position = position
        this.item = item
    }

}
class HurtBox {
    constructor(game, center) {
        this.game = game
        this.center = center
        this.color = "rgba(0,200,125,.5)"
        this.tickCount = 0
        this.size = { x: 50, y: 50 }
        this.game.weapon = this
    }
    update() {
        this.tickCount++
        let loadbar = []
        console.log("attack tick " + this.tickCount)
        if (this.tickCount === 25) {
            this.size = { x: 0, y: 0 }
        }
        if (this.tickCount % 10 === 0) {
            document.querySelector(".cooldown").textContent += "◊◊"
        }
        if (this.tickCount > 100) {
            this.game.sprites = this.game.sprites.filter(elem => elem !== this)
            this.game.isAttacking = false
            document.querySelector(".cooldown").classList.remove("red")
            document.querySelector(".cooldown").textContent = "READY TO SWING"
        }
    }
}
class Spatter {
    constructor(game, center) {
        this.game = game
        this.center = center
        this.color = "rgba(255,0,0,.2)"
        this.tickCount = 0
        this.size = { x: 20, y: 20 }
    }
    update() {
        this.tickCount++
        if (this.tickCount > 40) {
            this.game.sprites = this.game.sprites.filter(elem => elem !== this)
        }
    }
}
function colliding(b1, b2) {
    return !(
        b1 === b2 ||
        b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
        b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
        b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
        b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2 ||
        b2.type !== "bad"
    )
}
game = new Game()
