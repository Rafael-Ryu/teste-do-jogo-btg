class CharacterName extends Phaser.Scene {
    constructor() {
        super('CharacterName');
        this.playerName = '';
        
        // Aqui muda o Background
        this.defaultBg = 'bg1';
        this.bgPath = 'assets/bg.png';
    }

    preload() {
        this.load.image(this.defaultBg, this.bgPath);
    }

    create() {
        this.background = this.add.image(0, 0, this.defaultBg).setOrigin(0, 0);
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;

        // Overlay escuro semi-transparente
        this.add.rectangle(0, 0, 
            this.sys.game.config.width,
            this.sys.game.config.height,
            0x000000, 0.7).setOrigin(0, 0);

        // Título
        this.add.text(this.sys.game.config.width / 2, 100, 'DIGITE SEU NOME:', {
            fontSize: '32px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Caixa de texto
        const inputBox = this.add.rectangle(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            400,
            60,
            0x333333
        );

        this.nameText = this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            '',
            {
                fontSize: '28px',
                fill: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Botão continuar
        this.continueButton = this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2 + 100,
            'Continuar',
            {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#333',
                padding: { x: 15, y: 10 }
            }
        ).setOrigin(0.5)
        .setInteractive()
        .setVisible(false);

        // Efeitos do botão continuar
        this.continueButton.on('pointerover', () => {
            this.continueButton.setScale(1.1);
            this.continueButton.setBackgroundColor('#444');
        });

        this.continueButton.on('pointerout', () => {
            this.continueButton.setScale(1.0);
            this.continueButton.setBackgroundColor('#333');
        });

        this.continueButton.on('pointerdown', () => {
            CookieManager.setCookie('playerName', this.playerName);
            this.scene.start('Game');
        });

        // Input do teclado
        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'Enter' && this.playerName.length > 0) {
                CookieManager.setCookie('playerName', this.playerName);
                this.scene.start('Game');
            } else if (event.key === 'Backspace') {
                this.playerName = this.playerName.slice(0, -1);
            } else if (event.key.length === 1 && this.playerName.length < 15) {
                this.playerName += event.key;
            }

            this.nameText.setText(this.playerName);
            this.continueButton.setVisible(this.playerName.length > 0);
        });
    }
}