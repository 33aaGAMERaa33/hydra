import { Definition } from "../../interfaces/definition.impl";

export class InjectableDefinition<T = any> implements Definition<T> {
    readonly instance: T;

    constructor(data: {
        instance: T,
    }) {
        this.instance = data.instance;
    }
}