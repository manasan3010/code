import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AllocatedTable, TableType, Config } from '../../shared/models/Shape';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  tables: TableType[] = [];
  allocatedTable: AllocatedTable;
  confiqTables: Config;
  config: any;
  table: AllocatedTable;
  getAllTables$ = new BehaviorSubject<TableType[]>(this.tables);
  getAllAllocatedTables$ = new BehaviorSubject<Config>(this.confiqTables);
  getAllocatedTable$ = new BehaviorSubject<any>(null);



  constructor() {
    if (this.getLocalStoreData()) {
      const tables = JSON.parse(localStorage.getItem('tables'));
      this.tables = tables;
      this.getAllTables$.next(this.tables);
    }
    if (this.getAllocatedTablesData()) {
      this.config = JSON.parse(localStorage.getItem('configTables'));
      this.allocatedTable = this.config.tables;
      this.getAllAllocatedTables$.next(this.config);
    }
  }

  editTables(id) {
    const index = this.tables.findIndex(x => x.id === id);
    return this.tables[index];
  }

  updateTable(table) {
    const index = this.tables.findIndex(x => x.id === table.id);
    this.tables[index] = table;
    this.getAllTables$.next(this.tables.slice());
    this.storeTempData();
  }

  createTable(table: TableType) {
    this.tables.push(table);
    this.getAllTables$.next(this.tables.slice());
    this.storeTempData();
  }

  editAllocatedTable(editedTable: AllocatedTable) {
    this.getAllocatedTable$.next(editedTable);
  }

  deleteTable(table) {
    const index = this.tables.findIndex(x => x.id === table.id);
    this.tables.splice(index, 1);
    this.getAllTables$.next(this.tables.slice());
    this.storeTempData();
  }

  storeTempData() {
    localStorage.setItem('tables', JSON.stringify(this.tables));
  }

  getLocalStoreData() {
    const table = JSON.parse(localStorage.getItem('tables'));
    return !!table;
  }

  getAllocatedTablesData() {
    const config = JSON.parse(localStorage.getItem('configTables'));
    return !!config;

  }


  updateLocalStore(config: Config) {
    this.confiqTables = config;
    this.getAllAllocatedTables$.next(this.confiqTables);
    this.storeLocal();
  }
  private storeLocal() {
    localStorage.setItem('configTables', JSON.stringify(this.confiqTables));
  }
}
