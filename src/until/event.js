import { specType } from './until.js';
const event = () => {
	let eventQueue = {};
	let _addEvent = (event, fn) => {
		specType(eventQueue[event]) === 'Array' || (eventQueue[event] = []);
		eventQueue[event].push(fn);
	};
	let _once = (event, fn) => {
	};
	let _emitEvent = (events, ...args) => {
		if (typeof events === 'string') {
			events = events.split()
		}
		events.map((event) => {
			let queues;
			if (queues = eventQueue[event]) {
				queues.map((queue) => {
					queue.apply(this, args);
				})
			}
		})
	};
	let _removeEvent = (event) => {
		eventQueue[event] && (eventQueue[event] = null)
	}
	let _emptyQueue = () => {
		eventQueue = {};
	}
	return {
		addEvent: _addEvent,
		emitEvent: _emitEvent,
		removeEvent: _removeEvent,
		emptyQueue: _emptyQueue
	}
};
export default event;


/**
 * Created by SMac on 17/8/9.
 */
