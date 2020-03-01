import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { Shape } from './shape';
// import * as test from 'path-data-polyfill/path-data-polyfill.js'
import * as svgIntersections from 'svg-intersections';
import { ShapeInfo, Intersection } from "kld-intersections/dist/index-esm.js";


import { ConvertToSVGService } from './../convert-to-svg.service';


declare var Raphael: any;

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddCourseComponent implements OnInit, AfterViewInit {

  // @ViewChild('rect', { static: false }) rect: ElementRef;
  @ViewChild('svg_container', { static: false }) svgC: ElementRef;
  constructor(private convertToSVG: ConvertToSVGService) { }


  intersect = svgIntersections.intersect;
  shape = svgIntersections.shape;
  containerPath: any;
  file;
  startClick = <any>{}
  customOnCreation = true
  startCord = <any>{}
  endClickR = <any>{}
  pointsArray = <any>[]
  clickedPoints = <any>[]
  elements = <any>[]
  dim = { left: 0, top: 0 }
  currentShape = 'rectangle'
  draggable = false
  currElem;
  paper;
  paperC;
  img = <any>{};
  clicked = false;

  ngOnInit() {
    this.paper = Raphael(document.getElementById('paperC'), 0, 150, 1500, 1500)
    this.paper.canvas.setAttribute('height', 1500)
    this.paper.canvas.setAttribute('width', 1500)
    this.paperC = this.paper.canvas
    // this.start()

  }

  ngAfterViewInit() {

    // var string = ``

    // var convertedSVG = this.convertToSVG.convert(string);
    // console.log(convertedSVG)

    var paper = this.paper

    this.containerPath = paper
      .path("M0 0 h300 v300 h300 v300 h-600 Z")
      .attr('stroke', '#f00')
      .attr('stroke-width', '2px')
      .attr('fill', 'rgba(0,0,0,0)')
      .node
    // console.log(paper.set().push(
    //   paper.circle(10, 10, 5),
    //   paper.circle(30, 10, 5)
    // ))

    // SVG-intersection
    var intersections = this.intersect(
      this.shape("circle", { cx: 0, cy: 0, r: 50 }),
      this.shape("circle", { cx: 5, cy: 5, r: 45 }),
      this.shape("path", { d: 'M0 0 l10 20 l50 30' }),
      this.shape("path", { d: 'M0,0H300V300H600V600H0Z' })
    );
    console.log(intersections)
    //kld-intersection
    const path1 = ShapeInfo.path("M 0 10 L 30 0 L 0 30 L -50 30 Z")
    const path2 = ShapeInfo.path("M 0 31 L 30 21 L 0 51 L -50 51 Z")
    // const path3 = ShapeInfo.path("M 0 32 L 30 22 L 0 52 L -50 52 Z")
    // const path4 = ShapeInfo.path("M 0 33 L 30 23 L 0 53 L -50 53 Z")
    const intersections2 = Intersection.intersect(path1, path2);

    // intersections2.points.forEach(console.log);
    console.log(intersections2)

    return false

    var rect2 = paper
      .path("M220 110 l10 20 l50 30")
      .attr('fill', '#f00')
      .attr('stroke', '#f00')


    var ft2 = paper.freeTransform(rect2, { draw: 'bbox' }, function (ft2, events) {
      console.log(ft2.attrs);
    });

    var rect3 = paper
      .circle(200, 200, 100)
      .attr('fill', '#00f');


    var ft3 = paper.freeTransform(rect3, { scale: true });



    var rect4 = paper
      .rect(200, 200, 200, 100)
      .attr('fill', '#00f');


    var ft4 = paper.freeTransform(rect4, { draw: 'bbox' }, function (ft2, events) {
      console.log(ft4.attrs)
    });

    ft4.apply();





  }

  mouseDown(evt) {

    // console.log(this.dim)

    this.startClick.x = evt.clientX - this.svgC.nativeElement.getBoundingClientRect().left;
    this.startClick.y = evt.clientY - this.svgC.nativeElement.getBoundingClientRect().top;

    if (this.draggable) {
      this.currElem = evt.target;

      if (evt.target.hasAttribute('handler')) {
        this.clicked = true;



        return;
      }

      this.startCord.x = this.currElem.getAttribute('x');
      this.startCord.y = this.currElem.getAttribute('y');
      this.startCord.cx = this.currElem.getAttribute('cx');
      this.startCord.cy = this.currElem.getAttribute('cy');
      this.startCord.points = this.currElem.getAttribute('points') != null ? this.currElem.getAttribute('points').split(',') : [];

      // console.log(this.startClick)
    } else {

      // if (this.svgC.nativeElement.lastChild != null) {
      //   if (this.currentShape == 'custom' &&
      //     this.customOnCreation == true &&
      //     this.svgC.nativeElement.lastChild.tagName.toLowerCase() == "polygon") {
      //     this.currElem = this.svgC.nativeElement.lastChild
      //     this.endCreateShape()
      //     return;
      //   }
      // }
      // this.startCreateShape()
      this.currElem = new Shape(this.svgC)
      this.currElem.startCreateShape(this.currentShape, this.startClick)
    }

    this.clicked = true;
  }

  mouseDown2(evt) {
    var paper = this.paper
    this.startClick.x = evt.clientX - this.paperC.getBoundingClientRect().left;
    this.startClick.y = evt.clientY - this.paperC.getBoundingClientRect().top;

    if (this.currentShape == 'custom' && this.customOnCreation) {
      console.log(evt, this.startClick)
      this.pointsArray.push(JSON.parse(JSON.stringify(this.startClick)))
      this.clickedPoints.push(this.paper.circle(this.startClick.x, this.startClick.y, 5))

    }

    return;
    if (this.draggable) {
      this.currElem = evt.target;

      if (evt.target.hasAttribute('handler')) {
        this.clicked = true;



        return;
      }

      this.startCord.x = this.currElem.getAttribute('x');
      this.startCord.y = this.currElem.getAttribute('y');
      this.startCord.cx = this.currElem.getAttribute('cx');
      this.startCord.cy = this.currElem.getAttribute('cy');
      this.startCord.points = this.currElem.getAttribute('points') != null ? this.currElem.getAttribute('points').split(',') : [];

      // console.log(this.startClick)
    } else {

      // if (this.svgC.nativeElement.lastChild != null) {
      //   if (this.currentShape == 'custom' &&
      //     this.customOnCreation == true &&
      //     this.svgC.nativeElement.lastChild.tagName.toLowerCase() == "polygon") {
      //     this.currElem = this.svgC.nativeElement.lastChild
      //     this.endCreateShape()
      //     return;
      //   }
      // }
      // this.startCreateShape()
      this.currElem = new Shape(this.svgC)
      this.currElem.startCreateShape(this.currentShape, this.startClick)
    }

    this.clicked = true;
  }


  mouseUp(evt) {
    this.clicked = false;

  }

  shapeChange() {
    var paper = this.paper

    switch (this.currentShape) {
      case 'rectangle':
        var rect4 = paper
          .rect(200, 200, 200, 100)
          .attr('fill', '#00f');

        var ft4 = paper.freeTransform(rect4, { draw: 'bbox' }, function (ft2, events) {
          console.log(ft4.attrs)
        });
        break;
      case 'square':
        var rect4 = paper
          .rect(200, 200, 100, 100)
          .attr('fill', '#00f');
        var ft4 = paper.freeTransform(rect4, { keepRatio: true, draw: 'bbox' }, function (ft2, events) {
          console.log(ft4.attrs)
        });
        break;
      case 'circle':
        var rect4 = paper
          .circle(200, 200, 100)
          .attr('fill', '#00f');
        var ft4 = paper.freeTransform(rect4, { draw: 'bbox' }, function (ft2, events) {
          console.log(ft4.attrs)
        });
        break;

        break;
      case 'custom':
        // newElement = `<polygon points="${this.startClick.x},${this.startClick.y}" elemid="${Math.random()}"/>`;
        // newElement = document.createElement('path');


        break;
    }


    if (this.currentShape != 'custom') this.elements.push(ft4)

  }


  mouseMove(evt) {
    // if (!this.clicked) { return; }


    if (this.draggable) {
      this.endClickR.x = evt.clientX - this.dim.left - this.startClick.x;
      this.endClickR.y = evt.clientY - this.dim.top - this.startClick.y;

      if (this.currElem.hasAttribute('handler')) {
        this.resizeShape()
        return;
      }

      this.dragShape()
    } else {


      this.endClickR.x = evt.clientX - this.dim.left - this.startClick.x;
      this.endClickR.y = evt.clientY - this.dim.top - this.startClick.y;
      this.currElem.endCreateShape(this.endClickR)
    }

    // console.log(this.end.y, evt.clientX, this.dim.left, this.start.x)
    // console.log(this.end, evt.clientX, this.dim.left, this.start)


  }

  mouseMove2(evt) {
    return


    if (this.draggable) {
      this.endClickR.x = evt.clientX - this.dim.left - this.startClick.x;
      this.endClickR.y = evt.clientY - this.dim.top - this.startClick.y;

      if (this.currElem.hasAttribute('handler')) {
        this.resizeShape()
        return;
      }

      this.dragShape()
    } else {


      this.endClickR.x = evt.clientX - this.dim.left - this.startClick.x;
      this.endClickR.y = evt.clientY - this.dim.top - this.startClick.y;
      this.currElem.endCreateShape(this.endClickR)
    }

    // console.log(this.end.y, evt.clientX, this.dim.left, this.start.x)
    // console.log(this.end, evt.clientX, this.dim.left, this.start)


  }


  resizeShape() {
    var handler = JSON.parse(this.currElem.getAttribute('handler'))
    var parent = document.querySelector(`[elemid="${handler.parent}"]`)
    var parentPoints = parent.getAttribute('points').split(',')

    parentPoints[handler.pairNo] += parseInt(this.endClickR.x)
    parentPoints[handler.pairNo + 1] += parseInt(this.endClickR.y)

    parent.setAttribute('points', parentPoints.join(','));

  }




  dragShape() {
    console.log(this.currElem.tagName.toLowerCase())

    switch (this.currElem.tagName.toLowerCase()) {
      case 'rect':
        this.currElem.setAttribute('y', (this.endClickR.y) - (-this.startCord.y));
        this.currElem.setAttribute('x', (this.endClickR.x) - (-this.startCord.x));
        break;
      case 'circle':
        this.currElem.setAttribute('cy', (this.endClickR.y) - (-this.startCord.cy));
        this.currElem.setAttribute('cx', (this.endClickR.x) - (-this.startCord.cx));
        break;
      case 'polygon':
        var pointsCord = "";
        for (var i = 0; i < this.startCord.points.length; i += 2) {
          pointsCord += `${this.startCord.points[i] - (-this.endClickR.x)},${this.startCord.points[i + 1] - (-this.endClickR.y)},`
        }
        this.currElem.setAttribute('points', pointsCord);
        break;
    }
  }

  createHandlers() {
    var children = this.svgC.nativeElement.children;

    for (var i = 0; i < children.length; i++) {
      var element = children[i];
      if (element.tagName.toLowerCase() != 'polygon') { return; }
      var points = element.getAttribute('points').split(',');

      for (var a = 0; a < points.length; a += 2) {
        var circle = `<circle handler='${JSON.stringify({ parent: element.getAttribute('elemid'), pairNo: a / 2 })}' cx="${points[a]}" cy="${points[a + 1]}" r="10" />`;
        this.svgC.nativeElement.innerHTML += circle;
        // Do stuff
      }
    }

  }


  finishPath() {
    this.customOnCreation = false
    var pathString
    if (this.pointsArray.length == 0) return;

    this.pointsArray.forEach((element, i) => {
      if (i == 0) {
        pathString = `M${element.x},${element.y}`
      } else {
        pathString += ` L${element.x},${element.y}`
      }

    });
    console.log(pathString)
    this.pointsArray = []
    this.clickedPoints.forEach(point => {
      point.remove()
    });

    var rect9 = this.paper
      .path(pathString)
      .attr('fill', '#f00')
      .attr('stroke', '#f00')


    var ft9 = this.paper.freeTransform(rect9, { draw: 'bbox' })
    this.elements.push(ft9)
  }


  dragChange(checked: boolean) {
    this.draggable = checked;
    this.finishPath()
    // createHandlers();
  }

  rotateShape(rotatble) {
    if (rotatble) {
      this.elements.forEach(element => {
        element.setOpts({ scale: false });
      });
    }
    else {
      this.elements.forEach(element => {
        element.setOpts({ scale: true });
      });
    }


  }

  keepRatio(rotatble) {
    if (rotatble) {
      this.elements.forEach(element => {
        element.setOpts({ keepRatio: true });
      });
    }
    else {
      this.elements.forEach(element => {
        element.setOpts({ keepRatio: false });
      });
    }


  }

  async getImage(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  createImage(result) {

    var svgXML = (new window.DOMParser()).parseFromString(result, "text/xml")
    console.log(svgXML.querySelector('svg').querySelectorAll('*'))

    // var gElement = document.createElement('g')

    var children = [...<any>svgXML.querySelector('svg').children]

    // console.log(gElement)
    // this.img = await this.getImage(svgURL);
    // let w = this.img.width;
    // let h = this.img.height;

    // print
    // console.log({ w, h });
    // console.log(this.img.width)

    children.forEach((child) => { var attObj = {}; this.createChild(child, attObj) }
    )

    if (svgXML.querySelector('svg').getAttribute('viewBox')) {
      var viewBox = svgXML.querySelector('svg').getAttribute('viewBox').split(' ')
      // this.paper.setViewBox(...viewBox)
      this.paper.setViewBox(0, 0, 800, 600)
    }
    // var rect = this.paper.image(result, 10, 10, 200, 200);

    // var ft = this.paper.freeTransform(rect, { draw: 'bbox' });
    // this.elements.push(ft)
  }

  createChild(child, attObj) {
    for (let i = 0; i < child.attributes.length; i++) {
      attObj[child.attributes[i].nodeName] = child.attributes[i].nodeValue;
    }

    if (child.nodeName == 'g') {
      [...<any>child.children].forEach((child) => { this.createChild(child, attObj) }
      )
    }
    // attObj.fill = 'grey'

    switch (child.nodeName) {
      case 'path':
        var raphaelPaper = this.paper
          .path(child.getAttribute('d'))
          .attr(attObj)
        for (var key in attObj) {
          raphaelPaper.node.setAttribute(key, attObj[key]);
        }

        var ft = this.paper.freeTransform(raphaelPaper, { draw: 'bbox' })
        this.elements.push(ft)


        break;
      case 'square2':
        var rect4 = this.paper
          .rect(200, 200, 200, 200)
          .attr('fill', '#00f');
        break;
      case 'circle':
        var raphaelPaper = this.paper
          .circle(child.getAttribute('cx'), child.getAttribute('cy'), child.getAttribute('r'))
          .attr(attObj)

        var ft = this.paper.freeTransform(raphaelPaper, {})
        this.elements.push(ft)
        break;

        break;
      case 'custom':

        break;
    }
    console.log(attObj)



  }

  imageRead(element) {
    this.file = element.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsText(this.file);
      reader.onload = (evt) => { this.createImage(evt.target.result) }
      reader.onerror = function (evt) {
        console.log("error reading file");
      }
    }
  }


  createSVGPoint(x: number, y: number) {
    var svgPoint = this.paper.canvas.createSVGPoint()
    svgPoint.x = x
    svgPoint.y = y
    return svgPoint
  }

  pathIncrement(coords, testPath, oldPathObj) {
    var pathData = testPath.getPathData()
    for (let point = 0; point < pathData.length; point++) {
      switch (pathData[point].type) {
        case 'L':
        case 'M':
          pathData[point].values[0] = oldPathObj[point].values[0] + coords[0]
          pathData[point].values[1] = oldPathObj[point].values[1] + coords[1]
          // console.log(pathData[point].values)
          break;
      }
    }

    testPath.setPathData(pathData)
  }
  populateShapes() {
    var initialTime = new Date().getTime()
    var svg = this.paper.canvas
    var containerPathBB = this.containerPath.getBBox()
    var testPathD = 'M0,10 L30,0 L0,30 L-50,30 Z'
    var testPath = this.paper.path(testPathD).attr({ 'fill': 'red', 'stroke-width': '0' }).node
    var testPathDObj = testPath.getPathData()
    var testPathL = testPath.getTotalLength()
    var populatedElements = []
    var populatedElementsPaths = []
    var a = 1

    containerPathBB.height = 100
    containerPathBB.width = 450
    for (let x_c = 0; x_c < containerPathBB.width; x_c++) {
      console.log(1)
      for (let y_c = 0; y_c < containerPathBB.height; y_c++) {
        this.pathIncrement([x_c, y_c], testPath, testPathDObj)
        /*
                var isPointInFill = false
                populatedElements.forEach(element => {
                  if (Intersection.intersect(element, ShapeInfo.path(testPath.getAttribute('d'))).status == 'Intersection'
                  ) { isPointInFill = true }
                })
                if (!isPointInFill) {
                  populatedElements.push(ShapeInfo.path(testPath.getAttribute('d')))
                  populatedElementsPaths.push(testPath.getAttribute('d'))
                  this.paper.path(testPath.getAttribute('d')).attr({ 'fill': 'blue', 'stroke-width': '0' })
                }
                */

        for (let t_l = 0; t_l <= testPathL; t_l++) {
          var testPathPoint = testPath.getPointAtLength(t_l)
          if (!this.containerPath.isPointInFill(testPathPoint)) { break }
          if (populatedElements.length > 0) {

            // if (populatedElements[populatedElements.length - 1].isPointInFill(testPathPoint)) { break }
            var isPointInFill = false
            // populatedElements.some(element => {
            //   if (element.isPointInFill(testPathPoint)) { isPointInFill = true; return }
            // });

            for (let element = populatedElements.length - 1; element >= 0; element--) {
              if (populatedElements[element].isPointInFill(testPathPoint)) { isPointInFill = true; break }
            }

            if (isPointInFill) { break }

            if (t_l == Math.floor(testPathL)) {
              populatedElements.push(
                this.paper.path(testPath.getAttribute('d')).attr({ 'fill': 'blue', 'stroke-width': '0' })
                  .node
              )
            }
            // this.paper
            //   .circle(x_c, y_c, 1)
            //   .attr('fill', 'blue');

          } else {
            if (t_l == Math.floor(testPathL)) {
              populatedElements.push(
                this.paper.path(testPath.getAttribute('d')).attr({ 'fill': 'blue', 'stroke-width': '0' })
                  .node
              )
            }

          }
        }

      }
    }
    console.log((new Date().getTime() - initialTime) / 1000)





  }




















}
