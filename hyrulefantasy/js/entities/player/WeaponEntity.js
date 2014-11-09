game.weapons = {
	sword: {
		name: 'Sword',
		image: "boy_sword",
		animation: [2, 3, 4, 5],
		rate: 450,
		damage: 1,
		speed: null,
		projectile: null,
		pWidth: null,
		pHeight: null,
		wWidth: null,
		wHeight: null,
		offsetX: null,
		offsetY: null,
		addOffset: null,
		attackRect: [[0, 23, 0, 32],[0, 23, 0, 32],[0, 23, 0, 32],[0, 23, 0, 32]] //down, left, right, up
	}
};

game.WeaponEntity = game.BaseEntity.extend({
  
    init: function(x, y, settings, owner) {
    	console.log("stuff");
		this.owner = owner;
		this.weapon = owner.currentWep;
		
    	settings.image = owner.currentWep.image;
    	settings.spritewidth = 44;
    	settings.spriteheight = 40;
		
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
              
        this.body.gravity = 0;

        this.renderable.addAnimation("down", [0,1,2],100);
        this.renderable.addAnimation("left", [3,4,5],100);
        this.renderable.addAnimation("right", [6,7,8],100);
        this.renderable.addAnimation("up", [9,10,11],100);
		
		this.body.collidable = true;
		this.body.addShape(new me.Rect(16,18,11,11));
		this.body.addShape(new me.Rect(this.weapon.attacRect[0][0],this.weapon.attacRect[0][1],this.weapon.attacRect[0][2],this.weapon.attacRect[0][3]));	//Down
		this.body.addShape(new me.Rect(this.weapon.attacRect[1][0],this.weapon.attacRect[1][1],this.weapon.attacRect[1][2],this.weapon.attacRect[1][3]));	//Left
		this.body.addShape(new me.Rect(this.weapon.attacRect[2][0],this.weapon.attacRect[2][1],this.weapon.attacRect[2][2],this.weapon.attacRect[2][3]));	//Right
		this.body.addShape(new me.Rect(this.weapon.attacRect[3][0],this.weapon.attacRect[3][1],this.weapon.attacRect[3][2],this.weapon.attacRect[3][3]));	//Up
		this.body.setShape(1);
        
		this.direction = owner.direction;
		this.renderable.setCurrentAnimation( this.direction );
    },
	
	attack : function() {
		if (me.input.isKeyPressed('attack')) {
			this.owner.attacking = true;
			
			this.owner.renderable.setCurrentAnimation("attack"+this.owner.direction);
			this.renderable.setAnimationFrame();
			
			if(this.owner.direction=="down") {
				this.body.setShape(2);
			}
			else if(this.owner.direction=="left") {
				this.body.setShape(3);
			}
			else if(this.owner.direction=="right") {
				this.body.setShape(4);
			}
			else if(this.owner.direction=="up") {
				this.body.setShape(5);
			}
			else {
				
			}
			
			setTimeout(function() {
				this.body.setShape(1);
				this.attacking = false;
			}, this.weapon.rate);
			/*TODO attack*/
		}
	},
	
	draw: function(renderer) {
		/* Call overriden function */
		this._super(me.Entity, 'draw', [renderer]);
	},
   
    update: function(dt) {
        // check & update player movement
        this.body.update(dt);
		
        // check for collision
		// TODO
        /*var res =  me.game.world.collide(this);
    	if (res && (res.obj.type == me.game.ENEMY_OBJECT)) {        		    		  		    		  		    	  
    		delete this._target;    		
    		this.pos.x -= res.x;
    		this.pos.y -= res.y; 
    		
    		this.doTalk( res.obj );
		}*/
		
		if (me.input.isKeyPressed('attack') && !this.owner.attacking) {
			this.attack();
			this.owner.attacking = true;
			
			setTimeout(function() {
				this.owner.attacking = false;
			}, this.weapon.rate);
		}

        // update animation if necessary
        if (this.body.vel.x!=0 || this.body.vel.y!=0) {
            // update object animation
            this._super(me.Entity, 'update', [dt]);
            return true;
        }
		
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }     
});