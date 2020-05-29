import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Controls, SeatAllocationSelectionType, SeatingRowType, ShapeType} from '../../../shared/models/utils';
import {Block} from '../../../shared/models/Shape';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  private blocks: Block [] = [];
  selectedBlockShape$ = new BehaviorSubject<ShapeType>(undefined);
  selectedSeatingRowType$ = new BehaviorSubject<SeatingRowType>(undefined);
  seatingSelectionType$ = new BehaviorSubject<SeatAllocationSelectionType>(undefined);
  getBlocks = new BehaviorSubject<Block []>(this.blocks);
  constructor() {
    if (SeatService.IS_LOCAL_BLOCKS_DATA) {
      this.blocks = JSON.parse(localStorage.getItem('blocks'));
      this.getBlocks.next(this.blocks.slice());
    }
  }
  private static get IS_LOCAL_BLOCKS_DATA() {
    return !!JSON.parse(localStorage.getItem('blocks'));
  }
  updateBlocks(blocks: Block []) {
    this.blocks = blocks;
    this.getBlocks.next(this.blocks.slice());
    this.storeLocalData();
  }
  private storeLocalData() {
    localStorage.setItem('blocks', JSON.stringify(this.blocks));
  }

}
