Leap.ScreenList = function(){
	
	if(localStorage.screens){
		var screens = JSON.parse(localStorage.screens);
		for(var id in screens){
			var screen = screens[id];
			if(screen.length == 7){
				var data = [new Leap.Vector(screen[0]), new Leap.Vector(screen[1]), new Leap.Vector(screen[2]), screen[3], screen[4], screen[5], screen[6]];
				this.push(new Leap.Screen(data));
			}
		}
		this.save();
	}
};

Leap.ScreenList.prototype = new Leap.List;

Leap.ScreenList.prototype.closestScreenHit = function(pointable){
	
	if(this.empty()) return Leap.Screen.invalid();
	
	var closest = Leap.Screen.invalid();
	var min;
	
	for(var index = 0; index < this.length; index++){
	
		var hit = this[index].intersect(pointable);
		
		if(hit && (closest._valid == false || hit.distance < min)){
			closest = this[index];
			min = hit.distance;
		}
	}
	
	return closest;
};

Leap.ScreenList.prototype.save = function(){

	var screenData = [];
	for(var i = 0; i < this.length; i++) screenData.push(this[i]._data);
	localStorage.screens = JSON.stringify(screenData);
};

Leap.ScreenList.prototype.clear = function(){

	this.length = 0;
	this.save();
};