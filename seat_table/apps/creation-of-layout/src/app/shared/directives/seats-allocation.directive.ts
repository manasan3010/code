import {Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonService} from '../services/common.service';
import {MousePosition} from '../models/Venue';
import {SeatAllocationSelectionType, SeatingRowType, ShapeType} from '../models/utils';
import {Block, Facility, FormSeatsProperties, PathPoint, Seat, SeatsRow, SvgPoints} from '../models/Shape';
import {SeatService} from '../../seat-plan/shared/services/seat.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';
import {MatDialog} from '@angular/material';
import {SeatDeleteConfirmationModelComponent} from '../components/modals/seat-delete-confirmation-model/seat-delete-confirmation-model.component';
import {ToastrService} from 'ngx-toastr';

@Directive({
  selector: '[appSeatsAllocation]'
})
export class SeatsAllocationDirective implements OnInit, OnDestroy {
  @Input() facility: Facility;
  @Output() selectedSeatProperties = new EventEmitter<FormSeatsProperties>();
  @Output() updateComponentData = new EventEmitter<any>();
  private rowSpacing = 10;
  private currentPosition: MousePosition;
  private svgElement: HTMLElement;
  private mainGroup: HTMLElement;
  private initialCoordination: MousePosition;
  private blockShapeElement: SVGElement;
  private blocks: Block [] = [];
  private selectedBlockShapeSubscription: Subscription;
  private canDrawBlock = false;
  private isStartDrawBlock = false;
  private isSetPointForBlock = false;
  private selectionGroup: SVGGraphicsElement;
  private isBlockDragStart = false;
  private rotateAngle: number;
  private scaleValue = new MousePosition();
  private resizeTarget: SVGGraphicsElement;
  private isResizeBlock = false;
  private isRotateBlock = false;
  private selectedFacilityShape: SVGElement;
  private selectedBlockShape: ShapeType;
  private blockSubscription: Subscription;
  private selectedSeatRawTypeSubscription: Subscription;
  private seatRowType: SeatingRowType;
  private canDrawSeats = false;
  private drawSeats = false;
  private seatsRowGroupElement: SVGGraphicsElement;
  private multiRowSeatsTempStorage: SVGElement [] = [];
  private multiRowsTempObjects: SeatsRow[] = [];
  private selectedSeatsRow: HTMLElement;
  private multiSelectedSeatsRow: HTMLElement [] = [];
  private seatsRowSelectionGroup: SVGGraphicsElement;
  private multiSeatsRowSelectionGroup: SVGGraphicsElement;
  private canDragRow = false;
  private canRotateRow = false;
  private canChangeRowSeatCount = false;
  private seatProperties: FormSeatsProperties;
  private isControlKey = false;
  private isMultiShapeSelected = false;
  private isMultiRowsSelected = false;
  private canDragMultiSelectedRows = false;
  private canRotateMultiSelectedRows = false;
  private selectionShapeElement: SVGElement;
  private isDrawingSelectionShape = false;
  private isMultiRowSelection = false;
  private isBlockSelected = false;
  private selectionType: SeatAllocationSelectionType;
  private isMultiBlockSelection = false;
  private multiSelectedBlock = [];
  private multiBlockSelectionGroup: any;
  private isMultiBlocksSelected = false;
  private canDragMultiSelectedBlocks = false;
  private isMultiSeatSelection = false;
  private multiSelectedSeats = [];
  private isMultiSeatSelected = false;
  private canMoveSeats = false;
  private isAltKey = false;
  private seatingSelectionTypeSubscription: Subscription;
  private canSelect = false;

  @Input('seatsProperties') set setSeatProperties(value) {
    if (!_.isEqual(this.seatProperties, value)) {
      if (!!this.selectedSeatsRow && !!this.seatsRowSelectionGroup) {
        this.editSelectedRow(this.selectedSeatsRow, value);
      }
      if (this.isMultiRowsSelected) {
        this.multiSelectedSeatsRow.forEach(element => {
          this.editSelectedRow(element, value);
        });
      }
      if (this.isMultiSeatSelected) {
        this.multiSelectedSeats.forEach(seatEle => {
          if (!!this.blockShapeElement) {
            const blockData = this.getSelectedBlockData();
            blockData.seatsRow.forEach(seatRow => {
              seatRow.seats.forEach(seat => {
                if (seat.id === seatEle.children[0].id) {
                  seat.priceBand = value.priceBand;
                  seatEle.children[0].style.fill = seat.priceBand.color;
                }
              });
            });
            this.updateSelectedBlockData(blockData);
          }
        });
      }
      this.seatProperties = value;
    }
  }

