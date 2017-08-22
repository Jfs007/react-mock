/**
 * Created by SMac on 17/8/9.
 */


import event from './until/event';

let drag = (React) => {
	let Event = event();
	let dr = function (target) {
		Event.emitEvent('down');
		document.onmousemove = function (e) {
			Event.emitEvent('move');
		}
		target.addEventListener('mouseup', (e) => {
			Event.emitEvent('up');
			document['onmousemove'] = null;
			//document.addEventListener('mousemove', removeEvent, false)
		})
	}
	let api = {
		addEvent: Event.addEvent,
		removeEvent: Event.removeEvent,
		up(fn) {
			api.addEvent('up', fn)
		},
		down(fn) {
			api.addEvent('down', fn)
		},
		move(fn) {
			api.addEvent('move', fn)
		},
		dr: dr
	}
	return api
};
export default drag;
