import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { NumberTileScene } from './scenes/NumberTileScene';
import { Severance1 } from './scenes/Severance1';

import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

// @ts-ignore
import ScanlinePostFX from './effects/scanlinePostFX.js';
// @ts-ignore
import PixellateFX from './effects/pixellate.js';
// @ts-ignore
import LasersPostFX from './effects/lasersPostFX.js';
// @ts-ignore
import CRTFX from './effects/CRT.js';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,

    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        NumberTileScene,
        Severance1,
    ],
    physics: {
        default: 'arcade',
        arcade: { debug: true },
    },
    pipeline: [LasersPostFX, ScanlinePostFX, PixellateFX, CRTFX],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
