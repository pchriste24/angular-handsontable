
import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import * as Handsontable from 'handsontable';
import { HotTableComponent } from '@handsontable/angular';

@Component({
  selector: 'app-hands-on-table',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './hands-on-table.component.html',
  styleUrls: ['./hands-on-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandsOnTableComponent implements OnInit, AfterViewInit {
  columnType = COLUMN_TYPE;
  columns: any[] = [
    { data: 'relationshipValue', title: 'Relationship', type: COLUMN_TYPE.DROPDOWN, source: ['Employee', 'Spouse', 'Child'] },
    { data: 'firstName', title: 'First Name', type: COLUMN_TYPE.TEXT },
    {
      data: 'employmentStatus', title: 'Employment Status', type: COLUMN_TYPE.DROPDOWN, source: ['Active', 'Cobra'],
      readOnlyTriggers: [{ colIndex: 0, values: ['Spouse', 'Child'] }]
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
  @ViewChild('hot') hot: HotTableComponent;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // console.log(this.hot);
    // this.hot.afterChange({
    //   cells: function (row, col, prop) {
    //     console.log('checking');
    //     const cellProperties = { readOnly: false };
    //     if (this.hot.getDataAtCell(row, col) === 'readOnly') {
    //       cellProperties.readOnly = true;
    //     }
    //     return cellProperties;
    //   }
    // }, false);

    this.hot.afterChange = (changes: any[], source: string) => {
      changes.forEach(([row, prop, oldValue, newValue]) => {
        // console.log(row);
      });
    };
  }


  cellRenderer = (hotInstance, td: HTMLElement, row: number, column: number, prop: number, value: any, cellProperties) => {
    console.log('checked')
    if (this.columns[column].readOnlyTriggers) {
      this.columns[column].readOnlyTriggers.forEach(trigger => {
        if (trigger.values.indexOf(hotInstance.getDataAtCell(row, trigger.colIndex)) >= 0) {
          cellProperties.readOnly = true;
          hotInstance.setDataAtCell(row, column, undefined, 'edit');
          hotInstance.setCellMeta(row, column, 'className', 'disabledCell');
        } else {
          cellProperties.readOnly = false;
        }
      });
    }
    Handsontable.renderers.TextRenderer.apply(this, [hotInstance, td, row, column, prop, value, cellProperties]);
  }

  updateSettings(row, col, prop) {
    // console.log(row, col, prop);
  }

  onAfterChange = (hotInstance, changes, source) => {
    // console.log(hotInstance)
    // if (!changes) { return; }
    // console.log('Old value: ', changes[0][2]);
    // console.log('New value: ', changes[0][3]);
  }
}

export enum COLUMN_TYPE {
  TEXT = 1,
  DROPDOWN = 2
}
