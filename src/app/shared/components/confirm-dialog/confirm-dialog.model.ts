export class ConfirmDialogModel {
    constructor(
        public title: string = 'dialog.defaultTitle',
        public message: string = 'dialog.defaultMessage',
        public yes: string = 'dialog.yesLabel',
        public no: string = 'dialog.noLabel',
    ) { }

    static create(data: Partial<ConfirmDialogModel>) {
        return Object.assign(new ConfirmDialogModel(), data);
    }
}
