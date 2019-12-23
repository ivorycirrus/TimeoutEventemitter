const EventEmitter = require('events');

class TimeoutEventEmitter extends EventEmitter {
	timeoutListener (eventName, timeout) {
		return new Promise((resolve, reject) =>{
			let timer, listener;
			listener = (ev) => { 
				clearTimeout(timer);
				resolve(ev); 
			};
			timer = setTimeout(()=>{
				this.removeListener(eventName, listener);
				reject(`Timeout on ${eventName} by ${timeout/1000} seconds.`);
			}, timeout);
			this.once(eventName, listener);
		});
	}

	async onceByTimeout (eventName, timeout, callback, onTimeout){
		try{
			let result = await this.timeoutListener(eventName, timeout);
			if(callback) callback(result);
		} catch(e) {
			if(onTimeout) onTimeout(e);
		}
	}
}

module.exports = TimeoutEventEmitter;