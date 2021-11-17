export class ConfirmDialogModel {
    constructor(
        public title: string = 'dialog.defaultTitle',
        public message: string = 'dialog.defaultMessage',
        public yes: string = 'dialog.yesLabel',
        public no: string = 'dialog.noLabel',
        public ok: string = 'dialog.okLabel',
        public okOnly: boolean = false
    ) { }

    static create(data: Partial<ConfirmDialogModel>) {
        return Object.assign(new ConfirmDialogModel(), data);
    }
}
