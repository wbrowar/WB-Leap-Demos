if ((typeof(WebSocket) == 'undefined') && (typeof(MozWebSocket) != 'undefined')) WebSocket = MozWebSocket;

Leap.Controller = function(connection){
	
	this._frames = [];
	this._frameTable = {};
	
	this._listeners = {};
	this._listenerId = 0;
	
	this._bufferSize = 64;
	this._bufferBegin = 0;
	
	this._screens = new Leap.ScreenList();
	
	this._gesturesActive = false;
	this._gesturesAllowed = {};
	
	for(var index = 0; index < this._bufferSize; index++) this._frames[index] = Leap.Frame.invalid();
	
	this._connect(connection);
};

Leap.Controller.prototype = {
	
	isConnected : function(){
		return this._socket.connected;
	},
	
	frame : function(index){
		if(index == null || index == 0) return this._frames[this._bufferBegin];
		if(index > this._bufferSize - 1) return Leap.Frame.invalid();
		
		index = this._bufferBegin-index;
		if(index < 0) index += this._bufferSize;
		return this._frames[index];
	},
	
	addListener : function(listener){
		listener._id = this._listenerId++;
		this._listeners[listener._id] = listener;
		listener.onInit(this);
	},
	
	removeListener : function(listener){
		listener.onExit(this);
		this._listeners[listener._id].onExit(this);
		delete this._listeners[listener._id];
	},
	
	config : function(){
		// Requires additional data form WebSocket server
	},
	
	locatedScreens : function(){
		return this._screens;
	},
	
	// Depricated
	calibratedScreens : function(){
		return this._screens;
	},
	
	enableGesture : function(type, enable){
	
		if(enable){
			this._gesturesAllowed[type] = Leap.Gesture.Type[type];
			
			if(!this._gesturesActive){
				this._gesturesActive = true;
				if(this.isConnected()) this._socket.send('{"enableGestures": true}');
			}
		}
		else{
			delete this._gesturesAllowed[type];
			
			if(this._gesturesActive && Object.keys(this._gesturesAllowed).length == 0){
				this._gesturesActive = false;
				if(this.isConnected()) this._socket.send('{"enableGestures": false}');
			}
		}
	},
	
	isGestureEnabled : function(type){
		return this._gesturesAllowed[type]?true:false;
	},
	
	_onmessage : function(event){
		
		var eventData = JSON.parse(event.data);
		var newFrame = new Leap.Frame(eventData, this);
		
		this._bufferBegin++;
		if(this._bufferBegin == this._bufferSize) this._bufferBegin = 0;
		
		var oldFrame = this._frames[this._bufferBegin];
		oldFrame._delete();
		delete this._frameTable[oldFrame._id];
		delete this._frames[this._bufferBegin];
		this._frameTable[newFrame._id] = newFrame;
		this._frames[this._bufferBegin] = newFrame;
		
		for(index in this._listeners)
			this._listeners[index].onFrame(this);
	},
	
	_versionFrame : function(event){
		Leap.serverVersion = JSON.parse(event.data).version;
		this._socket.onmessage = function(event){ this._controller._onmessage(event); };
	},
	
	_connect : function(connection){
		if (typeof(WebSocket) == 'undefined') return;
		
		if(this._socket) delete this._socket;
		this._socket = new WebSocket(connection);
		this._socket._controller = this;
		this._socket.connected = false;
		
		this._socket.onmessage = function(event){
			this._controller._versionFrame(event);
		};
		
		this._socket.onopen = function(event){
			this.connected = true;
			if(this._controller._gesturesActive) this.send('{"enableGestures": true}');
			for(index in this._controller._listeners)
				this._controller._listeners[index].onConnect(this._controller);
		};
		
		this._socket.onclose = function(event){
			this.connected = false;
			for(index in this._controller._listeners)
				this._controller._listeners[index].onDisconnect(this._controller);
			var me = this;
			setTimeout(function(){ me._controller._connect(me.url); }, 1000);
		};
		
		this._socket.onerror = function(event){ 
			this.onclose(event);
		};
	}
};
