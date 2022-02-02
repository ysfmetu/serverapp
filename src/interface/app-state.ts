import { DataState } from "../enum/data-state.enum";
import { Category } from "./category";

export interface AppState<T> {
    dataState: DataState;
    appData?: T;
    error?: string;
}