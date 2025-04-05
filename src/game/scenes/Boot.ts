import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
        this.load.image('paper-background', 'assets/paper2.jpg');
        this.load.image('severance-background1', 'assets/sev-bg1.jpg');
        this.load.image('lumon-logo', 'assets/lumon-white.png');

        this.load.plugin(
            'rexglowfilterpipelineplugin',
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexglowfilterpipelineplugin.min.js',
            true
        );
    }

    create() {
        this.scene.start('Preloader');
    }
}
