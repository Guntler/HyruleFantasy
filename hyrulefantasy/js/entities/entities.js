game.BaseEntity = me.Entity.extend({
	init: function(x, y, settings) {
		this._super(x, y, settings);
		
		
		this.animated = false;
		
		this.attacking = false;
		this.inTallGrass = false;
		
		this.weapons = [];
		this.equipped = [];
		
		this.currentWep = null;
		this.currentGear = null;
		
		this.hp = 1;
	},
	
	equipWep: function(wepName) {
		var wep = game.weapons[wepName];
		this.equippedWep = wep;
	},
	
	/**
     * Set direction 
 	 * @private
 	 * @param {number} dx
 	 * @param {number} dy
     */
    _setDirection:function( dx, dy ){
		var newDirection;
		
    	if( Math.abs( dx ) > Math.abs( dy ) ){
    		newDirection = ( dx > 0) ? "right" : "left";
    	}else if(Math.abs( dx ) < Math.abs( dy )){
    		newDirection = ( dy > 0) ? "down" : "up";    		   		
    	}
		else {
			newDirection = this.direction;
			this.renderable.setCurrentAnimation( this.direction );
			this.renderable.setAnimationFrame();
		}
		
		if(this.direction != newDirection) {
			this.direction = newDirection;
			this.renderable.setCurrentAnimation( this.direction );
			this.renderable.setAnimationFrame();
		}
    },  
    
    /**
     * Calculate step for every update 	
 	 * @private
     */
    _calculateStep: function(){
    	
    	if( this._target ){
    		    		    			    			    		    		 
    		var dx = this._target.x - this.pos.x;	
    		var dy = this._target.y - this.pos.y;
    		    		    	
    		if(Math.abs(dx) < this.body.maxVel.x 
        	&& Math.abs(dy) < this.body.maxVel.x){        		
        		delete this._target;
        		return;        		        		     
        	}
        	        	    	
    		var angle = Math.atan2(dy, dx);
        	this.body.vel.x = Math.cos(angle) * this.body.accel.x * me.timer.tick;
        	this.body.vel.y = Math.sin(angle) * this.body.accel.y * me.timer.tick;        	        	        	        	               	           	   
    	}else{
    		this.body.vel.x = 0;
    		this.body.vel.y = 0;
    	}    	    	    	    	
    }, 
    
     /**
    * set a random target position   
    */
    _setRandomTargetPosition:function(){
    	
    	  if(!this._targetIsSet){
        	this._targetIsSet = true;
        	        
        	var min = 500;
        	var max = 3000;
        	var waitFor = Math.random() * (max - min) + min;
        	        	
        	// wait from min to max before next step
        	window.setTimeout(function(){        		
        		this._target = {};        	   	  	    	   	  
    			this._target.x = Number(0).random(this.minX, this.maxX); 	
    			this._target.y = Number(0).random(this.minY, this.maxY);
    			this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);      
    			this.renderable.setCurrentAnimation( this.direction );
				delete this._targetIsSet;		        		
        	}.bind(this), waitFor);        	        		
        }    	    	    	    	 
    },
    
     /**
	 * default on collision handler	
	 */ 
    onCollision : function (res, obj){    		   
    	delete this._target;    	  
    	this._setDirection( -res.x, -res.y );
    	this.renderable.setCurrentAnimation( this.direction );
    },  
    
    onDialogReset:function(){
    	// wait for 2 sec - let the hero go away
    	var waitFor = 2000;
    	window.setTimeout(function(){
    		delete this.isTalking;	
    	}.bind(this), waitFor);    	    	
    },   
    
    onDialogShow:function( event ){    	
    	if(event.sentence.isChoice){
    		return;	
    	}
    		    	
    	// create sound icon    	    
    	var icon = document.createElement( "i" );
    	icon.setAttribute( "class", "glyphicon glyphicon-volume-up");
    	icon.addEventListener( me.device.touch ? "touchstart" : "mousedown", function( e ) {
    		e.preventDefault();
    		e.stopPropagation();
			console.log("play sound: " + event.sentence.dialogueText);				
		}.bind( this ), false );
    	
    	var paragraph = event.DOM.querySelector("p");    	    	        	
    	paragraph.appendChild( icon );    	    	   	    	  
    },
});

game.PickupEntity = me.CollectableEntity.extend({
		init: function(x, y, settings) {			
			this.item = settings.item;
			this.itemType = settings.itemType;
			this.animationpause = true;
			
			settings.image = "pickups";
			settings.spritewidth = 16;
			settings.spriteheight = 16;
			
			this._super(me.CollectableEntity, 'init', [x, y, settings]);
			
			this.body.collidable = true;
			this.body.onCollision = this.onCollision.bind(this);
			
			this.renderable.addAnimation("sword", [0],0);
			this.renderable.addAnimation("shield", [2],0);
			this.renderable.setCurrentAnimation( settings.item );
		},
		
		onCollision: function(res,obj) {
			if(obj.name === "hero") {
				if(this.itemType === 'weapon') {
					obj.weapons.push(this.item);
					obj.equipWep(this.item);
				}
				this.body.setCollisionMask(me.collision.types.NO_OBJECT);
				me.game.world.removeChild(this);
			}
		}
	});

