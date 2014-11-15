game.weapons = {
	sword: {
		name: 'Sword',
		image: "boy_sword",
		animation: [2, 3, 4, 5],
		rate: 225,
		damage: 1,
		speed: null,
		projectile: null,
		pWidth: null,
		pHeight: null,
		wWidth: null,
		wHeight: null,
		offsetX: 18,
		offsetY: -16,
		addOffset: null,
		attackRect: [[18, 27, 6, 13],[4, 22, 16, 5],[24, 22, 16, 5],[15, 5, 3, 15]] //down, left, right, up
	}
};

game.WeaponEntity = game.BaseEntity.extend({
  
    init: function(x, y, owner) {
		this.owner = owner;
		this.weapon = game.weapons[owner.currentWep];
	
		
    	/*settings.image = this.weapon.image;
    	settings.spritewidth = 44;
		settings.spriteheight = 40;
		settings.width = 44;
		settings.height = 44;*/
    	this.needsDrawn = false;
		
        // call the constructor
        this._super(me.Entity, 'init', [x, y, {image: this.weapon.image, width: 44, height: 40, spritewidth: 44, spriteheight: 40}]);

        this.body.gravity = 0;
		
        this.renderable.addAnimation("down", [0,1,2],75);
        this.renderable.addAnimation("left", [3,4,5],75);
        this.renderable.addAnimation("right", [6,7,8],75);
        this.renderable.addAnimation("up", [9,10,11],75);
		
		this.body.collidable = true;
		this.body.addShape(new me.Rect(16,18,14,14));
		
		this.body.addShape(new me.Rect(this.weapon.attackRect[0][0],this.weapon.attackRect[0][1],this.weapon.attackRect[0][2],this.weapon.attackRect[0][3]));	//Down
		this.body.addShape(new me.Rect(this.weapon.attackRect[1][0],this.weapon.attackRect[1][1],this.weapon.attackRect[1][2],this.weapon.attackRect[1][3]));	//Left
		this.body.addShape(new me.Rect(this.weapon.attackRect[2][0],this.weapon.attackRect[2][1],this.weapon.attackRect[2][2],this.weapon.attackRect[2][3]));	//Right
		this.body.addShape(new me.Rect(this.weapon.attackRect[3][0],this.weapon.attackRect[3][1],this.weapon.attackRect[3][2],this.weapon.attackRect[3][3]));	//Up
		this.body.setShape(0);
		this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        
		this.direction = owner.direction;
		this.renderable.setCurrentAnimation( this.direction );
    },
	
	attack : function() {
		if (me.input.isKeyPressed('attack')) {
			this.needsDrawn = true;
			this.owner.attacking = true;
			
			this.owner.renderable.setCurrentAnimation("attack"+this.owner.direction);
			this.renderable.setCurrentAnimation(this.owner.direction);
			this.owner.renderable.setAnimationFrame();
			this.renderable.setAnimationFrame();
			
			this.pos.x = this.owner.pos.x;// + this.weapon.offsetX;
			this.pos.y = this.owner.pos.y;// + this.weapon.offsetY;
			
			var colLayer = me.game.currentLevel.getLayerByName("collision");
			var bushLayer = me.game.currentLevel.getLayerByName("bushlayer");
			
			var tileX = Math.ceil(this.pos.x / colLayer.tilewidth);
			var tileY = Math.ceil(this.pos.y / colLayer.tileheight);
			var botTileX = 0;
			var botTileY = 0;
			
			if(this.owner.direction=="down") {
				this.anchorPoint.set(0.5, 0.88);
				var botTileX = Math.ceil(this.pos.x / colLayer.tilewidth);
				var botTileY = Math.ceil((this.pos.y+this.weapon.attackRect[0][4]) / colLayer.tileheight);
				//this.pos.x += this.weapon.attackRect[0][0];
				//this.pos.y -= this.weapon.attackRect[0][1];
				this.body.setShape(1);
			}
			else if(this.owner.direction=="left") {
				this.anchorPoint.set(0.18, 0.55);
				var botTileX = Math.ceil((this.pos.x+this.weapon.attackRect[1][3]) / colLayer.tilewidth);
				var botTileY = Math.ceil(this.pos.y / colLayer.tileheight);
				//this.pos.x += this.weapon.attackRect[1][0];
				//this.pos.y -= this.weapon.attackRect[1][1];
				this.body.setShape(2);
			}
			else if(this.owner.direction=="right") {
				this.anchorPoint.set(0.88, 0.55);
				var botTileX = Math.ceil((this.pos.x+this.weapon.attackRect[2][3]) / colLayer.tilewidth);
				var botTileY = Math.ceil(this.pos.y / colLayer.tileheight);
				//this.pos.x += this.weapon.attackRect[2][0];
				//this.pos.y -= this.weapon.attackRect[2][1];
				this.body.setShape(3);
			}
			else if(this.owner.direction=="up") {
				this.anchorPoint.set(0.37, 0.1);
				var botTileX = Math.ceil(this.pos.x / colLayer.tilewidth);
				var botTileY = Math.ceil((this.pos.y-this.weapon.attackRect[3][4]) / colLayer.tileheight);
				//this.pos.x += this.weapon.attackRect[3][0];
				//this.pos.y -= this.weapon.attackRect[3][1];
				this.body.setShape(4);
			}
			else {
				
			}
			
			var bottomTile = colLayer.layerData[botTileX][botTileY];
			var topTile = colLayer.layerData[tileX][tileY];
			if(bottomTile != null) {
				var myTileProperty = colLayer.tileset.getTileProperties(bottomTile.tileId);
				if (myTileProperty.tallgrass) {
					me.sys.preRender = false;
					console.log(bottomTile);
					colLayer.clearTile(tileX,tileY);
					bushLayer.clearTile(tileX,tileY);
					me.sys.preRender = true;
				}
			}
			else if(topTile != null) {
				var myTileProperty = colLayer.tileset.getTileProperties(topTile.tileId);
				if (myTileProperty.tallgrass) {
					me.sys.preRender = false;
					console.log(topTile);
					colLayer.clearTile(tileX,tileY);
					bushLayer.clearTile(tileX,tileY);
					me.sys.preRender = true;
				}
			}
			else {
			}
			
			var self = this;
			setTimeout(function() {
				self.body.setShape(0);
				self.owner.attacking = false;
				self.needsDrawn = false;
			}, this.weapon.rate);
			/*TODO attack*/
		}
	},
	
	draw: function(renderer) {
		/* Call overriden function */
		if(this.needsDrawn) {
			this._super(me.Entity, 'draw', [renderer]);
		}
	},
	
    update: function(dt) {
        // check & update player movement
        this.body.update(dt);
		
		if (me.input.isKeyPressed('attack') && !this.owner.attacking) {
			this.attack();
		}

        // update animation if necessary
        if (this.owner.attacking) {
            // update object animation
            this._super(me.Entity, 'update', [dt]);
            return true;
        }
		
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }     
});