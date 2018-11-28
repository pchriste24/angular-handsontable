import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HandsOnTableComponent } from './hands-on-table/hands-on-table.component';
import { HotTableModule } from '@handsontable/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    imports: [
        CommonModule,
        HotTableModule.forRoot(),
        BrowserAnimationsModule,
        MatDividerModule,
        MatCardModule
    ],
    declarations: [
        HandsOnTableComponent
    ],
    exports: [
        HandsOnTableComponent,
        MatDividerModule,
        MatCardModule
    ],
    providers: [],
})
export class SharedModule { }
