game.GirlEntity = game.BaseEntity.extend({
	
	init: function(x, y, settings) {
    	
    	settings.image = "girl";
    	settings.spritewidth = 24;
    	settings.spriteheight = 36;
    	    	    	      
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
                
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity( 2, 2);
              
        this.body.gravity = 0;
        this.body.setFriction(0.5, 0.5);
                       
        this.body.collidable = true;        
        this.body.type = me.game.ENEMY_OBJECT;
                            
        this.renderable.addAnimation("down", [0,1]);
        this.renderable.addAnimation("left", [2,3]);
        this.renderable.addAnimation("right", [4,5]);
        this.renderable.addAnimation("up", [6,7]);
                
		this.minX = x;
        this.minY = y;
        this.maxX = x + settings.width - settings.spritewidth;
        this.maxY = y + settings.height - settings.spriteheight;
                                                                                                                                               				
		// create dialog
		this.dialog = new game.Dialog( DIALOGUES[ this.name ], this.onDialogReset.bind(this), this.onDialogShow.bind(this));					  							    	        	        
		
	},
	
    update: function(dt) {
    	    	    	    	    	                        
        if(!this._target){
       		this._setRandomTargetPosition();
        }
                       
		if(!this.isTalking){   
        	this._calculateStep();
        }
		
        this.body.update(dt);
                                  	                  
        // update animation if necessary
        if (this.body.vel.x!=0 || this.body.vel.y!=0) {
            // update object animation
            this._super(me.Entity, 'update', [dt]);
            return true;
        }
        
        return false;
    }                          	  
});