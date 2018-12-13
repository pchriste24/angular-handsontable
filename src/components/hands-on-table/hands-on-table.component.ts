
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import * as Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { validate, validatorTypes } from '../../shared/validatorFns';
import SSNCustomEditor from './editors/hot-ssn-editor';
import { COLUMN_TYPE, HotColumn } from './hot.models';

/**
  * Example of usage:
  * @example
  * <app-hands-on-table></app-hands-on-table>
  *
  * <example-url>./hands-on-table.component.html</example-url>
  */
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
  columns: HotColumn[] = [
    {
      data: 'relationshipValue', title: 'Relationship', type: 'dropdown',
      columnType: COLUMN_TYPE.DROPDOWN, source: ['Employee', 'Spouse', 'Child']
    },
    { data: 'firstName', title: 'First Name', type: 'text', columnType: COLUMN_TYPE.TEXT },
    {
      data: 'email', title: 'Email', type: 'text', columnType: COLUMN_TYPE.TEXT, validator: validate([validatorTypes.EMAIL]),
      secondaryRequiredTrigger: [{ data: 'relationshipValue', values: ['Employee'], requiredBackgroundColor: '#42f465' }]
    },
    {
      data: 'dateOfBirth', title: 'Birth Date', type: 'date', columnType: COLUMN_TYPE.DATE,
      requiredTriggers: [{ data: 'relationshipValue', values: ['Employee'] }]
    },
    {
      data: 'employmentStatus', title: 'Employment Status', type: 'dropdown', columnType: COLUMN_TYPE.DROPDOWN, source: ['Active', 'Cobra'],
      enabledTriggers: [{ data: 'relationshipValue', values: ['Employee'] }]
    },
    {
      data: 'ssn', title: 'SSN', type: 'text', columnType: COLUMN_TYPE.SSN, editor: SSNCustomEditor,
      validator: validate([validatorTypes.REQUIRED, validatorTypes.SSN])
    },
  ];

  dataset: any[] = [
    { index: 1, firstName: 'Ted', address: 'Wall Street', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 2, firstName: 'Frank', address: 'Pennsylvania Avenue', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 3, firstName: 'Joan', address: 'Broadway', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 4, firstName: 'Gail', address: 'Bourbon Street', employmentStatus: 'Active', relationshipValue: 'Spouse' },
    { index: 5, firstName: 'Michael', address: 'Lombard Street', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 6, firstName: 'Mia', address: 'Rodeo Drive', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 7, firstName: 'Cora', address: 'Sunset Boulevard', employmentStatus: 'Active', relationshipValue: 'Employee' },
    { index: 8, firstName: 'Jack', address: 'Michigan Avenue', employmentStatus: 'Active', relationshipValue: 'Employee' },
  ];

  @Input() allowAddRows = false;

  constructor(private _hotRegisterer: HotTableRegisterer, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    console.log(JSON.stringify(this.columns));
  }

  getColIndex(prop: string): number {
    return this.columns.indexOf(this.columns.find(c => c.data === prop));
  }

  cellRenderer = (hotInstance: Handsontable, td: HTMLElement, row: number, column: number, prop: number, value: any, cellProperties) => {
    Handsontable.renderers.TextRenderer.apply(this, [hotInstance, td, row, column, prop, value, cellProperties]);
    let cellClassName = hotInstance.getCellMeta(row, column).className;
    if (cellClassName) {
      cellClassName = cellClassName.toString().split(' ');
    } else {
      cellClassName = [];
    }

    for (let index = 0; index < cellClassName.length; index++) {
      const className = cellClassName[index].trim();
      if (className.indexOf('background-color-') > -1) {
        const newBackGroundColor = className.replace('background-color-', '');
        td.style.backgroundColor = newBackGroundColor;
      }
    }

  }

  onRemoveRows = (hotInstance: Handsontable, startIndex: number, amount: number, physicalRows: number[], source: string) => {

    // This is where will make sure that if an employee is deleted then all of the employees dependents are
    // being deleted as well.

    let orphanedDependent = false;
    let employeeDeleted = false;
    for (let index = startIndex; index < this.dataset.length; index++) {
      const person = this.dataset[index];
      if (index <= (startIndex + amount)) {
        if (person.relationshipValue === 'Employee') {
          employeeDeleted = true;
          orphanedDependent = false;
        } else {
          if (employeeDeleted) {
            orphanedDependent = true;
          }
        }
      }

      if (employeeDeleted) {

      }

    }

    this.dataset.splice(startIndex, amount);
    const rowsToCheck = Array.from(Array(hotInstance.countRows()).keys());
    this.checkRowsForTriggers(hotInstance, rowsToCheck);
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
      const rowsToCheck = Array.from(Array(hotInstance.countRows()).keys());
      this.checkRowsForTriggers(hotInstance, rowsToCheck);
    }
  }

  checkRowsForTriggers(hotInstance: Handsontable, rows: number[]) {
    let columnIndex: number;
    rows.forEach(row => {
      this.columns.forEach(col => {
        if (col.requiredTriggers) {
          columnIndex = this.columns.indexOf(col);
          col.requiredTriggers.forEach(trigger => {
            if (trigger.values.indexOf(hotInstance.getDataAtRowProp(row, trigger.data)) >= 0) {
              this.requireCell(hotInstance, row, columnIndex);
            } else {
              this.unrequireCell(hotInstance, row, columnIndex);
            }
          });
        }
        if (col.enabledTriggers) {
          col.enabledTriggers.forEach(trigger => {
            columnIndex = this.columns.indexOf(col);
            if (trigger.values.indexOf(hotInstance.getDataAtRowProp(row, trigger.data)) >= 0) {
              this.enableCell(hotInstance, row, columnIndex);
            } else {
              this.disableCell(hotInstance, row, columnIndex);
            }
          });
        }
        if (col.secondaryRequiredTrigger) {
          col.secondaryRequiredTrigger.forEach(trigger => {
            columnIndex = this.columns.indexOf(col);
            if (trigger.values.indexOf(hotInstance.getDataAtRowProp(row, trigger.data)) >= 0) {
              hotInstance.setCellMeta(row, columnIndex, 'className', 'background-color-' + trigger.requiredBackgroundColor);
            } else {
              hotInstance.setCellMeta(row, columnIndex, 'className', '');
            }
          });
        }
      });
    });
    this.cdr.detectChanges();
  }

  disableCell(hotInstance: Handsontable, row: number, cell: number) {
    console.log('Disabled ' + row + ' : ' + cell);
    hotInstance.setCellMeta(row, cell, 'className', 'disabledCell');
    hotInstance.setCellMeta(row, cell, 'readonly', 'true');
    hotInstance.setCellMeta(row, cell, 'fillHandle', 'false');
    hotInstance.setDataAtCell(row, cell, undefined, 'dontcheck');
  }

  enableCell(hotInstance: Handsontable, row: number, cell: number) {
    console.log('Enabled ' + row + ' : ' + cell);
    hotInstance.setCellMeta(row, cell, 'readonly', 'false');
    hotInstance.setCellMeta(row, cell, 'fillHandle', 'true');
    hotInstance.setCellMeta(row, cell, 'className', '');
    // called to rerender the cell after enabling
    hotInstance.setDataAtCell(row, cell, hotInstance.getDataAtCell(row, cell), 'dontcheck');

  }
  requireCell(hotInstance: Handsontable, row: number, cell: number) {
    console.log('Required ' + row + ' : ' + cell);

    hotInstance.setCellMeta(row, cell, 'required', 'true');
  }
  unrequireCell(hotInstance: Handsontable, row: number, cell: number) {
    console.log('Unrequired ' + row + ' : ' + cell);

    hotInstance.setCellMeta(row, cell, 'required', 'true');
  }
  getEditorType(colIndex: number) {
    switch (this.columns[colIndex].columnType) {
      case COLUMN_TYPE.SSN:
        return SSNCustomEditor;
        break;
      case COLUMN_TYPE.DATE:
      case COLUMN_TYPE.DROPDOWN:
      case COLUMN_TYPE.TEXT:
        return 'text';
    }
  }
}


