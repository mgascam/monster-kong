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

      const platformData = [
          {"x": 0, "y": 430},
          {"x": 45, "y": 560},
          {"x": 90, "y": 290},
          {"x": 0, "y": 140},
      ];

      this.platforms = this.add.group();
      this.platforms.enableBody = true;

      platformData.forEach((element) => {
         this.platforms.create(element.x, element.y, 'platform');
      }, this);

      this.platforms.setAll('body.immovable', true);
      this.platforms.setAll('body.allowGravity', false);

      //create player
      this.player = this.add.sprite(100, 200, 'player', 3);
      this.player.anchor.setTo(0.5);
      this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
      this.game.physics.arcade.enable(this.player);
      this.player.customParams = {};

      this.createOnScreenControls();
  
    },
    update: function() {
        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.collide(this.player, this.platforms);

        this.player.body.velocity.x = 0;

        if ((this.cursors.left.isDown || this.player.customParams.isMovingLeft)) {
           this.player.body.velocity.x = -this.RUNNING_SPEED;
        } else if ((this.cursors.right.isDown || this.player.customParams.isMovingRight)) {
            this.player.body.velocity.x = this.RUNNING_SPEED;
        }

        if ((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
            this.player.body.velocity.y = -this.JUMPING_SPEED;
            this.player.customParams.mustJump = false;
        }
    },
    createOnScreenControls: function () {
        this.leftArrow = this.add.button(20, 535, 'arrowButton');
        this.rightArrow = this.add.button(110, 535, 'arrowButton');
        this.actionButton = this.add.button(280, 535, 'actionButton');

        this.leftArrow.alpha = 0.5;
        this.rightArrow.alpha = 0.5;
        this.actionButton.alpha = 0.5;

        // Jump
        this.actionButton.events.onInputDown.add(() => {
            this.player.customParams.mustJump = true;
        }, this);

        this.actionButton.events.onInputUp.add(() => {
            this.player.customParams.mustJump = false;
        }, this);

        this.actionButton.events.onInputOver.add(() => {
            this.player.customParams.mustJump = true;
        }, this);

        this.actionButton.events.onInputOut.add(() => {
            this.player.customParams.mustJump = false;
        }, this);

        // Left
        this.leftArrow.events.onInputDown.add(() => {
            this.player.customParams.isMovingLeft = true;
        }, this);

        this.leftArrow.events.onInputUp.add(() => {
            this.player.customParams.isMovingLeft = false;
        }, this);

        this.leftArrow.events.onInputOver.add(() => {
            this.player.customParams.isMovingLeft = true;
        }, this);

        this.leftArrow.events.onInputOut.add(() => {
            this.player.customParams.isMovingLeft = false;
        }, this);

        // Right
        this.rightArrow.events.onInputDown.add(() => {
            this.player.customParams.isMovingRight = true;
        }, this);

        this.rightArrow.events.onInputUp.add(() => {
            this.player.customParams.isMovingRight = false;
        }, this);

        this.rightArrow.events.onInputOver.add(() => {
            this.player.customParams.isMovingRight = true;
        }, this);

        this.rightArrow.events.onInputOut.add(() => {
            this.player.customParams.isMovingRight = false;
        }, this);
    }
    
  };
  
  //initiate the Phaser framework
  const game = new Phaser.Game(360, 592, Phaser.AUTO);
  
  game.state.add('GameState', GameState);
  game.state.start('GameState');
  
  