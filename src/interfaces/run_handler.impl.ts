import { HandlerParameters } from "../core/types/handler_parameters.type";

export interface RunHandlerImpl {
    runHandler(parameters: HandlerParameters): any; 
}