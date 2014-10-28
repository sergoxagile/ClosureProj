goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

function App() {
    this.hasTouch = 'ontouchstart' in window;
}


App.prototype = {
    eventDispatch: {
        mouse: {
            move: 'MOUSEMOVE',
            end: 'MOUSEUP'
        },
        touch: {
            move: 'TOUCHMOVE',
            end: 'TOUCHEND'
        }
    },
    init: function(){
        this.divs = [];
        width = window.screenX / 5;
        goog.array.insert(this.divs, this.createDiv('#009900', width + 'px'));
        goog.array.insert(this.divs, this.createDiv('#990000', width + 'px'));
        goog.array.forEach(this.divs, goog.bind(this.initDiv, this));
        this.currentEvent = null;
    },
    initDiv: function(item) {
        goog.dom.appendChild(document.body, item);
        goog.events.listen(item, goog.events.EventType.MOUSEDOWN, goog.bind(this.dispathStartEevent, this));
        goog.events.listen(item, goog.events.EventType.TOUCHSTART, goog.bind(this.dispathStartEevent, this));
    },
    createDiv: function(color, size, text) {
        color = color || '#009900';
        size  = size  || '50px';
        text = text   || 'div ' + (this.divs.length + 1);
        style = 'background-color:' + color +';width:' + size + ';height:' + size + ';';
        return goog.dom.createDom('div', {'style': style, 'class': 'div' + this.divs.length}, text);
    },
    dispathStartEevent: function(event) {
        eventTrigger = event.type === 'touchstart' ? 'touch' : 'mouse';
        var timeout = null;
        if(event.type === 'touchstart' && !this.currentEvent) {
            this.currentEvent = 'touchstart';
            timeout = setTimeout(goog.bind(this.onDivMouseDown, this, event, eventTrigger), 500);
            timeoutEventKey = goog.events.listenOnce(goog.dom.getDocument(), goog.events.EventType.TOUCHMOVE, goog.bind(this.prevntMoveDiv, this, timeout));
        } else if (event.type === 'mousedown' && !this.currentEvent) {
            this.currentEvent = 'mousedown';
            this.onDivMouseDown(event, eventTrigger);
        }
        goog.events.listenOnce(goog.dom.getDocument(), goog.events.EventType[this.eventDispatch[eventTrigger].end], goog.bind(this.onDivMouseUp, this, timeout));
    },
    prevntMoveDiv: function(timeoutKey) {
        window.clearTimeout(timeoutKey);
    },
    onDivMouseDown: function(event, eventTrigger) {
        event.preventDefault();
        cords = goog.style.getCssTranslation(event.currentTarget);
        this.target = {
            element: event.currentTarget,
            offsetX: eventTrigger === 'mouse' ? event.offsetX : event.event_.changedTouches[0].clientX - cords.x,
            offsetY: eventTrigger === 'mouse' ? event.offsetY : event.event_.changedTouches[0].clientY - cords.y
        };
        goog.style.setStyle(this.target.element, {
            'opacity': '0.5'
        });
        this.currentEventKey = goog.events.listen(goog.dom.getDocument(), goog.events.EventType[this.eventDispatch[eventTrigger].move], goog.bind(this.onDivMouseMove, this));
    },
    onDivMouseMove: function(event) {
        event.preventDefault();
        var xCord = event.type === 'mousemove' ? event.clientX : event.event_.changedTouches[0].clientX,
            yCord = event.type === 'mousemove' ? event.clientY : event.event_.changedTouches[0].clientY;
        this.moveTransition(xCord - this.target.offsetX, yCord - this.target.offsetY);
    },
    onDivMouseUp: function(timeout, event) {
        event.preventDefault();
        if(timeout) {
            window.clearTimeout(timeout);
        }
        if(this.target) {
            goog.style.setStyle(this.target.element, {
                'opacity': '1'
            });
            goog.events.unlistenByKey(this.currentEventKey);
        }
        this.targetDiv = null;
        this.currentEventKey = null;
        this.currentEvent = null;
        this.target = null;
    },
    moveTransition: function(x,y) {
        goog.style.setStyle(this.target.element, {
            'transform': 'translate(' + x + 'px, ' + y + 'px)'
        });
    }
};

app = new App();