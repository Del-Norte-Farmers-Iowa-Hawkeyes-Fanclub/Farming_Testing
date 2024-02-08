class Story extends Phaser.Scene {
    constructor() {
        super('Story');
        this.selectedTile; 
        this.tilemapData = []; 
        this.mapSize = 12; // map is a square (equal width and height)
        this.tileSize = 60; 
        this.week = 1
        this.money = 100
        this.eco = 0
    }

    preload() {
        // Load your tile images
		this.load.image('background-color', 'img/tiles/background.png');
		this.load.image('erase', 'img/tiles/blank-tile.png');
        this.load.image('corn', 'img/tiles/corn/Corn stage 2.png');
        this.load.image('corn2', 'img/tiles/corn/corn-stage-3.png');
        this.load.image('corn-button', 'img/buttons/corn-button.png')
        this.load.image('erase-button', 'img/buttons/erase-button.png')
        this.load.image('week-button', 'img/buttons/week-button.png')
        
        // tile options (tile, button)
        this.erase = ['erase', 'erase-button']
        this.corn = ['corn', 'corn-button']
    }

    create() {
        this.add.sprite(0, 0, 'background-color').setOrigin(0, 0);

        // Create a grid of tiles
        for (let i = 0; i < this.mapSize; i++) {
            this.tilemapData[i] = [];
            for (let j = 0; j < this.mapSize; j++) {
                this.tilemapData[i][j] = null;
            }
        }

        // Display tiles on the sidebar for selection
        this.displaySidebarTiles();

        // display grid
        this.drawGrid();

        // Display the week button
        this.displayWeekButton();

         // Update the displayed data text
        this.updateText();

        // Handle input events
        this.input.on('pointerdown', this.handlePointerDown, this);

        this.cameras.main.fadeIn(250, 0, 0, 0);
    }

    update() {
        // Update logic, if needed
    }

    displaySidebarTiles() {
        const sidebar = this.add.group();

        const tiles = [this.erase, this.corn]; // Add more tile keys as needed

        tiles.forEach((tileKey, index) => {
            const tile = this.add.image(this.tileSize*this.mapSize + 200, index * this.tileSize + this.tileSize + 120, tileKey[1]).setInteractive();
            tile.setScale(2);
            tile.on('pointerdown', () => {
                this.selectedTile = tileKey[0]; // Changed to use 'this.selectedTile'

				tiles.forEach((otherTile) => {
                    if (otherTile !== tileKey[0]) {
                        sidebar.getByName(otherTile).clearTint();
                    }
                });
                tile.setTint(0xb3f7ff); // Change color to highlight (e.g., green)
            }, this);
            //sidebar.add(tile, false, tileKey); // Add tile with a name
        });
        
    }

    displayWeekButton() {
        //const weekButton = this.add.text(700, 500, 'Next Week', { fontSize: '24px', fill: '#fff' }).setInteractive();
        const weekButton = this.add.image(this.tileSize*this.mapSize + 200, this.tileSize * 6 + 100, 'week-button').setInteractive();

        weekButton.on('pointerdown', () => {
            this.week++; // Increment week
            this.updateText()
            console.log("week++")
        }, this);

        // Display current week
        this.weekText = this.add.text(900, 50, `Week: ${this.week}`, { fontSize: '24px', fill: '#fff' });
    }

    handlePointerDown(pointer) {
        if (this.selectedTile) { // Changed to use 'this.selectedTile'
            const row = Math.floor(pointer.y / 60);
            const col = Math.floor(pointer.x / 60);

            if (row >= 0 && row < this.mapSize && col >= 0 && col < this.mapSize) {
                // Place the selected tile on the grid
                if (this.tilemapData[row][col]) {
                    this.tilemapData[row][col].destroy();
                }

                const tile = this.add.image(col * 60 + 30, row * 60 + 30, this.selectedTile); // Changed to use 'this.add.image'
                tile.setScale(4);
                this.tilemapData[row][col] = tile;
            }
        }
    }

    drawGrid(){
        // colors
        const white = 0xffffff; 
        const lightBrown = 0xeaa81e

            // Loop through the grid and create squares
        for (var i = 0; i < this.mapSize; i++) {
            for (var j = 0; j < this.mapSize; j++) {
                // Calculate position for each square
                var posX = i * this.tileSize + 100;
                var posY = j * this.tileSize;

                // Create the square shape
                var graphics = this.add.graphics({
                    x: posX,
                    y: posY
                });
                graphics.fillStyle(lightBrown); // Fill color of the square
                graphics.fillRect(0, 0, this.tileSize, this.tileSize); // Draw the square
                graphics.lineStyle(1, white); // Line style for the grid lines
                graphics.strokeRect(0, 0, this.tileSize, this.tileSize); // Draw the grid lines
            }
        }
    }
    updateText() {
        this.weekText.setText(`Week: ${this.week}`);

        this.moneyText = this.add.text(900, 80, `Money: ${this.money}`, { fontSize: '24px', fill: '#fff' });
        this.moneyText.setText(`Money: ${this.money}`);

        this.ecoText = this.add.text(900, 110, `Eco Points: ${this.eco}`, { fontSize: '24px', fill: '#fff' });
        this.ecoText.setText(`Eco Points: ${this.eco}`);
    }
};
