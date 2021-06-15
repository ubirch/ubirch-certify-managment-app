export class ErrorBase {
    constructor(
        public message: string,
        public title: string,
        public code?: number,
    ) { }

}
