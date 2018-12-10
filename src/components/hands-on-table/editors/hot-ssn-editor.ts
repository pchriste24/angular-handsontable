import * as Handsontable from 'handsontable';

export default class SSNCustomEditor extends Handsontable.editors.TextEditor {
    saveValue(newValue, ctrlDown) {
        let val = newValue[0][0].replace(/\D/g, '');
        let newVal = '';
        if ((val.length > 3) && (val.length < 6)) {
            newVal += val.substr(0, 3) + '-';
            val = val.substr(3);
        }
        if (val.length > 5) {
            newVal += val.substr(0, 3) + '-';
            newVal += val.substr(3, 2) + '-';
            val = val.substr(5);
        }
        newVal += val;
        newValue[0][0] = newVal.substring(0, 11);
        Handsontable.editors.BaseEditor.prototype.saveValue.call(this, newValue, ctrlDown);
    }
    // saveValue() {
    //     console.log('saveValu')
    // }
    getValue() {
        return this.TEXTAREA.value;
    }
    focus() {
        super.focus();
        this.TEXTAREA.select();
    }
}
