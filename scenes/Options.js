class Options extends Phaser.Scene {
    constructor() {
        super('Options');
        this.selectedKey = null;
        this.volume = parseFloat(CookieManager.getCookie('volume')) || 1;
        this.controls = {
            left: CookieManager.getCookie('control_left') || 'A',
            right: CookieManager.getCookie('control_right') || 'D',
            jump: CookieManager.getCookie('control_jump') || 'SPACE'
        };
    }

    create() {
        // Background
        const bg = this.add.rectangle(0, 0, 
            this.sys.game.config.width,
            this.sys.game.config.height,
            0x000000, 0.8).setOrigin(0, 0);

        // Título
        this.add.text(this.sys.game.config.width / 2, 50, 'CONFIGURAÇÕES', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Controle de volume
        this.add.text(200, 100, 'VOLUME:', { fontSize: '24px', fill: '#fff' });
        
        // Slider background
        const sliderBg = this.add.rectangle(400, 115, 200, 10, 0x666666);
        
        // Slider handle
        const sliderHandle = this.add.circle(400 + (this.volume * 200) - 100, 115, 15, 0xff0000)
            .setInteractive({ draggable: true });

        // Interação com o slider
        sliderHandle.on('drag', (pointer, dragX) => {
            const newX = Phaser.Math.Clamp(dragX, sliderBg.x - 100, sliderBg.x + 100);
            sliderHandle.x = newX;
            this.volume = (newX - (sliderBg.x - 100)) / 200;
            CookieManager.setCookie('volume', this.volume);
            // Emit volume change event
            this.game.events.emit('volumeChanged', this.volume);
        });

        // Configuração de controles
        const keyConfig = [
            { key: 'left', default: this.controls.left, y: 200 },
            { key: 'right', default: this.controls.right, y: 250 },
            { key: 'jump', default: this.controls.jump, y: 300 }
        ];

        keyConfig.forEach(config => {
            const text = this.add.text(200, config.y, 
                `${config.key.toUpperCase()}: `, 
                { fontSize: '24px', fill: '#fff' });

            const keyButton = this.add.text(400, config.y, 
                config.default, 
                { 
                    fontSize: '24px',
                    fill: '#ff0',
                    backgroundColor: '#333',
                    padding: { x: 10, y: 5 },
                    fixedWidth: 100,
                    align: 'center'
                })
                .setInteractive();

            // Efeito de hover
            keyButton.on('pointerover', () => {
                keyButton.setBackgroundColor('#444');
            });

            keyButton.on('pointerout', () => {
                keyButton.setBackgroundColor(this.selectedKey === keyButton ? '#666' : '#333');
            });

            keyButton.on('pointerdown', () => {
                this.selectKey(keyButton, config.key);
            });
        });

        // Botão de voltar
        const backButton = this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height - 100,
            'Voltar ao Menu',
            { 
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#333',
                padding: { x: 15, y: 10 },
            }
        ).setOrigin(0.5).setInteractive();

        backButton.on('pointerover', () => {
            backButton.setScale(1.1);
            backButton.setBackgroundColor('#444');
        });

        backButton.on('pointerout', () => {
            backButton.setScale(1.0);
            backButton.setBackgroundColor('#333');
        });

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        // Evento de tecla pressionada
        this.input.keyboard.on('keydown', (event) => {
            if (this.selectedKey) {
                let keyText = event.key.toUpperCase();
                if (event.key === ' ') keyText = 'SPACE';
                
                this.selectedKey.setText(keyText);
                this.selectedKey.setBackgroundColor('#333');
                
                // Guarda a tecla selecionada
                const keyName = this.selectedKey.name;
                this.controls[keyName] = keyText;
                CookieManager.setCookie(`control_${keyName}`, keyText);
                
                this.selectedKey = null;
            }
        });
    }

    selectKey(keyButton, keyName) {
        if (this.selectedKey) {
            this.selectedKey.setBackgroundColor('#333');
        }
        this.selectedKey = keyButton;
        this.selectedKey.name = keyName;
        keyButton.setBackgroundColor('#666');
    }
}