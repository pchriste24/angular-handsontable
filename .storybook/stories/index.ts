import { storiesOf, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { HotTableModule } from '@handsontable/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { withSource } from '../addons/index';
import { HandsOnTableComponent } from '../../src/components/hands-on-table/hands-on-table.component';

storiesOf('HandsOnTable', module)
    .addDecorator(withSource)
    .addDecorator(
        moduleMetadata({
            imports: [
                CommonModule,
                HotTableModule.forRoot(),
                BrowserAnimationsModule,
                MatDividerModule,
                MatCardModule
            ]
        }),
    )
    .add('with some data', () => ({
        component: HandsOnTableComponent,
        props: {

        }
    }));
