import { ListAction } from '../enums/list-actions.enum';

export interface IAction<T> {
    value: ListAction;
    label: string;
    predicate?: (item: T) => boolean;
}
