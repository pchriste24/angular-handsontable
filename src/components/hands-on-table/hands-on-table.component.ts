
import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import * as Handsontable from 'handsontable';
import { HotTableComponent, HotTableRegisterer } from '@handsontable/angular';
import { emailValidator } from '../../shared/validatorFns';

@Component({
  selector: 'app-hands-on-table',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './hands-on-table.component.html',
  styleUrls: ['./hands-on-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandsOnTableComponent implements OnInit {
  hotID = 'handsOnTable1';
  columnType = COLUMN_TYPE;
  columns: any[] = [
    { data: 'relationshipValue', title: 'Relationship', type: COLUMN_TYPE.DROPDOWN, source: ['Employee', 'Spouse', 'Child'] },
    { data: 'firstName', title: 'First Name', type: COLUMN_TYPE.TEXT },
    { data: 'email', title: 'Email', type: COLUMN_TYPE.TEXT, validator: emailValidator },
    { data: 'dateOfBirth', title: 'Birth Date', type: COLUMN_TYPE.DATE },
    {
      data: 'employmentStatus', title: 'Employment Status', type: COLUMN_TYPE.DROPDOWN, source: ['Active', 'Cobra'],
      otherTrigger: [{ data: 'relationshipValue', values: ['Employee'] }]
    }
  ];

  dataset: any[] = [
    { index: 1, firstName: 'Ted', address: 'Wall Street', employmentStatus: 'Active', relationshipValue: 'Spouse' },
    { index: 2, firstName: 'Frank', address: 'Pennsylvania Avenue', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 3, firstName: 'Joan', address: 'Broadway', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 4, firstName: 'Gail', address: 'Bourbon Street', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 5, firstName: 'Michael', address: 'Lombard Street', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 6, firstName: 'Mia', address: 'Rodeo Drive', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 7, firstName: 'Cora', address: 'Sunset Boulevard', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 8, firstName: 'Jack', address: 'Michigan Avenue', employmentStatus: 'Active', relationshipValue: 'Employee' },
  ];
  constructor(private _hotRegisterer: HotTableRegisterer) { }

  ngOnInit() {

  }

  getColIndex(prop: string): number {
    return this.columns.indexOf(this.columns.find(c => c.data === prop));
  }

  cellRenderer = (hotInstance, td: HTMLElement, row: number, column: number, prop: number, value: any, cellProperties) => {
    Handsontable.renderers.TextRenderer.apply(this, [hotInstance, td, row, column, prop, value, cellProperties]);
  }

  onAfterChange = (hotInstance: Handsontable, changes: [[number, string, string, string]], source) => {
    if (source === 'dontcheck') {
      return;
    }
    // This event fires once for a simple edit
    // Also, this fires once for a larger paste event that spans multiple cols and rows
    // changes is a multidimensional array containing the [rowNumber, propThatWasChanged, oldValue, newValue]
    if (source !== 'loadData') {
      const rowsToCheck = changes.map(c => c[0]);
      this.checkRowsForTriggers(hotInstance, rowsToCheck);
      if (!changes) { return; }
    } else {
      // check all rows
      const rowsToCheck = Array.from(Array(hotInstance.countRows() - 1).keys());
      this.checkRowsForTriggers(hotInstance, rowsToCheck);
    }
  }

  checkRowsForTriggers(hotInstance: Handsontable, rows: number[]) {
    let columnIndex: number;
    rows.forEach(row => {
      this.columns.forEach(col => {
        if (col.readOnlyTriggers) {
          columnIndex = this.columns.indexOf(col);
          col.readOnlyTriggers.forEach(trigger => {
            if (trigger.values.indexOf(hotInstance.getDataAtCell(row, trigger.data)) >= 0) {
              this.disableCell(hotInstance, row, columnIndex);
            } else {
              this.enableCell(hotInstance, row, columnIndex);
            }
          });
        }
        if (col.otherTrigger) {
          col.otherTrigger.forEach(trigger => {
            columnIndex = this.columns.indexOf(col);
            if (trigger.values.indexOf(hotInstance.getDataAtRowProp(row, trigger.data)) >= 0) {
              this.enableCell(hotInstance, row, columnIndex);
            } else {
              this.disableCell(hotInstance, row, columnIndex);
            }
          });
        }
      });
    });
  }

  disableCell(hotInstance: Handsontable, row: number, cell: number) {
    hotInstance.setCellMeta(row, cell, 'className', 'disabledCell');
    hotInstance.setCellMeta(row, cell, 'readOnly', 'true');
    hotInstance.setCellMeta(row, cell, 'fillHandle', 'false');
    hotInstance.setDataAtCell(row, cell, undefined, 'dontcheck');
  }

  enableCell(hotInstance: Handsontable, row: number, cell: number) {
    hotInstance.setCellMeta(row, cell, 'readOnly', 'false');
    hotInstance.setCellMeta(row, cell, 'fillHandle', 'true');
    hotInstance.setCellMeta(row, cell, 'className', '');
    // called to rerender the cell after enabling
    hotInstance.setDataAtCell(row, cell, hotInstance.getDataAtCell(row, cell), 'dontcheck');

  }

}

export enum COLUMN_TYPE {
  TEXT = 1,
  DROPDOWN = 2,
  DATE = 3
}

