import * as Handsontable from 'handsontable';

export interface RequiredTrigger {
    data: string;
    values: string[];
}

export interface EnabledTrigger {
    data: string;
    values: string[];
}
export interface SecondaryRequiredTrigger {
    data: string;
    values: string[];

    requiredBackgroundColor: string;
}

export interface HotColumn {
    data: string;
    title: string;
    type: string;
    columnType: COLUMN_TYPE;
    source?: string[];
    requiredTriggers?: RequiredTrigger[];
    enabledTriggers?: EnabledTrigger[];
    secondaryRequiredTrigger?: SecondaryRequiredTrigger[];
    validator?: Function;
    editor?: any;
}

export enum COLUMN_TYPE {
    TEXT = 1,
    DROPDOWN = 2,
    DATE = 3,
    SSN = 4
}
