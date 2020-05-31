import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertToSVGService {

  constructor() { }

  convert(result) {

    var svgXML = (new window.DOMParser()).parseFromString(result, "text/xml")
    // console.log(svgXML.querySelector('svg').querySelectorAll('*'))
    var path = []
    var children = [...<any>svgXML.querySelector('svg').querySelectorAll('*')]
    children.forEach((child) => { if (child.nodeName == 'path') { path.push(child.getAttribute('d')) } })

    return path

  }

}
