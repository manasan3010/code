export class Shape {
    svgC;
    currentShape;
    currentElement;
    startClick;
    constructor(svgC) { this.svgC = svgC }

    startCreateShape(currentShape, startClick) {
        this.startClick = startClick

        var newElement;
        switch (currentShape) {
            case 'rectangle':
                newElement = document.createElement('path');
                newElement.setAttribute('d', `M${startClick.x} `);
                break;
            case 'square':
                newElement = document.createElement('rect');
                newElement.setAttribute('x', startClick.x);
                newElement.setAttribute('y', startClick.y);
                break;
            case 'circle':
                newElement = document.createElement('circle');

                break;
            case 'triangle':
                newElement = document.createElement('path');

                break;
            case 'custom':
                // newElement = `<polygon points="${this.startClick.x},${this.startClick.y}" elemid="${Math.random()}"/>`;
                newElement = document.createElement('path');


                break;
        }

        // this.currElem = this.svgC.nativeElement.lastChild
        this.svgC.insertBefore(newElement);
        // this.customCreated = true
        this.currentElement = newElement;
    }

    endCreateShape(endClickR) {

        switch (this.currentShape) {
            case 'rectangle':
                this.currentElement.setPathData(this.currentElement.getPathData().push({type:'h',values:[endClickR.x]}));
                break;
            case 'square':
                endClickR.x = (endClickR.x > endClickR.y) ? endClickR.y : endClickR.x;

                this.currentElement.setAttribute('height', endClickR.x);
                this.currentElement.setAttribute('width', endClickR.x);
                break;
            // case 'circle':
            //     endClickR.x = (endClickR.x > endClickR.y) ? endClickR.y : endClickR.x;

            //     this.currentElement.setAttribute('cx', (endClickR.x / 2 + this.start.x));
            //     this.currentElement.setAttribute('cy', (endClickR.x / 2 + this.start.y));

            //     this.currentElement.setAttribute('r', endClickR.x / 2);
            //     break;
            // case 'triangle':

            //     this.currentElement.setAttribute('points', `${this.start.x + endClickR.x / 2},${this.start.y},${this.start.x},${this.start.y + endClickR.y},${this.start.x + endClickR.x},${this.start.y + endClickR.y}`);
            //     break;
            // case 'custom':

            //     this.currentElement.setAttribute('points', `${this.currentElement.getAttribute('points')},${this.start.x},${this.start.y}`);
            //     break;
        }
    }























}
