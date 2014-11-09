game.persistent = {
	player: {
		name: 'player',
		weapons: [],
		gear: [],
		hp: 10,
		level: 'map1',
		elapsedDuration: 0,
		attackDuration: 30
	},
	other: {
		deathcounter: 0
	},
};

game.HeroEntity = game.BaseEntity.extend({
  
    init: function(x, y, settings) {
    	
    	settings.image = "boy";
    	settings.spritewidth = 44;	//Formerly 24
    	settings.spriteheight = 40;	//formerly 20
		
		this.name = game.persistent.player.name;
		this.hp = game.persistent.player.hp;
		
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
		
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity( 1.5, 1.5);
              
        this.body.gravity = 0;
        this.body.setFriction(0.5, 0.5);

        this.body.collidable = true;

        this.renderable.addAnimation("down", [0,1],200);
        this.renderable.addAnimation("left", [5,6],200);
        this.renderable.addAnimation("right", [10,11],200);
        this.renderable.addAnimation("up", [15,16],200);
		this.renderable.addAnimation("attackdown", [2,3,4],100);
		this.renderable.addAnimation("attackleft", [7,8,9],100);
		this.renderable.addAnimation("attackright", [12,13,14],100);
		this.renderable.addAnimation("attackup", [17,18,19],100);
		
		/* Collisions rectangle has 10 width by 14 height */
		this.body.addShape(new me.Rect(14,16,14,14));
		this.body.setShape(1);
		
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);     
        
		this.direction = "down";
		this.renderable.setCurrentAnimation( this.direction );
        
        me.input.registerPointerEvent('pointerdown', me.game.viewport, this.onMouseDown.bind(this));
		
		//Load weapons to inventory
		this.weapons = game.persistent.player.weapons;
		//Load and equip current weapon if any exists
		if(this.weapons.length > 0) {
			this.currentWep = null;
			this.equipWep(this.weapons[this.currentWep]);
		}
		else {
			this.currentWep = null;
		}
    },
   
    update: function(dt) {
		var dx = 0;
		var dy = 0;
		
		//if(!this.attacking) {
			if (me.input.isKeyPressed('left'))
				dx = ( this.body.accel.x * me.timer.tick ) * -1;
				
			if (me.input.isKeyPressed('noclip'))
				this.body.collidable = false;
				
			if (me.input.isKeyPressed('right'))
				dx = this.body.accel.x * me.timer.tick;
				
			if (me.input.isKeyPressed('up'))
				dy = ( this.body.accel.y * me.timer.tick ) * -1;
				
			if (me.input.isKeyPressed('down'))
				dy = this.body.accel.y * me.timer.tick;
		//}
			if (me.input.isKeyPressed('attack')) {
				if(this.currentWep != null && !this.attacking) {
					myWep = new me.pool.pull("weapon",this.pos.x,this.pos.y,this);
					me.game.world.addChild(myWep,3);
					//myWep = new WeaponEntity(this.pos.x,this.pos.y,this.currentWep,this);
					//me.game.add(myWep,1000);
				}
			}
		
		this._setDirection(dx,dy);
		
		this.body.vel.x += dx;
		this.body.vel.y += dy;
		
		var myLayer = me.game.currentLevel.getLayerByName("collision");  
		var bottomTile = myLayer.layerData[Math.ceil(this.pos.x / myLayer.tilewidth)][Math.ceil(this.pos.y / myLayer.tileheight)];
		var topTile = myLayer.layerData[Math.ceil(this.pos.x / myLayer.tilewidth)][Math.ceil((this.pos.y+14) / myLayer.tileheight)];
		if(bottomTile != null) {
			var myTileProperty = myLayer.tileset.getTileProperties(bottomTile.tileId); 
			// Uses the property declared in the Tiled - Property Name = material  |  Property Value = fire
			if (myTileProperty.tallgrass) {
				this.inTallGrass = true;
			}
		}
		else if(topTile != null) {
			var myTileProperty = myLayer.tileset.getTileProperties(topTile.tileId); 
			if (myTileProperty.tallgrass) {
				this.inTallGrass = true;
			}
		}
		else {
			this.inTallGrass = false;
		}
		
        // check & update player movement
        this.body.update(dt);
        

		me.collision.check(this, true, this.collisionHandler.bind(this), true);

        // update animation if necessary
        if (this.body.vel.x!=0 || this.body.vel.y!=0 || this.attacking) {
            // update object animation
            this._super(me.Entity, 'update', [dt]);
            return true;
        }
		
		
		
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    },
	
	/**
	 * collision handler
	 */
	collisionHandler : function (response) {
		//this.doTalk( res.obj );
		if (response.b.body.collisionType === me.collision.types.ENEMY_OBJECT) {
			this.pos.x -= response.b.x;
    		this.pos.y -= response.b.y;
			console.log("Collided with enemy.");
		}
		else if (response.b.body.collisionType === me.collision.types.COLLECTABLE_OBJECT) {
			console.log("Collided with collectable.");
		}
	},
    
	draw: function(renderer) {
		/* Call overriden function */
		this._super(me.Entity, 'draw', [renderer]);
		
		/* Calculate exact screen position */
		var _bounds = this.getBounds();
		var x = ~~(_bounds.pos.x + (this.anchorPoint.x * (_bounds.width - this.renderable.width)));
		var y = ~~(_bounds.pos.y + (this.anchorPoint.y * (_bounds.height - this.renderable.height)));
		
		/* Actual draw */
		if(this.inTallGrass) {
			mySprite = new me.Sprite (x, y, me.loader.getImage("boy_grass"), 44,40);
			mySprite.draw(renderer);
		}
		
	},
	
	equipWep: function(weapon) {
		this.currentWep = weapon;
	},
	
    /**
     * Start conversation
     * @param {Object} entity
     */
    doTalk:function( entity ){
    	entity.isTalking = true;
    	this.talkWith = entity;    	
    	entity.dialog.show();
    },
          
    /**
	 * Mouse down handler
	 * @param {Event} e - MelonJS Event Object 
	 */  
    onMouseDown: function(e){
    	this._target = {};        	   	  	    	   	  
    	this._target.x = e.gameWorldX - Math.floor( this.width / 2 );    	
    	this._target.y = e.gameWorldY - Math.floor( this.height / 2 );        	  
    	this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);    
    	this.renderable.setCurrentAnimation( this.direction );
    	
    	// Hero just talking
    	if( this.talkWith ){
    		this.talkWith.dialog.reset();  
    		delete this.talkWith;  		
    	}        	    	  		    	
    }, 
    
    onDestroyEvent : function() {		
		me.input.releasePointerEvent('pointerdown', me.game.viewport);	
    },      
});