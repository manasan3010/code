export class ViewBox {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
  }
}

export class SidePanelDetail {
  facility: SidePanelData;
  otherStructure: SidePanelData;
  image: SidePanelData;

  constructor() {
    this.facility = new SidePanelData(true);
    this.otherStructure = new SidePanelData(false);
    this.image = new SidePanelData(false);
  }

}

export class SidePanelData {
  isSelected: boolean;
  height: number;

  constructor(isSelected: boolean) {
    this.isSelected = isSelected;
    this.height = 0;
  }
}
