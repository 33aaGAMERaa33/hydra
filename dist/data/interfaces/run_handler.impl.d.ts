import { HandlerParameters } from "../types/handler_parameters.type";
export interface RunHandlerImpl {
    runHandler(parameters: HandlerParameters): any;
}
