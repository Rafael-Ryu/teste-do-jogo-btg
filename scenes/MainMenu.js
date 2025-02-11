class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        this.load.image('playButton', 'assets/play-button.png');
        this.load.image('optionsButton', 'assets/options-button.png');
    }

    create() {
        // Background
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        // Botão de Play
        const playButton = this.add.image(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            'playButton'
        ).setInteractive().setScale(0.5);

        // Botão de opções
        const optionsButton = this.add.image(
            100,
            this.sys.game.config.height - 90,
            'optionsButton'
        ).setInteractive().setScale(0.3);

        // Botões de interação
        playButton.on('pointerover', () => {
            playButton.setScale(.6);
        });

        playButton.on('pointerout', () => {
            playButton.setScale(.5);
        });

        playButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        optionsButton.on('pointerover', () => {
            optionsButton.setScale(.35);
        });

        optionsButton.on('pointerout', () => {
            optionsButton.setScale(.3);
        });

        optionsButton.on('pointerdown', () => {
            this.scene.start('Options');
        });
    }
}