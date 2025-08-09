import { Definition } from "../../interfaces/definition.impl";
export declare class InjectableDefinition<T = any> implements Definition<T> {
    readonly instance: T;
    constructor(data: {
        instance: T;
    });
}