  constructor(
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private seatService: SeatService,
    public toastR: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.svgElement = this.elementRef.nativeElement;
    this.mainGroup = (this.svgElement as any).getElementById('shapeGroup');
    this.selectedBlockShapeSubscription = this.seatService.selectedBlockShape$.subscribe(shape => {
      if (!!shape) {
        this.selectedBlockShape = shape;
        this.canDrawBlock = true;

        this.canSelect = false;
        this.canDrawSeats = false;
        this.seatRowType = undefined;
      }
    });
    this.seatingSelectionTypeSubscription = this.seatService.seatingSelectionType$.subscribe(type => {
      if (!!type) {
        this.selectionType = type;
        this.canSelect = true;

        this.canDrawBlock = false;
        this.canDrawSeats = false;
        this.selectedBlockShape = undefined;
        this.seatRowType = undefined;
        this.isBlockSelected = this.selectionType === SeatAllocationSelectionType.CAN_SELECT_BLOCK;
        setTimeout(() => {
          this.removeSelection();
        }, 0);
      }
    });
    this.blockSubscription = this.seatService.getBlocks.subscribe(blocks => {
      this.blocks = blocks;
      if (this.blocks.length > 0) {
        const existingBlockElement = Array.from(this.mainGroup.querySelectorAll('.block'));
        this.blocks.forEach(block => {
          const blockIndex = existingBlockElement.findIndex(element => block.id === element.id);
          if (blockIndex === -1) {
            setTimeout(() => {
              CommonService.creatExistingBlockShape(this.mainGroup as any, block);
            }, 0);
          }
        });
      }
    });
    this.selectedSeatRawTypeSubscription = this.seatService.selectedSeatingRowType$.subscribe(type => {
      this.seatRowType = type;
      if (!!this.seatRowType) {
        this.canDrawSeats = true;
        this.canDrawBlock = false;
        this.canSelect = false;
        this.selectionType = undefined;
        this.selectedBlockShape = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.selectedBlockShapeSubscription.unsubscribe();
    this.blockSubscription.unsubscribe();
    this.seatingSelectionTypeSubscription.unsubscribe();
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(event) {
    this.currentPosition = CommonService.getMousePosition(this.mainGroup as any, event);
    if (this.isSetPointForBlock && !this.canDrawSeats) {    // set Path Points
      this.initialCoordination = this.currentPosition;
      if (event.target.classList.contains('PathStarter')) {
        this.customShapeDrawEnd(this.blockShapeElement);
      } else {
        this.drawCustomShape(this.blockShapeElement, new PathPoint('L', this.currentPosition.x, this.currentPosition.y));
      }
    } else if (this.selectedBlockShape && this.canDrawBlock && event.target.classList.contains('shapes') && !this.canDrawSeats) {
      this.selectedFacilityShape = event.target;
      this.initialCoordination = this.currentPosition;
      const createdShape = CommonService.creatBlockShape(this.mainGroup as any, CommonService.generateUniqId);
      this.blockShapeElement = createdShape.querySelector('.block');
      this.blocks.push(new Block(this.blockShapeElement.id, this.facility.id, this.selectedFacilityShape.id, this.selectedBlockShape, []));
      this.isStartDrawBlock = true;
      if (this.selectedBlockShape === ShapeType.PATH) {
        this.isStartDrawBlock = false;
        this.isSetPointForBlock = true;
        this.drawCustomShape(this.blockShapeElement, new PathPoint('M', this.currentPosition.x, this.currentPosition.y));
      }
    } else if (event.target.classList.contains('block') && !this.canDrawSeats && !this.isAltKey && this.canSelect) {
      this.blockShapeElement = event.target;
      if (this.selectionType === SeatAllocationSelectionType.CAN_SELECT_ROWS ||
        this.selectionType === SeatAllocationSelectionType.CAN_SELECT_SEATS) {
        this.blockShapeElement = event.target;
        this.initialCoordination = this.currentPosition;
        this.selectionShapeElement = CommonService.createPathEle(this.mainGroup as any, 'multiSelectionShape');
        this.selectionShapeElement.style.fill = '#001ee6';
        this.selectionShapeElement.style.stroke = '#0007cc';
        this.selectionShapeElement.style.opacity = '0.2';
        this.isDrawingSelectionShape = true;
        this.isMultiRowSelection = this.selectionType === SeatAllocationSelectionType.CAN_SELECT_ROWS;
        this.isMultiSeatSelection = this.selectionType === SeatAllocationSelectionType.CAN_SELECT_SEATS;
      } else if (this.selectionType === SeatAllocationSelectionType.CAN_SELECT_BLOCK) {
        this.selectBlocks();
      }
    }
    if (event.target === this.svgElement) {
      this.removeSelection();
    } else if (event.target.classList.contains('shapes') && !this.isStartDrawBlock && !this.isAltKey && this.canSelect) {
      this.removeSelection();
      if (this.selectionType === SeatAllocationSelectionType.CAN_SELECT_BLOCK) {
        this.initialCoordination = this.currentPosition;
        this.selectionShapeElement = CommonService.createPathEle(this.mainGroup as any, 'multiSelectionShape');
        this.selectionShapeElement.style.fill = '#001ee6';
        this.selectionShapeElement.style.stroke = '#0007cc';
        this.selectionShapeElement.style.opacity = '0.2';
        this.isDrawingSelectionShape = true;
        this.isMultiBlockSelection = this.selectionType === SeatAllocationSelectionType.CAN_SELECT_BLOCK;
      }
    } else if ((event.target.classList.contains('seats') ||
      event.target.classList.contains('seatID')) &&
      (this.selectionType !== SeatAllocationSelectionType.CAN_SELECT_BLOCK) &&
      !this.canDrawSeats && !this.isMultiSeatSelected && this.canSelect) {
      const selectedSeat = event.target;
      if (this.isControlKey) { // multi select rows ********************************************#
        if (this.IS_POINT_IN_SELECTED_BLOCK) {
          this.multiShapeSelect(selectedSeat.parentElement.parentElement.parentElement);
        }
      } else {
        this.selectedSeatsRow = selectedSeat.parentElement.parentElement.parentElement;
        this.singleSelectSeatsRow();
      }
    }
    if (this.isBlockSelected && this.IS_POINT_IN_SELECTED_BLOCK &&
      !this.isSetPointForBlock && event.target.classList.contains('block') && !this.canDrawSeats && this.canSelect) {
      this.initialCoordination = this.currentPosition;
      this.isBlockDragStart = true;
    }
    if (this.blockShapeElement && event.target.classList.contains('selector')
      && this.selectedBlockShape === undefined && !this.canDrawSeats && !this.isMultiRowsSelected && this.canSelect) {
      this.initialCoordination = this.currentPosition;
      this.resizeTarget = event.target;
      this.isResizeBlock = true;
    }
    if (this.blockShapeElement && event.target.classList.contains('rotate')
      && this.selectedBlockShape === undefined && !this.canDrawSeats && !this.isMultiRowsSelected && this.canSelect) {
      this.initialCoordination = this.currentPosition;
      this.isRotateBlock = true;
    }
    if (this.canDrawSeats && event.target.classList.contains('block')) {
      this.initialCoordination = this.currentPosition;
      this.blockShapeElement = event.target;
      this.drawSeats = true;
    }
    if (event.target.classList.contains('seats') && !this.canDrawSeats
      && this.isMultiSeatSelected && this.IS_POINT_INSIDE_SELECTED_SEAT(event.target)) {
      this.initialCoordination = this.currentPosition;
      this.canMoveSeats = true;
    }
    if (!!this.seatsRowSelectionGroup && event.target.classList.contains('canRotateRow') && !this.canDrawSeats && !this.isMultiRowsSelected) {
      this.initialCoordination = this.currentPosition;
      this.canRotateRow = true;
    }
    if (!!this.seatsRowSelectionGroup && event.target.classList.contains('can-seat-count-change') && !this.canDrawSeats) {
      this.initialCoordination = this.currentPosition;
      this.resizeTarget = event.target;
      this.canChangeRowSeatCount = true;
    } else if (this.IS_POINT_IN_SELECTED_SEAT_ROW && !this.canDrawSeats && !this.isMultiRowsSelected) {
      this.initialCoordination = this.currentPosition;
      this.canDragRow = true;
    }
    if (event.target.classList.contains('canMove')) {
      if (this.isMultiRowsSelected) {
        this.canDragMultiSelectedRows = true;
      } else if (this.isMultiBlocksSelected) {
        this.canDragMultiSelectedBlocks = true;
      }
      this.initialCoordination = this.currentPosition;
    }
    if (this.isMultiRowsSelected && event.target.classList.contains('rotate')) {
      this.initialCoordination = this.currentPosition;
      this.canRotateMultiSelectedRows = true;
    }
  }

  @HostListener('mousemove', ['$event'])
  mouseMove(event) {
    this.currentPosition = CommonService.getMousePosition(this.mainGroup as any, event);
    if (this.isSetPointForBlock) {
      CommonService.previewLine(this.initialCoordination, this.currentPosition, this.svgElement);
    }
    if (this.isStartDrawBlock && this.blockShapeElement) {
      this.startDrawBlock();
    }
    if (this.isBlockDragStart) {
      this.startDrag(this.blockShapeElement, this.currentPosition);
    } else if (this.canDragRow) {
      this.startDrag(this.selectedSeatsRow as any, this.currentPosition);
    } else if (this.canDragMultiSelectedRows) {
      this.startDrag(this.mainGroup.querySelector('.multi-selection-group') as any, this.currentPosition);
    } else if (this.canDragMultiSelectedBlocks) {
      this.startDrag(this.mainGroup.querySelector('.multi-selection-group') as any, this.currentPosition);
    }
    if (this.isResizeBlock) {
      this.startScaling(this.blockShapeElement, this.currentPosition);
    }
    if (this.isRotateBlock) {
      this.startRotate(this.blockShapeElement, this.currentPosition);
    } else if (this.canRotateRow) {
      this.startRotate(this.selectedSeatsRow as any, this.currentPosition);
    } else if (this.canRotateMultiSelectedRows) {
      this.startRotate(this.mainGroup.querySelector('.multi-selection-group') as any, this.currentPosition);
    }
    if (this.canChangeRowSeatCount) {
      this.singleRowSeatsCountChange(this.selectedSeatsRow);
    }
    if (this.drawSeats && this.canDrawSeats) {
      if (this.seatRowType === SeatingRowType.SINGLE_ROW_SEATS) {
        this.startDrawSingleRowSeats();
      } else if (this.seatRowType === SeatingRowType.MULTI_ROW_SEATS) {
        this.startDrawMultiRowSeats();
      }
    }
    if (this.isDrawingSelectionShape) {
      this.createMultiSelectionShape();
    }
    if (this.canMoveSeats && this.multiSelectedSeats.length !== 0) {
      this.moveMultiSelectedSeats();
    }
  }

  @HostListener('mouseup', ['$event'])
  mouseUp(event) {
    this.currentPosition = CommonService.getMousePosition(this.mainGroup as any, event);
    if (this.isStartDrawBlock) {
      this.isStartDrawBlock = false;
      const eleDString = this.blockShapeElement.getAttribute('d');
      const blockData = this.getSelectedBlockData();
      if (!this.IS_BLOCK_INSIDE_SHAPE(blockData) || this.IS_BLOCKS_OVERLAPPING(blockData) || this.IS_BLOCK__OVERLAPPING_NON_SEATING_AREA(blockData)) {
        this.removeSelectedBlock();
      }
      if (!!eleDString && (eleDString.length > 2)) {
      } else {
        this.removeSelectedBlock();
      }
    }
    if (this.isBlockDragStart) {
      const blockData = this.getSelectedBlockData();
      this.endDrag(this.blockShapeElement, this.currentPosition, blockData);
      this.isBlockDragStart = false;
    }
    if (this.canDragRow) {
      this.canDragRow = false;
      if (parseFloat(this.selectedSeatsRow.style.opacity) >= 1) {
        const mouseMoved = new MousePosition();
        mouseMoved.x = this.currentPosition.x - this.initialCoordination.x;
        mouseMoved.y = this.currentPosition.y - this.initialCoordination.y;
        this.seatsRowDragEnd(this.selectedSeatsRow as any, mouseMoved);
      } else {
        this.selectedSeatsRow.removeAttribute('transform');
        this.selectedSeatsRow.style.opacity = '1';
      }
      // if (this.IS_SELECTED_BLOCK_ROWS_OVERLAPPING()) {
      //   alert('is intersect');
      // } else {
      //   alert('is not');
      // }
    }
    if (this.canDragMultiSelectedRows) {
      this.canDragMultiSelectedRows = false;
      const selectionGrope: any = this.mainGroup.querySelector('.multi-selection-group');
      if (parseFloat(selectionGrope.style.opacity) >= 1) {
        selectionGrope.removeAttribute('transform');
        const mouseMoved = new MousePosition();
        mouseMoved.x = this.currentPosition.x - this.initialCoordination.x;
        mouseMoved.y = this.currentPosition.y - this.initialCoordination.y;
        this.multiSelectedSeatsRow.forEach(element => {
          this.seatsRowDragEnd(element as any, mouseMoved);
        });
      } else {
        selectionGrope.removeAttribute('transform');
        selectionGrope.style.opacity = '1';
      }
      this.reselectSelectedMultiRow();
    }
    if (this.canDragMultiSelectedBlocks) {
      this.canDragMultiSelectedBlocks = false;
      const selectionGrope: any = this.mainGroup.querySelector('.multi-selection-group');
      if (parseFloat(selectionGrope.style.opacity) >= 1) {
        selectionGrope.removeAttribute('transform');
        const mouseMoved = new MousePosition();
        mouseMoved.x = this.currentPosition.x - this.initialCoordination.x;
        mouseMoved.y = this.currentPosition.y - this.initialCoordination.y;
        this.multiSelectedBlock.forEach(element => {
          const blockData = this.blocks.find(block => block.id === element.children[0].id);
          if (!!blockData) {
            this.endDrag(element as any, mouseMoved, blockData);
          }
        });
      } else {
        selectionGrope.removeAttribute('transform');
        selectionGrope.style.opacity = '1';
      }
      this.reselectMultiBlocks();
    }
    if (this.canRotateMultiSelectedRows) {
      this.canRotateMultiSelectedRows = false;
      const selectionGrope: any = this.mainGroup.querySelector('.multi-selection-group');
      if (parseFloat(selectionGrope.style.opacity) >= 1) {
        selectionGrope.removeAttribute('transform');
        const centerPoint = CommonService.getCenterPosition(selectionGrope as any);
        this.multiSelectedSeatsRow.forEach(element => {
          this.seatsRowRotateEnd(element as any, this.rotateAngle, centerPoint);
        });
      } else {
        selectionGrope.removeAttribute('transform');
        selectionGrope.style.opacity = '1';
      }
      this.reselectSelectedMultiRow();
    }
    if (this.isResizeBlock) {
      this.endScaling(this.blockShapeElement);
      this.isResizeBlock = false;
    }
    if (this.isRotateBlock) {
      this.endRotate(this.blockShapeElement);
      this.isRotateBlock = false;
    }
    if (this.canDrawSeats && this.drawSeats) {
      this.drawSeats = false;
      const block = this.getSelectedBlockData();
      block.seatsRow.push(...this.multiRowsTempObjects);
      this.updateSelectedBlockData(block);
      if (!this.IS_POINT_IN_SELECTED_BLOCK) {
        if (this.seatRowType === SeatingRowType.SINGLE_ROW_SEATS) {
          const rowIndex = block.seatsRow.findIndex(row => row.id === this.seatsRowGroupElement.id);
          block.seatsRow.splice(rowIndex, 1);
          this.seatsRowGroupElement.remove();
        } else if (this.seatRowType === SeatingRowType.MULTI_ROW_SEATS) {
          this.multiRowSeatsTempStorage.forEach(element => {
            const rowIndex = block.seatsRow.findIndex(row => row.id === element.id);
            block.seatsRow.splice(rowIndex, 1);
            element.remove();
          });
        }
      }
      this.blockShapeElement = undefined;
      this.seatsRowGroupElement = undefined;
      this.multiRowsTempObjects = [];
      this.multiRowSeatsTempStorage = [];

    }
    if (this.canRotateRow) {
      this.canRotateRow = false;
      if (parseFloat(this.selectedSeatsRow.style.opacity) >= 1) {
        const centerPoint = CommonService.getCenterPosition(this.selectedSeatsRow as any);
        this.seatsRowRotateEnd(this.selectedSeatsRow as any, this.rotateAngle, centerPoint);
      } else {
        this.selectedSeatsRow.removeAttribute('transform');
        this.selectedSeatsRow.style.opacity = '1';
      }
    }
    if (this.canMoveSeats) {
      const x = (this.currentPosition.x - this.initialCoordination.x);
      const y = (this.currentPosition.y - this.initialCoordination.y);
      if (x !== 0 && y !== 0) {
        let canDrag = true;
        for (const ele of this.multiSelectedSeats) {
          if (ele.style.opacity !== '1') {
            canDrag = false;
            break;
          }
        }
        if (canDrag) {
          this.endMoveMultiSelectedSeats();
        } else {
          this.multiSelectedSeats.forEach(element => {
            element.removeAttribute('transform');
            element.style.opacity = '1';
          });
        }
      }
      this.canMoveSeats = false;
    }
    if (this.canChangeRowSeatCount) {
      this.canChangeRowSeatCount = false;
      this.singleSelectSeatsRow();
    }
    if (this.isDrawingSelectionShape) {
      this.isDrawingSelectionShape = false;
      if (this.isMultiRowSelection) {
        this.removeSelection();
        this.shapeDrawSelectionEnd();
        this.isMultiRowSelection = false;
      } else if (this.isMultiBlockSelection) {
        this.removeSelection();
        this.selectMultiBlocks();
        this.isMultiBlockSelection = false;
      } else if (this.isMultiSeatSelection) {
        this.removeSelection();
        this.selectMultiSeats();
        this.isMultiSeatSelection = false;
      }
    }
    this.updateComponentData.emit({
      selectedBlock: this.getSelectedBlockData(),
      selectedRow: this.selectedSeatsRow,
      selectedRows: this.multiSelectedSeatsRow,
      selectedSeats: this.multiSelectedSeats
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.isControlKey = event.ctrlKey;
    this.isAltKey = event.altKey;
    if (event.key === 'Delete') {
      if (this.isMultiSeatSelected && this.multiSelectedSeats.length > 0) {
        const blockData = this.getSelectedBlockData();
        const selectedFullRows = this.ALL_ROWS_ARE_SELECTED_IN_MULTI_SEAT_SELECTION();
        if (!!selectedFullRows) {
          selectedFullRows.forEach(row => {
            const rowElement = this.blockShapeElement.parentElement.querySelector(`#${row.id}`);
            rowElement.remove();
            const index = blockData.seatsRow.findIndex(x => x.id === row.id);
            if (index > -1) {
              blockData.seatsRow.splice(index, 1);
            }
          });
          this.deselectMultiSelectedSeats();
          this.toastR.success('multi selected seats deleted', 'Success!');
          this.updateSelectedBlockData(blockData);
        } else if (this.IS_DONT_NEED_CONFIRM_MODEL()) {
          this.multiSelectedSeats.forEach(cirEle => {
            blockData.seatsRow.forEach((row, index, object) => {
              const circleIndex = row.seats.findIndex(seat => seat.id === cirEle.children[0].id);
              if (circleIndex > -1) {
                row.seats.splice(circleIndex, 1);
              }
              if (row.seats.length === 0) {
                this.mainGroup.querySelector(`#${row.id}`).remove();
                object.splice(index, 1);
              }
            });
            cirEle.remove();
          });
          this.removeSeatSpaceBTSeats(blockData);
          this.multiSelectedSeats = [];
        } else {
          const dialogRef = this.dialog.open(SeatDeleteConfirmationModelComponent, {
            panelClass: 'custom-dialog-container',
            width: '400px',
          });
          dialogRef.afterClosed().subscribe(result => {
            if (!!result) {
              this.multiSelectedSeats.forEach(cirEle => {
                blockData.seatsRow.forEach((row, index, object) => {
                  const circleIndex = row.seats.findIndex(seat => seat.id === cirEle.children[0].id);
                  if (circleIndex > -1) {
                    row.seats.splice(circleIndex, 1);
                  }
                  if (row.seats.length === 0) {
                    this.mainGroup.querySelector(`#${row.id}`).remove();
                    object.splice(index, 1);
                  }
                });
                cirEle.remove();
              });
              this.multiSelectedSeats = [];
              if (result.canKeepSpace) {
                this.splitRows(blockData, result.canKeepSeatLabelOrder);
              } else {
                this.removeSeatSpaceBTSeats(blockData, result.canKeepSeatLabelOrder);
              }
              this.toastR.success('multi selected seats deleted', 'Success!');
              this.updateSelectedBlockData(blockData);
            }
          });
        }
      } else if (this.isMultiBlocksSelected && this.multiSelectedBlock.length > 0 && !!this.multiBlockSelectionGroup) {
        this.multiSelectedBlock.forEach(element => {
          const index = this.blocks.findIndex(block => block.id === (element as HTMLElement).children[0].id);
          if (index > -1) {
            this.blocks.splice(index, 1);
          }
          element.remove();
        });
        this.multiSelectedBlock = [];
        this.multiBlockSelectionGroup.remove();
        this.multiBlockSelectionGroup = undefined;
        this.toastR.success('blocks deleted', 'Deleted!');
        this.seatService.updateBlocks(this.blocks);
      } else if (!!this.isMultiRowsSelected && this.multiSelectedSeatsRow.length > 0 && !!this.multiSeatsRowSelectionGroup) {
        const block = this.getSelectedBlockData();
        this.multiSelectedSeatsRow.forEach(rowEle => {
          const index = block.seatsRow.findIndex(row => row.id === rowEle.id);
          block.seatsRow.splice(index, 1);
          rowEle.remove();
        });
        this.multiSeatsRowSelectionGroup.remove();
        this.multiSeatsRowSelectionGroup = undefined;
        this.multiSelectedSeatsRow = [];
        this.isMultiRowsSelected = false;
        this.updateSelectedBlockData(block);
      } else if (!!this.seatsRowSelectionGroup) {
        const block = this.getSelectedBlockData();
        this.selectedSeatsRow.remove();
        const index = block.seatsRow.findIndex(row => row.id === this.selectedSeatsRow.id);
        block.seatsRow.splice(index, 1);
        this.selectedSeatsRow = undefined;
        this.seatsRowSelectionGroup.remove();
        this.seatsRowSelectionGroup = undefined;
        this.toastR.success('Rows deleted', 'Deleted!');
        this.updateSelectedBlockData(block);
      } else if (!!this.selectionGroup && !this.isMultiRowsSelected) {
        this.blockShapeElement.parentElement.remove();
        const index = this.blocks.findIndex(block => block.id === this.blockShapeElement.id);
        this.blocks.splice(index, 1);
        this.seatService.updateBlocks(this.blocks);
      }
      this.updateComponentData.emit({
        selectedBlock: this.getSelectedBlockData(),
        selectedRow: this.selectedSeatsRow,
        selectedRows: this.multiSelectedSeatsRow,
        selectedSeats: this.multiSelectedSeats
      });
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) {
    this.isControlKey = event.ctrlKey;
    this.isAltKey = event.altKey;
    this.isMultiShapeSelected = false;
  }

  private moveMultiSelectedSeats() {
    const x = (this.currentPosition.x - this.initialCoordination.x);
    const y = (this.currentPosition.y - this.initialCoordination.y);
    this.multiSelectedSeats.forEach(ele => {
      if (this.IS_SEAT_INSIDE_BLOCK_ON_MOVE({x, y}, ele.children[0])) {
        ele.style.opacity = '1';
      } else {
        ele.style.opacity = '.5';
      }
      ele.setAttribute('transform', `translate(${x}, ${y})`);
    });
  }

  private endMoveMultiSelectedSeats() {
    const x = (this.currentPosition.x - this.initialCoordination.x);
    const y = (this.currentPosition.y - this.initialCoordination.y);
    const parentGroupEle = this.blockShapeElement.parentElement;
    const tembRowSeat = [];
    const blockData = this.getSelectedBlockData();
    this.multiSelectedSeats.forEach(ele => {
      if (ele.style.opacity === '1') {
        blockData.seatsRow.forEach(row => {
          const index = row.seats.findIndex(obj => obj.id === ele.children[0].id);
          if (index !== -1) {
            row.seats[index].centerPoint.x += x;
            row.seats[index].centerPoint.y += y;
            row.seats[index].sideStartPoint.y += y;
            row.seats[index].sideStartPoint.y += y;
            row.seats[index].sideEndPoint.y += y;
            row.seats[index].sideEndPoint.y += y;
            const rowExist = tembRowSeat.findIndex(obj => obj.rowId === row.id);
            if (rowExist !== -1) {
              tembRowSeat[rowExist].seatObj.push(_.cloneDeep(row.seats[index]));
            } else {
              tembRowSeat.push({
                rowId: row.id,
                seatObj: [_.cloneDeep(row.seats[index])]
              });
            }
            row.seats.splice(index, 1);
          }
        });
      } else {
        ele.style.opacity = '1';
      }
      ele.remove();
    });
    tembRowSeat.forEach(rowObj => {
      const row = blockData.seatsRow.find(obj => obj.id === rowObj.rowId);
      const initialPoint = rowObj.seatObj[0].centerPoint;
      const lastPoint = rowObj.seatObj[rowObj.seatObj.length - 1].centerPoint;
      let newRow = new SeatsRow(
        CommonService.generateUniqId,
        row.name,
        [],
        rowObj.seatObj,
        row.seatsRadius,
        row.curve,
        row.seatSpacing);
      newRow.linePathPoint = CommonService.createLinePathPoint(initialPoint, lastPoint);
      const seatsRowGroupElement = CommonService.createGroupElement(parentGroupEle as any, newRow.id, 'seatsRow');
      const rowPath = CommonService.createPathEle(seatsRowGroupElement, CommonService.generateUniqId, 'rowLinePath');
      rowPath.setAttribute('d', CommonService.buildPathString(newRow.linePathPoint));
      rowPath.style.fill = 'none';
      newRow = CommonService.reAllocateSeatsInARow(seatsRowGroupElement, rowPath as any, newRow, this.seatProperties.priceBand);
      const seatsGroup = CommonService.createGroupElement(seatsRowGroupElement, `seats-group-${newRow.id}`, 'seats-group');
      CommonService.createSeatsForSeating(seatsGroup, newRow.seats);
      CommonService.createLabelForRowAndSeats(seatsGroup, newRow);
      blockData.seatsRow.push(newRow);
    });
    const rowsWithoutSeats = blockData.seatsRow.filter(row => row.seats.length === 0);
    rowsWithoutSeats.forEach(obj => {
      const index = blockData.seatsRow.findIndex(obj2 => obj2.id === obj.id);
      const element = parentGroupEle.querySelector(`#${obj.id}`);
      if (!!element) {
        element.remove();
      }
      blockData.seatsRow.splice(index, 1);
    });
    this.deselectMultiSelectedSeats();
    this.splitRows(blockData);
    this.updateSelectedBlockData(blockData);
  }

  private multiShapeSelect(currentSelectedShape: any) {
    if ((currentSelectedShape as HTMLElement).classList.contains('seatsRow')) {
      if (this.selectionGroup) {
        this.selectionGroup.remove();
        this.selectionGroup = undefined;
      }
      this.isMultiShapeSelected = true;
      const shapeExist = this.multiSelectedSeatsRow.findIndex(x => x === currentSelectedShape);
      if (shapeExist === -1) {
        if (!!this.selectedSeatsRow) {
          this.removeSelection();
          this.multiSelectedSeatsRow.push(...[this.selectedSeatsRow, currentSelectedShape]);
          this.selectedSeatsRow = undefined;
        } else {
          this.multiSelectedSeatsRow.push(currentSelectedShape);
        }
      } else {
        this.blockShapeElement.parentElement.appendChild(this.multiSelectedSeatsRow[shapeExist]);
        this.multiSelectedSeatsRow.splice(shapeExist, 1);
      }
      const selectionGroup = !!this.mainGroup.querySelector('.multi-selection-group') ?
        this.mainGroup.querySelector('.multi-selection-group') :
        CommonService.createGroupElement(this.mainGroup as any, null, 'multi-selection-group');
      this.multiSelectedSeatsRow.forEach(row => {
        selectionGroup.appendChild(row);
      });
      if (!!this.multiSeatsRowSelectionGroup) {
        this.multiSeatsRowSelectionGroup.remove();
      }
      this.isMultiRowsSelected = true;
      this.multiSeatsRowSelectionGroup = CommonService.singleSelectPathShape(this.mainGroup, selectionGroup as any, true);
      if (!!this.multiSeatsRowSelectionGroup.querySelector('.canMove')) {
        (this.multiSeatsRowSelectionGroup.querySelector('.canMove') as any).style.fill = 'transparent';
      }
    }
  }

  private createMultiSelectionShape() {
    if (!!this.selectionShapeElement) {
      const selectionShapePathPoint = CommonService.createRectanglePathPoint(this.initialCoordination, this.currentPosition);
      this.selectionShapeElement.setAttribute('d', CommonService.buildPathString(selectionShapePathPoint));
    }
  }

  private selectMultiBlocks() {
    this.blocks.forEach(block => {
      const element = document.getElementById(block.id);
      if (!!element) {
        const isFill = CommonService.checkPointsInFill(block.pathPoint, this.selectionShapeElement).length > 0;
        const isIntersect = CommonService.findInterSectionBetweenTwoShape(element as any, this.selectionShapeElement as any).length > 0;
        if (isFill || isIntersect) {
          this.multiSelectedBlock.push(element.parentElement);
        }
      }
    });
    const selectionGroup = !!this.mainGroup.querySelector('.multi-selection-group') ?
      this.mainGroup.querySelector('.multi-selection-group') :
      CommonService.createGroupElement(this.mainGroup as any, null, 'multi-selection-group');
    this.multiSelectedBlock.forEach(row => {
      selectionGroup.appendChild(row);
    });
    if (!!this.multiBlockSelectionGroup) {
      this.multiBlockSelectionGroup.remove();
    }
    this.multiBlockSelectionGroup = CommonService.singleSelectPathShape(this.mainGroup, selectionGroup as any, true);
    if (!!this.multiBlockSelectionGroup.querySelector('.canMove')) {
      (this.multiBlockSelectionGroup.querySelector('.canMove') as any).style.fill = 'transparent';
    }
    this.isMultiBlocksSelected = true;
    this.selectionShapeElement.remove();
    this.selectionShapeElement = undefined;
  }

  private selectMultiSeats() {
    const blockData = this.getSelectedBlockData();
    if (!!blockData) {
      blockData.seatsRow.forEach(seatsRow => {
        seatsRow.seats.forEach(seats => {
          const seatElement = document.getElementById(`${seats.id}`);
          const fillPoint = CommonService.createSVGPoint({x: seats.centerPoint.x, y: seats.centerPoint.y});
          const isPointFill = (this.selectionShapeElement as SVGGeometryElement).isPointInFill(fillPoint);
          if (isPointFill) {
            this.multiSelectedSeats.push(seatElement.parentElement);
            seatElement.style.stroke = 'black';
          }
        });
      });
      this.selectionShapeElement.remove();
      this.selectionShapeElement = undefined;
      if (this.multiSelectedSeats.length !== 0) {
        this.isMultiSeatSelected = true;
      }
    }
  }

  private shapeDrawSelectionEnd() {
    const blockData = this.getSelectedBlockData();
    if (!!blockData) {
      blockData.seatsRow.forEach(seatsRow => {
        const element = document.getElementById(seatsRow.id);
        const isFill = CommonService.checkPointsInFill(seatsRow.linePathPoint, this.selectionShapeElement).length > 0;
        const isIntersect = CommonService.findInterSectionBetweenTwoShape(element.children[0] as any, this.selectionShapeElement as any).length > 0;
        if (isIntersect || isFill) {
          this.multiSelectedSeatsRow.push(element);
        }

      });
    }
    const selectionGroup = !!this.mainGroup.querySelector('.multi-selection-group') ?
      this.mainGroup.querySelector('.multi-selection-group') :
      CommonService.createGroupElement(this.mainGroup as any, null, 'multi-selection-group');
    this.multiSelectedSeatsRow.forEach(row => {
      selectionGroup.appendChild(row);
    });
    if (!!this.multiSeatsRowSelectionGroup) {
      this.multiSeatsRowSelectionGroup.remove();
    }
    this.isMultiRowsSelected = true;
    this.multiSeatsRowSelectionGroup = CommonService.singleSelectPathShape(this.mainGroup, selectionGroup as any, true);
    if (!!this.multiSeatsRowSelectionGroup.querySelector('.canMove')) {
      (this.multiSeatsRowSelectionGroup.querySelector('.canMove') as any).style.fill = 'transparent';
    }
    this.selectionShapeElement.remove();
    this.selectionShapeElement = undefined;
    this.isMultiRowsSelected = true;
  }

  private startDrawBlock() {
    return this.selectedBlockShape === ShapeType.RECTANGLE ?
      this.drawRectangle(this.blockShapeElement, this.initialCoordination, this.currentPosition) :
      this.selectedBlockShape === ShapeType.SQUARE ? this.drawSquare(this.blockShapeElement, this.initialCoordination, this.currentPosition) :
        this.selectedBlockShape === ShapeType.CIRCLE ? this.drawCircle(this.blockShapeElement, this.initialCoordination, this.currentPosition) :
          null;
  }

  private reselectSelectedMultiRow() {
    const selectionGroup = !!this.mainGroup.querySelector('.multi-selection-group') ?
      this.mainGroup.querySelector('.multi-selection-group') :
      CommonService.createGroupElement(this.mainGroup as any, null, 'multi-selection-group');
    if (!!this.multiSeatsRowSelectionGroup && !!selectionGroup) {
      this.multiSeatsRowSelectionGroup.remove();
      this.multiSeatsRowSelectionGroup = CommonService.singleSelectPathShape(this.mainGroup, selectionGroup as any, true);
      if (!!this.multiSeatsRowSelectionGroup.querySelector('.canMove')) {
        (this.multiSeatsRowSelectionGroup.querySelector('.canMove') as any).style.fill = 'transparent';
      }
    }
  }

  private reselectMultiBlocks() {
    const selectionGroup = !!this.mainGroup.querySelector('.multi-selection-group') ?
      this.mainGroup.querySelector('.multi-selection-group') :
      CommonService.createGroupElement(this.mainGroup as any, null, 'multi-selection-group');
    if (!!this.multiBlockSelectionGroup && !!selectionGroup) {
      this.multiBlockSelectionGroup.remove();
      this.multiBlockSelectionGroup = CommonService.singleSelectPathShape(this.mainGroup, selectionGroup as any, true);
    }
  }

  private selectBlocks() {
    this.isBlockSelected = true;
    this.removeSelection();
    this.selectedBlockShape = undefined;
    const block = this.getSelectedBlockData();
    const shapeGroup = this.blockShapeElement.parentElement;
    this.deselectMultiSelectedRows();
    this.deselectMultiSelectedBlock();
    this.deselectMultiSelectedSeats();
    if (!!this.blockShapeElement && !!block) {
      this.selectionGroup = CommonService.singleSelectPathShape(shapeGroup, this.blockShapeElement as any);
    }
  }

  private drawRectangle(element: SVGElement, startPosition: MousePosition, currentPosition: MousePosition) {
    const block = !!this.getSelectedBlockData() ? this.getSelectedBlockData() : undefined;
    if (!!block) {
      block.pathPoint = CommonService.createRectanglePathPoint(startPosition, currentPosition);
      this.updateSelectedBlockData(block);
      element.setAttribute('d', CommonService.buildPathString(block.pathPoint));
    }
  }

  private drawSquare(element: SVGElement, startPosition: MousePosition, currentPosition: MousePosition) {
    const lengthSquare = Math.sqrt(Math.pow((startPosition.x - currentPosition.x), 2)
      + Math.pow((startPosition.y - currentPosition.y), 2)) * Math.cos(45);
    const block = !!this.getSelectedBlockData() ? this.getSelectedBlockData() : undefined;
    if (!!block) {
      block.pathPoint = CommonService.createSquarePathPoint(startPosition, currentPosition, lengthSquare);
      this.updateSelectedBlockData(block);
      element.setAttribute('d', CommonService.buildPathString(block.pathPoint));
    }
  }

  private drawCircle(element: SVGElement, startPosition: MousePosition, currentPosition: MousePosition) {
    const radius = new SvgPoints();
    radius.x = radius.y = CommonService.getLengthOfTwoPoints(startPosition, currentPosition);
    const start = CommonService.circle(startPosition.x, startPosition.y, radius, 359);
    const end = CommonService.circle(startPosition.x, startPosition.y, radius, 0);
    const block = !!this.getSelectedBlockData() ? this.getSelectedBlockData() : undefined;
    if (!!block) {
      block.pathPoint = [
        {command: 'M', x: start.x, y: start.y},
        {command: 'A', arcRadiusX: radius.x, arcRadiusY: radius.y, xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: end.x, y: end.y},
        {command: 'z'}
      ];
      this.updateSelectedBlockData(block);
      element.setAttribute('d', CommonService.buildPathString(block.pathPoint));
    }
  }

  private drawCustomShape(element: SVGElement, point) {
    this.removeSelection();
    const block = !!this.getSelectedBlockData() ? this.getSelectedBlockData() : undefined;
    if (!!block) {
      block.pathPoint.push(point);
      this.updateSelectedBlockData(block);
      element.setAttribute('d', CommonService.buildPathString(block.pathPoint));
      this.selectionGroup = CommonService.setPathPoints(this.svgElement as any, block.pathPoint);
    }
  }

  private customShapeDrawEnd(element: SVGElement) {
    this.removeSelection();
    this.isSetPointForBlock = false;
    // this.selectedBlockShape = undefined;
    const block = this.getSelectedBlockData();
    const point = _.cloneDeep(block.pathPoint[0]);
    point.command = 'L';
    block.pathPoint.push(point);
    element.setAttribute('d', CommonService.buildPathString(block.pathPoint));
    this.svgElement.querySelector('#previewLine').remove();
    // this.selectionGroup = CommonService.shapeSelection(this.svgElement, block.pathPoint);
    this.removeSelection();
    // this.selectBlocks();
    if (!this.IS_BLOCK_INSIDE_SHAPE(block) || this.IS_BLOCKS_OVERLAPPING(block) || this.IS_BLOCK__OVERLAPPING_NON_SEATING_AREA(block)) {
      this.removeSelectedBlock();
    }
  }

  private singleRowSeatsCountChange(selectedRow: HTMLElement) {
    this.seatsRowSelectionGroup.style.display = 'none';
    const fixedPoint = CommonService.getCirclePoint(CommonService.getScaleStartPoint(this.svgElement, this.resizeTarget));
    let seatsRowData = this.getSeatsRowDataFromSelectedBlock(selectedRow.id);
    const rowLinePath = selectedRow.querySelector('.rowLinePath');
    const rowStartPoint = CommonService.getStartPointInPathLine(rowLinePath);
    const rowEndPoint = CommonService.getEndPointInPathLine(rowLinePath);
    const x = (this.currentPosition.x);
    const tan = (rowStartPoint.y - rowEndPoint.y) / (rowStartPoint.x - rowEndPoint.x);
    const y = rowStartPoint.y - tan * (rowStartPoint.x - this.currentPosition.x);
    if (!CommonService.pointIntersect(fixedPoint, {x, y})) {
      seatsRowData.linePathPoint = CommonService.createLinePathPoint(fixedPoint, {x, y});
    }
    rowLinePath.setAttribute('d', CommonService.buildPathString(seatsRowData.linePathPoint));
    const seatsArray = Array.from(selectedRow.querySelectorAll('.seats-group'));
    seatsArray.forEach(element => element.remove());
    seatsRowData = CommonService.createSeatsForRow(selectedRow as any, rowLinePath as any, seatsRowData, this.seatProperties.priceBand);
    Array.from(selectedRow.querySelectorAll('.seatID')).forEach((ele: any) => ele.style.display = 'none');
    this.updateSeatsRowDataFromSelectedBlock(seatsRowData);
  }

  private startDrag(selectedShape: SVGElement, currentPosition: MousePosition) {
    if (!!this.seatsRowSelectionGroup) {
      this.seatsRowSelectionGroup.style.display = 'none';
    }
    if (selectedShape) {
      const x = (currentPosition.x - this.initialCoordination.x);
      const y = (currentPosition.y - this.initialCoordination.y);
      if (this.canDragRow) {
        const rowLinePath = selectedShape.querySelector('.rowLinePath');
        selectedShape.setAttribute('transform', `translate(${x}, ${y})`);
        if (this.IS_ROW_INSIDE_CURRENT_BLOCK_ON_ACTION(rowLinePath as any, {x, y})) {
          selectedShape.style.opacity = '1';
        } else {
          selectedShape.style.opacity = '0.4';
        }
      } else if (this.canDragMultiSelectedRows) {
        this.multiSeatsRowSelectionGroup.style.display = 'none';
        this.multiSelectedSeatsRow.forEach(rowEle => {
          let itsOverlapping = false;
          const rowLinePath = rowEle.querySelector('.rowLinePath');
          if (!this.IS_ROW_INSIDE_CURRENT_BLOCK_ON_ACTION(rowLinePath as any, {x, y}) && !itsOverlapping) {
            itsOverlapping = true;
          }
          if (itsOverlapping) {
            selectedShape.style.opacity = '0.4';
          } else {
            selectedShape.style.opacity = '1';
          }
        });
        selectedShape.setAttribute('transform', `translate(${x}, ${y})`);
      } else if (this.canDragMultiSelectedBlocks) {
        this.multiBlockSelectionGroup.style.display = 'none';
        this.multiSelectedBlock.forEach(ele => {
          let itsOverlapping = false;
          const blockData = this.blocks.find(block => block.id === (ele as HTMLElement).children[0].id);

          if (!this.IS_BLOCK_INSIDE_SHAPE(blockData) || this.IS_BLOCKS_OVERLAPPING(blockData)
            || this.IS_BLOCK__OVERLAPPING_NON_SEATING_AREA(blockData)) {
            itsOverlapping = true;
          }
          if (itsOverlapping) {
            selectedShape.style.opacity = '0.4';
          } else {
            selectedShape.style.opacity = '1';
          }
        });
        selectedShape.setAttribute('transform', `translate(${x}, ${y})`);
      } else {
        selectedShape.parentElement.setAttribute('transform', `translate(${x}, ${y})`);
      }
    }
  }

  private seatsRowDragEnd(selectedRow: SVGElement, mouseMoved: MousePosition) {
    const seatsRowData = this.getSeatsRowDataFromSelectedBlock(selectedRow.id);
    if (!seatsRowData) {
      this.toastR.error('seat row data undefined', 'error');
    }
    const rowLinePath = selectedRow.querySelector('.rowLinePath');
    if (!this.isMultiRowsSelected) {
      selectedRow.removeAttribute('transform');
    }
    const seatsArray = Array.from(selectedRow.querySelectorAll('.seats-group'));
    seatsArray.forEach(element => element.remove());
    if (!!rowLinePath) {
      seatsRowData.linePathPoint = CommonService.translatePathPoint(seatsRowData.linePathPoint, mouseMoved);
      rowLinePath.setAttribute('d', CommonService.buildPathString(seatsRowData.linePathPoint));
      seatsRowData.seats.forEach(seat => {
        seat.centerPoint.x += mouseMoved.x;
        seat.centerPoint.y += mouseMoved.y;
      });
      const seatsGroup = CommonService.createGroupElement(selectedRow, `seats-group-${seatsRowData.id}`, 'seats-group');
      CommonService.createSeatsForSeating(seatsGroup, seatsRowData.seats);
      CommonService.createLabelForRowAndSeats(seatsGroup, seatsRowData);

    }
    this.updateSeatsRowDataFromSelectedBlock(seatsRowData);
    if (this.isMultiRowsSelected) {
    } else {
      this.singleSelectSeatsRow();
    }
  }

  private seatsRowRotateEnd(selectedRow: SVGElement, rotateAngle: number, centerPoint: MousePosition) {
    const seatsRowData = this.getSeatsRowDataFromSelectedBlock(selectedRow.id);
    selectedRow.removeAttribute('transform');
    const rowLinePath = selectedRow.querySelector('.rowLinePath');
    const seatsArray = Array.from(selectedRow.querySelectorAll('.seats-group'));
    seatsArray.forEach(element => element.remove());
    if (!!rowLinePath) {
      seatsRowData.linePathPoint = CommonService.rotatePathPoint(seatsRowData.linePathPoint, rotateAngle, centerPoint);
      rowLinePath.setAttribute('d', CommonService.buildPathString(seatsRowData.linePathPoint));
      seatsRowData.seats.forEach(seat => {
        const x = seat.centerPoint.x;
        const y = seat.centerPoint.y;
        const tempX = x - centerPoint.x;
        const tempY = y - centerPoint.y;
        const rotatedX = tempX * Math.cos(rotateAngle * Math.PI / 180) - tempY * Math.sin(rotateAngle * Math.PI / 180);
        const rotatedY = tempX * Math.sin(rotateAngle * Math.PI / 180) + tempY * Math.cos(rotateAngle * Math.PI / 180);
        seat.centerPoint.x = rotatedX + centerPoint.x;
        seat.centerPoint.y = rotatedY + centerPoint.y;
      });
      const seatsGroup = CommonService.createGroupElement(selectedRow, `seats-group-${seatsRowData.id}`, 'seats-group');
      CommonService.createSeatsForSeating(seatsGroup, seatsRowData.seats);
      CommonService.createLabelForRowAndSeats(seatsGroup, seatsRowData);
    }
    this.updateSeatsRowDataFromSelectedBlock(seatsRowData);
    if (this.canRotateRow) {
      this.singleSelectSeatsRow();
    }
  }

  private endDrag(selectedShape: SVGElement, currentPosition: MousePosition, blockData: Block) {
    selectedShape.parentElement.removeAttribute('transform');
    const mouseMoved = new MousePosition();
    mouseMoved.x = currentPosition.x - this.initialCoordination.x;
    mouseMoved.y = currentPosition.y - this.initialCoordination.y;
    const previousPathPoint = _.cloneDeep(blockData.pathPoint);
    if (!!blockData) {
      blockData.pathPoint = CommonService.translatePathPoint(blockData.pathPoint, this.isMultiBlocksSelected ? currentPosition : mouseMoved);
      CommonService.setPathDString(this.isMultiBlocksSelected ? selectedShape.children[0] : selectedShape
        , CommonService.buildPathString(blockData.pathPoint));
      // console.log(!this.IS_BLOCK_INSIDE_SHAPE(blockData));
      // console.log(this.IS_BLOCK__OVERLAPPING_NON_SEATING_AREA(blockData));
      // console.log(this.IS_BLOCKS_OVERLAPPING(blockData));
      if (!this.isMultiBlocksSelected && !this.IS_BLOCK_INSIDE_SHAPE(blockData) ||
        this.IS_BLOCKS_OVERLAPPING(blockData) || this.IS_BLOCK__OVERLAPPING_NON_SEATING_AREA(blockData)) {
        blockData.pathPoint = previousPathPoint;
        CommonService.setPathDString(this.isMultiBlocksSelected ? selectedShape.children[0] : selectedShape,
          CommonService.buildPathString(blockData.pathPoint));
      } else {
        if (blockData.seatsRow.length > 0) {
          blockData.seatsRow = this.translateSeatsRowsWithBlocks(this.isMultiBlocksSelected ? currentPosition : mouseMoved, blockData.seatsRow);
        }
      }
      this.updateSelectedBlockData(blockData);
      if (!this.isMultiBlocksSelected) {
        this.selectBlocks();
      }
    }
  }

  private translateSeatsRowsWithBlocks(seatsMovements: MousePosition, seatsRows: SeatsRow []) {
    seatsRows.forEach(rows => {
      const rowGroup = (document).getElementById(rows.id);
      const rowLinePath = rowGroup.querySelector('.rowLinePath');
      const seatsArray = Array.from(rowGroup.querySelectorAll('.seats-group'));
      seatsArray.forEach(element => element.remove());
      if (!!rowLinePath) {
        rows.linePathPoint = CommonService.translatePathPoint(rows.linePathPoint, seatsMovements);
        rowLinePath.setAttribute('d', CommonService.buildPathString(rows.linePathPoint));
        rows.seats.forEach(seat => {
          seat.centerPoint.x += seatsMovements.x;
          seat.centerPoint.y += seatsMovements.y;
        });
        const seatsGroup = CommonService.createGroupElement(rowGroup as any, `seats-group-${rows.id}`, 'seats-group');
        CommonService.createSeatsForSeating(seatsGroup, rows.seats);
        CommonService.createLabelForRowAndSeats(seatsGroup, rows);

      }
    });
    return seatsRows;
  }

  private rotateSeatsRowsWithBlocks(rotateAngle: number, seatsRows: SeatsRow [], centerPoint: MousePosition) {
    seatsRows.forEach(rows => {
      const rowGroup = (document).getElementById(rows.id);
      const rowLinePath = rowGroup.querySelector('.rowLinePath');
      const seatsArray = Array.from(rowGroup.querySelectorAll('.seats-group'));
      seatsArray.forEach(element => element.remove());
      if (!!rowLinePath) {
        rows.linePathPoint = CommonService.rotatePathPoint(rows.linePathPoint, rotateAngle, centerPoint);
        rowLinePath.setAttribute('d', CommonService.buildPathString(rows.linePathPoint));
        rows.seats.forEach(seat => {
          const x = seat.centerPoint.x;
          const y = seat.centerPoint.y;
          const tempX = x - centerPoint.x;
          const tempY = y - centerPoint.y;
          const rotatedX = tempX * Math.cos(rotateAngle * Math.PI / 180) - tempY * Math.sin(rotateAngle * Math.PI / 180);
          const rotatedY = tempX * Math.sin(rotateAngle * Math.PI / 180) + tempY * Math.cos(rotateAngle * Math.PI / 180);
          seat.centerPoint.x = rotatedX + centerPoint.x;
          seat.centerPoint.y = rotatedY + centerPoint.y;
        });
        const seatsGroup = CommonService.createGroupElement(rowGroup as any, `seats-group-${rows.id}`, 'seats-group');
        CommonService.createSeatsForSeating(seatsGroup, rows.seats);
        CommonService.createLabelForRowAndSeats(seatsGroup, rows);
      }
    });
    return seatsRows;
  }

  private startRotate(selectedShape: SVGElement, currentPosition: MousePosition) {
    if (!!this.seatsRowSelectionGroup) {
      this.seatsRowSelectionGroup.style.display = 'none';
    }
    const centerPoint = CommonService.getCenterPosition(selectedShape as any);
    this.rotateAngle = CommonService.getAngle(centerPoint, currentPosition);
    if (this.canRotateRow) {
      const rowLinePath = selectedShape.querySelector('.rowLinePath');
      selectedShape.setAttribute('transform', `rotate(${this.rotateAngle}, ${centerPoint.x} , ${centerPoint.y}) `);
      if (this.IS_ROW_INSIDE_CURRENT_BLOCK_ON_ACTION(rowLinePath as any, undefined, this.rotateAngle, centerPoint)) {
        selectedShape.style.opacity = '1';
      } else {
        selectedShape.style.opacity = '0.4';
      }
    } else if (this.canRotateMultiSelectedRows) {
      this.multiSeatsRowSelectionGroup.style.display = 'none';
      let itsOverlapping = false;
      this.multiSelectedSeatsRow.forEach(rowEle => {
        const rowLinePath = rowEle.querySelector('.rowLinePath');
        if (!this.IS_ROW_INSIDE_CURRENT_BLOCK_ON_ACTION(rowLinePath as any, undefined, this.rotateAngle, centerPoint) && !itsOverlapping) {
          itsOverlapping = true;
        }
        if (itsOverlapping) {
          selectedShape.style.opacity = '0.4';
        } else {
          selectedShape.style.opacity = '1';
        }
      });
      selectedShape.setAttribute('transform', `rotate(${this.rotateAngle}, ${centerPoint.x} , ${centerPoint.y}) `);
    } else {
      selectedShape.parentElement.setAttribute('transform', `rotate(${this.rotateAngle}, ${centerPoint.x} , ${centerPoint.y}) `);
    }
  }

  private endRotate(selectedShape: SVGElement) {
    const block = this.getSelectedBlockData();
    const centerPoint = CommonService.getCenterPosition(selectedShape as any);
    selectedShape.parentElement.removeAttribute('transform');
    const previousPathPoint = _.cloneDeep(block.pathPoint);
    block.pathPoint = CommonService.rotatePathPoint(block.pathPoint, this.rotateAngle, centerPoint);
    CommonService.setPathDString(selectedShape, CommonService.buildPathString(block.pathPoint));
    if (!this.IS_BLOCK_INSIDE_SHAPE(block) || this.IS_BLOCKS_OVERLAPPING(block)) {
      block.pathPoint = previousPathPoint;
      CommonService.setPathDString(selectedShape, CommonService.buildPathString(block.pathPoint));
    } else {
      if (block.seatsRow.length > 0) {
        block.seatsRow = this.rotateSeatsRowsWithBlocks(this.rotateAngle, block.seatsRow, centerPoint);
      }
    }
    this.updateSelectedBlockData(block);
    this.selectBlocks();
  }

  private startScaling(element: SVGElement, currentPosition: MousePosition) {
    if (!!this.selectionGroup) {
      this.selectionGroup.style.display = 'none';
    }
    const block: Block = this.getSelectedBlockData();
    const startPointTarget = CommonService.getScaleStartPoint(this.svgElement, this.resizeTarget);
    if (startPointTarget !== null) {
      const startPoint = CommonService.getCirclePoint(startPointTarget) || undefined;
      const resizeTargetPoint = CommonService.getCirclePoint(this.resizeTarget) || undefined;
      if (startPoint && resizeTargetPoint) {
        const firstDistance = new SvgPoints();
        const lastDistance = new SvgPoints();
        firstDistance.x = startPoint.x - resizeTargetPoint.x;
        firstDistance.y = startPoint.y - resizeTargetPoint.y;
        lastDistance.x = startPoint.x - currentPosition.x;
        lastDistance.y = startPoint.y - currentPosition.y;
        if (block.type === ShapeType.SQUARE) {
          if (lastDistance.x / firstDistance.x > lastDistance.y / firstDistance.y) {
            this.scaleValue.x = lastDistance.x / firstDistance.x;
            this.scaleValue.y = lastDistance.x / firstDistance.x;
          } else {
            this.scaleValue.x = lastDistance.y / firstDistance.y;
            this.scaleValue.y = lastDistance.y / firstDistance.y;
          }
        } else {
          this.scaleValue.x = lastDistance.x / firstDistance.x;
          this.scaleValue.y = lastDistance.y / firstDistance.y;
        }
        this.scaleValue.x = isNaN(this.scaleValue.x) || Math.abs(this.scaleValue.x) === Infinity ? 1 : this.scaleValue.x;
        this.scaleValue.y = isNaN(this.scaleValue.y) || Math.abs(this.scaleValue.y) === Infinity ? 1 : this.scaleValue.y;
        element.setAttribute('transform', `translate(${startPoint.x}, ${startPoint.y})
          scale(${this.scaleValue.x}, ${this.scaleValue.y})
          translate(-${startPoint.x}, -${startPoint.y})`);
      }
    }
  }

  private endScaling(selectedShape: SVGElement) {
    const startPointTarget = CommonService.getScaleStartPoint(this.svgElement, this.resizeTarget);
    const block = this.getSelectedBlockData();
    const startPoint = CommonService.getCirclePoint(startPointTarget) || undefined;
    selectedShape.removeAttribute('transform');
    const previousPathPoint = _.cloneDeep(block.pathPoint);
    block.pathPoint = CommonService.scalePathPoint(block.pathPoint, this.scaleValue, startPoint);
    CommonService.setPathDString(selectedShape, CommonService.buildPathString(block.pathPoint));
    this.selectionGroup.style.display = 'block';
    if (!this.IS_BLOCK_INSIDE_SHAPE(block) || this.IS_BLOCKS_OVERLAPPING(block) || this.IS_BLOCK__OVERLAPPING_NON_SEATING_AREA(block)) {
      block.pathPoint = previousPathPoint;
      CommonService.setPathDString(selectedShape, CommonService.buildPathString(block.pathPoint));
    } else {
      block.seatsRow = this.recalculateRowSeatsAfterBlockResize(block.seatsRow);
    }
    this.updateSelectedBlockData(block);
    this.selectBlocks();
  }

  private getSelectedBlockData() {
    if (!!this.blockShapeElement) {
      const block = this.blocks.find(x => x.id === this.blockShapeElement.id);
      return !!block ? block : undefined;
    }
    return undefined;
  }

  private updateSelectedBlockData(data) {
    const index = this.blocks.findIndex(x => x.id === data.id);
    if (!!index) {
      this.blocks[index] = data;
    }
    this.seatService.updateBlocks(this.blocks);
  }

  private getSeatsRowDataFromSelectedBlock(id) {
    const blockData = this.getSelectedBlockData();
    if (!blockData) {
      return undefined;
    }
    const rowIndex = blockData.seatsRow.findIndex(x => x.id === id);
    return rowIndex > -1 ? blockData.seatsRow[rowIndex] : undefined;
  }

  private updateSeatsRowDataFromSelectedBlock(seatsRow: SeatsRow) {
    const blockData = this.getSelectedBlockData();
    const rowIndex = blockData.seatsRow.findIndex(x => x.id === seatsRow.id);
    blockData.seatsRow[rowIndex] = seatsRow;
    this.updateSelectedBlockData(blockData);
  }

  private removeSelection() {
    this.seatService.selectedBlockShape$.next(undefined);
    if (this.selectionGroup) {
      this.selectionGroup.remove();
      this.selectionGroup = undefined;
    }
    if (!!this.seatsRowSelectionGroup) {
      this.seatsRowSelectionGroup.remove();
      this.selectedSeatsRow = undefined;
      this.seatsRowSelectionGroup = undefined;
    }
    this.deselectMultiSelectedRows();
    this.deselectMultiSelectedBlock();
    this.deselectMultiSelectedSeats();
  }

  private removeSelectedBlock() {
    const index = this.blocks.findIndex(x => x.id === this.blockShapeElement.id);
    this.blocks.splice(index, 1);
    this.seatService.updateBlocks(this.blocks);
    this.blockShapeElement.parentElement.remove();
  }

  private startDrawSingleRowSeats() {
    const selectedBlockGroupElement = this.blockShapeElement.parentElement;
    const blockData = this.getSelectedBlockData();
    if (!!this.seatsRowGroupElement) {
      let seatsRow = this.getSeatsRowDataFromSelectedBlock(this.seatsRowGroupElement.id);
      const rowPath = this.seatsRowGroupElement.querySelector('.rowLinePath');
      if (!!seatsRow) {
        if (seatsRow.curve === 0) {
          seatsRow.linePathPoint = CommonService.createLinePathPoint(this.initialCoordination, this.currentPosition);
        } else {
          seatsRow.linePathPoint = CommonService.createCurveSeatsRow(this.initialCoordination, this.currentPosition, seatsRow.curve);
        }
        rowPath.setAttribute('d', CommonService.buildPathString(seatsRow.linePathPoint));
        seatsRow = CommonService.createSeatsForRow(this.seatsRowGroupElement, rowPath as any, seatsRow, this.seatProperties.priceBand);
        this.updateSeatsRowDataFromSelectedBlock(seatsRow);
      }
    } else {
      let seatRowID;
      let lastBlockData = this.blocks[this.blocks.length - 1];
      if (lastBlockData.id === blockData.id && this.blocks.length > 1) {
        lastBlockData = this.blocks[this.blocks.length - 2];
      }
      if (lastBlockData.seatsRow.length > 0) {
        seatRowID = CommonService.getSeatRowId(lastBlockData.seatsRow[lastBlockData.seatsRow.length - 1], this.blocks);
      } else if (blockData.seatsRow.length > 0) {
        seatRowID = CommonService.getSeatRowId(blockData.seatsRow[blockData.seatsRow.length - 1], this.blocks);
      } else {
        seatRowID = this.seatProperties.rowStart;
      }
      let seatsRow = new SeatsRow(
        CommonService.generateUniqId,
        seatRowID.toUpperCase(),
        [],
        [],
        this.seatProperties.radius,
        this.seatProperties.curve,
        this.seatProperties.seatSpacing,
        this.seatProperties.isSeatLabelAsc,
      );
      if (seatsRow.curve === 0) {
        seatsRow.linePathPoint = CommonService.createLinePathPoint(this.initialCoordination, this.currentPosition);
      } else {
        seatsRow.linePathPoint = CommonService.createCurveSeatsRow(this.initialCoordination, this.currentPosition, seatsRow.curve);
      }
      this.seatsRowGroupElement = CommonService.createGroupElement(selectedBlockGroupElement as any, seatsRow.id, 'seatsRow');
      const rowPath = CommonService.createPathEle(this.seatsRowGroupElement, CommonService.generateUniqId, 'rowLinePath');
      rowPath.style.fill = 'none';
      rowPath.setAttribute('d', CommonService.buildPathString(seatsRow.linePathPoint));
      seatsRow = CommonService.createSeatsForRow(this.seatsRowGroupElement, rowPath as any, seatsRow, this.seatProperties.priceBand);
      !!blockData.seatsRow ? blockData.seatsRow.push(seatsRow) : blockData.seatsRow = [seatsRow];
      this.updateSelectedBlockData(blockData);
    }
    if (!this.IS_POINT_IN_SELECTED_BLOCK) {
      this.seatsRowGroupElement.style.opacity = '0.5';
    } else {
      this.seatsRowGroupElement.style.opacity = '1';
    }
  }

  private startDrawMultiRowSeats() {
    const selectedBlockGroupElement = this.blockShapeElement.parentElement;
    const blockData = this.getSelectedBlockData();
    const tempRectPoints = CommonService.createRectanglePathPoint(this.initialCoordination, this.currentPosition);
    if (!!selectedBlockGroupElement.querySelector('.tempRectangleShape')) {
      selectedBlockGroupElement.querySelector('.tempRectangleShape').remove();
    }
    const tempRectangleElement = CommonService.createPathEle(selectedBlockGroupElement as any, null, 'tempRectangleShape');
    tempRectangleElement.setAttribute('d', CommonService.buildPathString(tempRectPoints));
    tempRectangleElement.style.fill = 'red';
    const tempRectBBox = tempRectangleElement.getBBox();
    const rowDistance = (this.seatProperties.radius * 2) + this.rowSpacing;
    const numberOfRows = Math.trunc(tempRectBBox.height / rowDistance);
    const initialPoint = _.cloneDeep(this.initialCoordination);
    const currentPoint = _.cloneDeep(this.initialCoordination);
    currentPoint.x = _.cloneDeep(this.currentPosition.x);
    this.multiRowsTempObjects = [];
    this.multiRowSeatsTempStorage.forEach(element => element.remove());
    for (let i = 0; i <= numberOfRows; i++) {
      let seatRowID;
      if (i === 0) {
        let lastBlockData = this.blocks[this.blocks.length - 1];
        if (lastBlockData.id === blockData.id && this.blocks.length > 1) {
          lastBlockData = this.blocks[this.blocks.length - 2];
        }
        if (lastBlockData.seatsRow.length > 0) {
          seatRowID = CommonService.getSeatRowId(lastBlockData.seatsRow[lastBlockData.seatsRow.length - 1], undefined);
        } else if (this.multiRowsTempObjects.length > 0) {
          seatRowID = CommonService.getSeatRowId(this.multiRowsTempObjects[this.multiRowsTempObjects.length - 1], undefined);
        } else {
          seatRowID = this.seatProperties.rowStart;
        }
      } else {
        seatRowID = CommonService.getSeatRowId(this.multiRowsTempObjects[this.multiRowsTempObjects.length - 1], undefined);
      }
      let seatsRow = new SeatsRow(
        CommonService.generateUniqId,
        seatRowID.toUpperCase(),
        [],
        [],
        this.seatProperties.radius,
        this.seatProperties.curve,
        this.seatProperties.seatSpacing,
        this.seatProperties.isSeatLabelAsc,
      );
      if (seatsRow.curve === 0) {
        seatsRow.linePathPoint = CommonService.createLinePathPoint(initialPoint, currentPoint);
      } else {
        seatsRow.linePathPoint = CommonService.createCurveSeatsRow(initialPoint, currentPoint, seatsRow.curve);
      }
      const seatsRowGroupElement = CommonService.createGroupElement(selectedBlockGroupElement as any, seatsRow.id, 'seatsRow');
      const rowPath = CommonService.createPathEle(seatsRowGroupElement, CommonService.generateUniqId, 'rowLinePath');
      rowPath.setAttribute('d', CommonService.buildPathString(seatsRow.linePathPoint));
      rowPath.style.fill = 'none';
      if (this.initialCoordination.y > this.currentPosition.y) {
        initialPoint.y -= rowDistance;
        currentPoint.y -= rowDistance;
      } else {
        initialPoint.y += rowDistance;
        currentPoint.y += rowDistance;
      }
      seatsRow = CommonService.createSeatsForRow(seatsRowGroupElement, rowPath as any, seatsRow, this.seatProperties.priceBand);
      this.multiRowSeatsTempStorage.push(seatsRowGroupElement);
      this.multiRowsTempObjects.push(seatsRow);
    }
    tempRectangleElement.remove();
    if (!this.IS_POINT_IN_SELECTED_BLOCK) {
      this.multiRowSeatsTempStorage.forEach(element => element.style.opacity = '0.5');
    } else {
      this.multiRowSeatsTempStorage.forEach(element => element.style.opacity = '1');
    }
  }

  private removeSeatSpaceBTSeats(blockData: Block, canChangeSeatOrder = false) {
    const parentGroupEle = this.blockShapeElement.parentElement;
    blockData.seatsRow.forEach(row => {
      console.log('asd');
      const rowElementGroup = parentGroupEle.querySelector(`#${row.id}`);
      const rowElement = rowElementGroup.children[0];
      const rowLength = !!rowElement ? (rowElement as SVGGeometryElement).getTotalLength() : undefined;
      const seatsAllocatedLength = ((row.seatsRadius * 2 + row.seatSpacing) * row.seats.length);
      const seatGroup = parentGroupEle.querySelector(`#seats-group-${row.id}`);
      row = CommonService.reAllocateSeatsInARow(rowElementGroup as any, rowElement as any, row, this.seatProperties.priceBand);
      if (rowLength > seatsAllocatedLength && row.seats.length > 0) {
        row.linePathPoint[0].x = row.seats[0].centerPoint.x;
        row.linePathPoint[0].y = row.seats[0].centerPoint.y;
        row.linePathPoint[1].x = row.seats[row.seats.length - 1].centerPoint.x;
        row.linePathPoint[1].y = row.seats[row.seats.length - 1].centerPoint.y;
        if (canChangeSeatOrder) {
          row.seats.forEach((seat, i) => {
            console.log(seat.name);
            seat.name = ((i + 1)).toString();
          });
        }
        rowElement.setAttribute('d', CommonService.buildPathString(row.linePathPoint));
      }
      CommonService.createLabelForRowAndSeats(seatGroup, row);
    });
  }

  private splitRows(blockData: Block, canChangeSeatOrder = false) {
    const parentGroupEle = this.blockShapeElement.parentElement;
    blockData.seatsRow.forEach(row => {
      const rowElementGroup = parentGroupEle.querySelector(`#${row.id}`);
      const rowElement = rowElementGroup.children[0];
      const rowLength = !!rowElement ? (rowElement as SVGGeometryElement).getTotalLength() : undefined;
      const seatsAllocatedLength = ((row.seatsRadius * 2 + row.seatSpacing) * row.seats.length);

      let previousSeat: Seat;
      let isFindASplitPoint = false;
      const maxDistanceBTSeats = (row.seatsRadius * 2) + row.seatSpacing;
      const newRowSeats: Seat[] = [];
      row.seats.forEach((seat) => {
        const seatEle = rowElementGroup.querySelector(`#${seat.id}`);
        if (!!previousSeat && !isFindASplitPoint) {
          const distanceBTSeats = Math.round(CommonService.getLengthOfTwoPoints(seat.centerPoint, previousSeat.centerPoint));
          if (distanceBTSeats > maxDistanceBTSeats) {
            isFindASplitPoint = true;
            row.linePathPoint[1].x = previousSeat.centerPoint.x;
            row.linePathPoint[1].y = previousSeat.centerPoint.y;
            rowElement.setAttribute('d', CommonService.buildPathString(row.linePathPoint));
          }
        }
        if (isFindASplitPoint) {
          newRowSeats.push(seat);
          seatEle.remove();
        }
        previousSeat = seat;
      });
      const oldSeatGroup = rowElementGroup.querySelector('.seats-group');
      if (isFindASplitPoint && newRowSeats.length > 0) {
        newRowSeats.forEach((seat) => {
          const index = row.seats.findIndex(x => x.id === seat.id);
          if (index > -1) {
            row.seats.splice(index, 1);
          }
        });
        newRowSeats.forEach((seat, i) => {
          if (canChangeSeatOrder) {
            seat.name = (parseInt(row.seats[row.seats.length - 1].name, 10) + (i + 1)).toString();
          }
        });
        const initialPoint = newRowSeats[0].centerPoint;
        const lastPoint = newRowSeats[newRowSeats.length - 1].centerPoint;
        let newRow = new SeatsRow(
          CommonService.generateUniqId,
          row.name,
          [],
          newRowSeats,
          row.seatsRadius,
          row.curve,
          row.seatSpacing);
        newRow.linePathPoint = CommonService.createLinePathPoint(initialPoint, lastPoint);
        const seatsRowGroupElement = CommonService.createGroupElement(parentGroupEle as any, newRow.id, 'seatsRow');
        const rowPath = CommonService.createPathEle(seatsRowGroupElement, CommonService.generateUniqId, 'rowLinePath');
        rowPath.setAttribute('d', CommonService.buildPathString(newRow.linePathPoint));
        rowPath.style.fill = 'none';
        newRow = CommonService.reAllocateSeatsInARow(seatsRowGroupElement, rowPath as any, newRow, this.seatProperties.priceBand);
        const seatsGroup = CommonService.createGroupElement(seatsRowGroupElement, `seats-group-${newRow.id}`, 'seats-group');
        CommonService.createSeatsForSeating(seatsGroup, newRow.seats);
        CommonService.createLabelForRowAndSeats(seatsGroup, newRow);
        blockData.seatsRow.push(newRow);
        this.updateSelectedBlockData(blockData);
      }
      if (rowLength > seatsAllocatedLength && row.seats.length > 0) {
        row.linePathPoint[0].x = row.seats[0].centerPoint.x;
        row.linePathPoint[0].y = row.seats[0].centerPoint.y;
        row.linePathPoint[1].x = row.seats[row.seats.length - 1].centerPoint.x;
        row.linePathPoint[1].y = row.seats[row.seats.length - 1].centerPoint.y;
        rowElement.setAttribute('d', CommonService.buildPathString(row.linePathPoint));
      }
      CommonService.createLabelForRowAndSeats(oldSeatGroup, row);
    });
    if (canChangeSeatOrder) {
      this.toastR.success(`Rows splitted && seat labels change`, 'Success!');
    } else {
      this.toastR.success(`Rows splitted`, 'Success!');
    }
  }

  private singleSelectSeatsRow() {
    // this.removeSelection();
    if (this.selectedSeatsRow) {
      this.blockShapeElement = !!this.selectedSeatsRow && !!this.selectedSeatsRow.parentElement.querySelector('.block') ?
        this.selectedSeatsRow.parentElement.querySelector('.block') : undefined;
      if (!!this.seatsRowSelectionGroup) {
        this.seatsRowSelectionGroup.remove();
      }
      const selectedRowData = this.getSeatsRowDataFromSelectedBlock(this.selectedSeatsRow.id);
      let priceBand;
      if (!!selectedRowData) {
        for (const seat of selectedRowData.seats) {
          if (!priceBand) {
            priceBand = seat.priceBand;
          } else {
            if (priceBand.id !== seat.priceBand.id) {
              priceBand = undefined;
              break;
            }
          }
        }
        const emitData = new FormSeatsProperties(
          priceBand,
          selectedRowData.seatsRadius,
          selectedRowData.curve,
          selectedRowData.seatSpacing,
          selectedRowData.isSeatLabelInAsc,
          selectedRowData.name
        );
        this.selectedSeatProperties.emit(emitData);
      }

      this.deselectMultiSelectedRows();
      this.deselectMultiSelectedBlock();
      this.deselectMultiSelectedSeats();
      this.seatsRowSelectionGroup = CommonService.createSelectionSeatsRow(this.selectedSeatsRow as any);
    }

  }

  private recalculateRowSeatsAfterBlockResize(seatsRows: SeatsRow[]) {
    const needToRemove = [];
    seatsRows.forEach((seatsRow) => {
      const rowLineGroup = (document).getElementById(seatsRow.id);
      const rowPath = rowLineGroup.querySelector('.rowLinePath');
      const fillPoints = CommonService.checkPointsInFill(seatsRow.linePathPoint, this.blockShapeElement);
      if (fillPoints.length === 0) {
        needToRemove.push(seatsRow);
        rowLineGroup.remove();
      } else {
        const rowIntersection = CommonService.findInterSectionBetweenTwoShape(this.blockShapeElement as any, rowPath as any);
        if (rowIntersection.length > 0) {
          if (rowIntersection.length === 1) {
            fillPoints.forEach(point => {
              const removePointIndex = seatsRow.linePathPoint.findIndex(x => !_.isEqual(x, point));
              if (removePointIndex !== -1) {
                seatsRow.linePathPoint[removePointIndex].x = rowIntersection[0].x;
                seatsRow.linePathPoint[removePointIndex].y = rowIntersection[0].y;
              }
            });
          }
          rowPath.setAttribute('d', CommonService.buildPathString(seatsRow.linePathPoint));
          if (!!rowLineGroup.querySelector('.seats-group')) {
            rowLineGroup.querySelector('.seats-group').remove();
          }
          CommonService.createSeatsForRow(rowLineGroup as any, rowPath as any, seatsRow, seatsRow.seats[0].priceBand);
        }
      }
    });
    needToRemove.forEach(i => {
      const index = seatsRows.findIndex(row => row.id === i.id);
      seatsRows.splice(index, 1);
    });
    return seatsRows;
  }

  private editSelectedRow(selectedSeatsRow: HTMLElement, value: FormSeatsProperties) {
    let seatRowData = this.getSeatsRowDataFromSelectedBlock(selectedSeatsRow.id);
    if (!!seatRowData) {
      seatRowData.seatSpacing = value.seatSpacing;
      seatRowData.curve = value.curve;
      seatRowData.seatsRadius = value.radius;
      const lineStartPoint = Object.assign(new SvgPoints(), seatRowData.linePathPoint[0]);
      const lineEndPoint = Object.assign(new SvgPoints(), seatRowData.linePathPoint[1]);
      const rowPath = selectedSeatsRow.querySelector('.rowLinePath');
      (rowPath as any).style.fill = 'none';
      if (seatRowData.curve === 0) {
        seatRowData.linePathPoint = CommonService.createLinePathPoint(lineStartPoint, lineEndPoint);
      } else {
        seatRowData.linePathPoint = CommonService.createCurveSeatsRow(lineStartPoint, lineEndPoint, seatRowData.curve);
      }
      rowPath.setAttribute('d', CommonService.buildPathString(seatRowData.linePathPoint));
      seatRowData = CommonService.reAllocateSeatsInARow(selectedSeatsRow as any, rowPath as any, seatRowData,
        value.priceBand, (!!value.priceBand && !_.isEqual(value.priceBand, this.seatProperties.priceBand)));
      this.updateSeatsRowDataFromSelectedBlock(seatRowData);
    }
  }

  private deselectMultiSelectedRows() {
    // remove multi selected rows *************************************************
    if (this.isMultiRowsSelected && !!this.blockShapeElement && !!this.mainGroup.querySelector('.multi-selection-group')) {
      this.multiSelectedSeatsRow.forEach(rowEle => {
        this.blockShapeElement.parentElement.appendChild(rowEle);
      });
      this.multiSelectedSeatsRow = [];
      if (!!this.multiSeatsRowSelectionGroup) {
        this.multiSeatsRowSelectionGroup.remove();
        this.multiSeatsRowSelectionGroup = undefined;
      }
      this.mainGroup.querySelector('.multi-selection-group').remove();
    }
    this.isMultiRowsSelected = false;
    // *****************************************************************************
  }

  private deselectMultiSelectedSeats() {
    if (this.isMultiSeatSelected) {
      this.isMultiSeatSelected = false;
      this.multiSelectedSeats.forEach((element: SVGElement) => {
        const seat: any = element.children[0];
        seat.style.stroke = CommonService.setLightPercentage(seat.getAttribute('fill'), 80);

      });
      this.multiSelectedSeats = [];
    }
    this.isMultiSeatSelection = false;
  }

  private deselectMultiSelectedBlock() {
    // remove multi selected rows *************************************************
    if (this.isMultiBlocksSelected && !!this.mainGroup.querySelector('.multi-selection-group')) {
      this.multiSelectedBlock.forEach(rowEle => {
        this.mainGroup.appendChild(rowEle);
      });
      this.multiSelectedBlock = [];
      if (!!this.multiBlockSelectionGroup) {
        this.multiBlockSelectionGroup.remove();
        this.multiBlockSelectionGroup = undefined;
      }
      this.mainGroup.querySelector('.multi-selection-group').remove();
    }
    this.isMultiBlocksSelected = false;
    // *****************************************************************************
  }

  private get IS_POINT_IN_SELECTED_BLOCK() {
    return !!this.blockShapeElement && !!(this.blockShapeElement as any).isPointInFill(CommonService.createSVGPoint({
      x: this.currentPosition.x,
      y: this.currentPosition.y
    }));
  }

  private IS_BLOCKS_OVERLAPPING(selectedBlockData: Block) {
    const otherBlocks = this.blocks.filter(x => x.id !== selectedBlockData.id, this.isMultiBlocksSelected);
    const mainBlockElement = (this.svgElement as any).getElementById(`${selectedBlockData.id.toString()}`);
    const fillPoints = [];
    otherBlocks.forEach(block => {
      const blockElement = (this.svgElement as any).getElementById(`${block.id.toString()}`);
      fillPoints.push(...CommonService.checkPointsInFill(selectedBlockData.pathPoint, blockElement));
      fillPoints.push(...CommonService.checkPointsInFill(block.pathPoint, mainBlockElement));
    });
    return fillPoints.length !== 0;
  }

  private IS_BLOCK_INSIDE_SHAPE(blockData: Block) {
    const blockShapeElement = this.svgElement.querySelector(`#${blockData.facilityShapeID}`);
    if (!!blockData && !!blockShapeElement) {
      const isV = CommonService.checkBlocksIsInsideShape(blockShapeElement as any, blockData.pathPoint);
      if (isV) {
        return true;
      }
    }
    this.toastR.error('Block is not inside the facility shape', 'error');
    return false;
  }

  private IS_BLOCK__OVERLAPPING_NON_SEATING_AREA(blockData: Block) {
    const blockFacilityShapeData = this.facility.shapes.find(shape => shape.shapeID === blockData.facilityShapeID);
    if (!blockFacilityShapeData.nonSeatingArea) {
      return false;
    } else {
      for (const data of blockFacilityShapeData.nonSeatingArea) {
        const element = document.getElementById(`${data.id}`);
        if (!!element) {
          // if (CommonService.checkPointsInFill(blockData.pathPoint, element.children[0] as any).length > 0) {
          //   return true;
          // } else if (CommonService.checkPointsInFill(data.pathArray, this.blockShapeElement as any).length > 0) {
          //   return true;
          // } else
          if (CommonService.findInterSectionBetweenTwoShape(element.children[0] as any, this.blockShapeElement as any).length > 0) {
            this.toastR.error('Block overlapping non seating area', 'error');
            return true;
          }
        }
      }
    }
    return false;
  }

  private get IS_POINT_IN_SELECTED_SEAT_ROW() {
    if (!this.seatsRowSelectionGroup) {
      return false;
    }
    const selectionRect = this.seatsRowSelectionGroup.querySelector('.selection-rect');
    return !!this.selectedSeatsRow && !!selectionRect && !!(selectionRect as any).isPointInFill(CommonService.createSVGPoint({
      x: this.currentPosition.x,
      y: this.currentPosition.y
    }));
  }

  private IS_ROW_INSIDE_CURRENT_BLOCK_ON_ACTION(rowLine: SVGGeometryElement,
                                                dragPoint?: MousePosition, rotateAngle?: number, centerPoint?: MousePosition) {
    const rowStartPoint = CommonService.getStartPointInPathLine(rowLine);
    const rowEndPoint = CommonService.getEndPointInPathLine(rowLine);
    if (!!dragPoint) {
      rowStartPoint.x += dragPoint.x;
      rowStartPoint.y += dragPoint.y;
      rowEndPoint.x += dragPoint.x;
      rowEndPoint.y += dragPoint.y;
    }
    if (!!rotateAngle && !!centerPoint) {
      if (!!rowStartPoint) {
        const x = rowStartPoint.x;
        const y = rowStartPoint.y;
        const tempX = x - centerPoint.x;
        const tempY = y - centerPoint.y;
        const rotatedX = tempX * Math.cos(rotateAngle * Math.PI / 180) - tempY * Math.sin(rotateAngle * Math.PI / 180);
        const rotatedY = tempX * Math.sin(rotateAngle * Math.PI / 180) + tempY * Math.cos(rotateAngle * Math.PI / 180);
        rowStartPoint.x = rotatedX + centerPoint.x;
        rowStartPoint.y = rotatedY + centerPoint.y;
      }
      if (!!rowEndPoint) {
        const x = rowEndPoint.x;
        const y = rowEndPoint.y;
        const tempX = x - centerPoint.x;
        const tempY = y - centerPoint.y;
        const rotatedX = tempX * Math.cos(rotateAngle * Math.PI / 180) - tempY * Math.sin(rotateAngle * Math.PI / 180);
        const rotatedY = tempX * Math.sin(rotateAngle * Math.PI / 180) + tempY * Math.cos(rotateAngle * Math.PI / 180);
        rowEndPoint.x = rotatedX + centerPoint.x;
        rowEndPoint.y = rotatedY + centerPoint.y;
      }
    }
    if (!!rowStartPoint && !!rowEndPoint && !!this.blockShapeElement) {
      return (this.blockShapeElement as any).isPointInFill(CommonService.createSVGPoint({
        x: rowStartPoint.x,
        y: rowStartPoint.y
      })) && (this.blockShapeElement as any).isPointInFill(CommonService.createSVGPoint({
        x: rowEndPoint.x,
        y: rowEndPoint.y
      }));
    }
    return false;
  }

  private IS_POINT_INSIDE_SELECTED_SEAT(element) {
    for (const seatEle of this.multiSelectedSeats) {
      if (seatEle.children[0] === element) {
        return true;
      }
    }
    return false;
  }

  private IS_SEAT_INSIDE_BLOCK_ON_MOVE(moveDistance: MousePosition, seatElement) {
    const point = CommonService.getCirclePoint(seatElement);
    point.x += moveDistance.x;
    point.y += moveDistance.y;
    return (this.blockShapeElement as any).isPointInFill(CommonService.createSVGPoint({
      x: point.x,
      y: point.y
    }));
  }

  private ALL_ROWS_ARE_SELECTED_IN_MULTI_SEAT_SELECTION() {
    const blockData = this.getSelectedBlockData();
    const clonedSeats = _.cloneDeep(this.multiSelectedSeats);
    const selectedRows = [];
    blockData.seatsRow.forEach(row => {
      let selectedSeatCount = 0;
      let existSeatIndex = [];
      row.seats.forEach(seat => {
        const index = clonedSeats.findIndex(x => x.children[0].id === seat.id);
        if (index > -1) {
          existSeatIndex.push(index);
          selectedSeatCount++;
        }
      });
      if (selectedSeatCount === row.seats.length) {
        selectedRows.push(row);
        existSeatIndex = existSeatIndex.reverse();
        existSeatIndex.forEach(index => clonedSeats.splice(index, 1));
      }
    });
    if (clonedSeats.length === 0) {
      return selectedRows;
    }
    return undefined;
  }

  private IS_DONT_NEED_CONFIRM_MODEL() {
    const blockData = this.getSelectedBlockData();
    const tempRowSeat = [];
    this.multiSelectedSeats.forEach(ele => {
      blockData.seatsRow.forEach(row => {
        const index = row.seats.findIndex(obj => obj.id === ele.children[0].id);
        if (index !== -1) {
          const rowExist = tempRowSeat.findIndex(obj => obj.rowId === row.id);
          if (rowExist !== -1) {
            tempRowSeat[rowExist].seatObj.push(_.cloneDeep(row.seats[index]));
          } else {
            tempRowSeat.push({
              rowId: row.id,
              seatObj: [_.cloneDeep(row.seats[index])]
            });
          }
        }
      });
    });
    let lastRowCount = 0;
    tempRowSeat.forEach(obj => {
      const lastSelectedSeatFromRow = obj.seatObj[obj.seatObj.length - 1];
      const rowIndex = blockData.seatsRow.findIndex(obj1 => obj1.id === obj.rowId);
      const seatIndex = blockData.seatsRow[rowIndex].seats.findIndex(seat => seat.id === lastSelectedSeatFromRow.id);
      if (blockData.seatsRow[rowIndex].seats[blockData.seatsRow[rowIndex].seats.length - 1].id === lastSelectedSeatFromRow.id) {
        lastRowCount++;
      }
    });
    return tempRowSeat.length === lastRowCount;
  }

  private IS_SELECTED_BLOCK_ROWS_OVERLAPPING() {
    const blockData = this.getSelectedBlockData();
    const tempGroup = CommonService.createGroupElement(this.mainGroup as any);
    const tempBoundary = [];
    let isIntersect = false;
    if (!blockData) {
      this.toastR.error('Block not selected', 'Error');
    }
    const parentElement = this.blockShapeElement.parentElement;
    blockData.seatsRow.forEach(row => {
      const element: any = parentElement.querySelector(`#${row.id}`);
      const bBox = element.getBBox();
      const rect = CommonService.createRectElement(tempGroup, bBox.x, bBox.y, bBox.width, bBox.height,
        'canMove', 'none', 'none');
      tempBoundary.push(rect);
    });
    mainLoop:
      // tslint:disable-next-line:forin
      for (const i in tempBoundary) {
        for (const j in tempBoundary) {
          if (!(i <= j)) {
            if (CommonService.isShapesIntersect(tempBoundary[i], tempBoundary[j])) {
              isIntersect = true;
              break mainLoop;
            }
          }
        }
      }
    tempGroup.remove();
    return isIntersect;

  }
  private IS_SEATS_OVERLAPPING_SELECTED_ROW() {
    const blockData = this.getSelectedBlockData();
    if (!blockData) {
      this.toastR.error('Block not selected', 'Error');
    }
    const parentElement = this.blockShapeElement.parentElement;
    const selectedRowData = this.getSeatsRowDataFromSelectedBlock(this.selectedSeatsRow.id);
    const otherSeatsElements = [];
    blockData.seatsRow.forEach(rowData => {
      if (rowData.id !== selectedRowData.id) {
          rowData.seats.forEach(seats => {
            const element = parentElement.querySelector(`#${seats.id}`);
            otherSeatsElements.push(element);
          });
      }
    });
    console.log(otherSeatsElements);
  }
}
