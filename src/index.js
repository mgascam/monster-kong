import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

import groundImg from './assets/images/ground.png';
import platformImg from './assets/images/platform.png';
import gorillaImg from './assets/images/gorilla3.png';
import arrowButtonImg from './assets/images/arrowButton.png';
import actionButtonImg from './assets/images/actionButton.png';
import barrelImg from './assets/images/barrel.png';
import playerSpt from './assets/images/player_spritesheet.png';
import fireSpt from './assets/images/fire_spritesheet.png';
import './style.css';


//this game will have only 1 state
const GameState = {

    //initiate game settings
    init: function() {
      //adapt to screen size, fit all the game
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 1000;

      this.cursors = this.game.input.keyboard.createCursorKeys();

      this.RUNNING_SPEED = 180;
      this.JUMPING_SPEED = 540;
    },
  
    //load the game assets before the game starts
    preload: function() {
      this.load.image('ground', groundImg);    
      this.load.image('platform', platformImg);    
      this.load.image('goal', gorillaImg);
      this.load.image('arrowButton', arrowButtonImg);
      this.load.image('actionButton', actionButtonImg);
      this.load.image('barrel', barrelImg);
  
      this.load.spritesheet('player', playerSpt, 28, 30, 5, 1, 1);
      this.load.spritesheet('fire', fireSpt, 20, 21, 2, 1, 1);
    },
    //executed after everything is loaded
    create: function() {    
      this.ground = this.add.sprite(0, 500, 'ground');
      this.game.physics.arcade.enable(this.ground);
      this.ground.body.allowGravity = false;
      this.ground.body.immovable = true;

      this.platform = this.add.sprite(0, 300, 'platform');
      this.game.physics.arcade.enable(this.platform);
      this.platform.body.allowGravity = false;
      this.platform.body.immovable = true;

      //create player
      this.player = this.add.sprite(100, 200, 'player', 3);
      this.player.anchor.setTo(0.5);
      this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
      this.player.play('walking');
      this.game.physics.arcade.enable(this.player);
  
    },
    update: function() {
        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.collide(this.player, this.platform);

        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
           this.player.body.velocity.x = -this.RUNNING_SPEED;
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = this.RUNNING_SPEED;
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -this.JUMPING_SPEED;
        }
    }
    
  };
  
  //initiate the Phaser framework
  const game = new Phaser.Game(360, 592, Phaser.AUTO);
  
  game.state.add('GameState', GameState);
  game.state.start('GameState');
  
  