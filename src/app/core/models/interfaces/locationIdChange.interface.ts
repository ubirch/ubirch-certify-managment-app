import {LocationIdChangesStates} from "../enums/location-id-changes-states.enum";

export interface ILocationIdChange {
    "oldExternalId": string,
    "newExternalId": string,
    "status": LocationIdChangesStates,
    "changedAt": string,  //when the user changed the externalId
    "deleteAt": string    //(optional), when the oldExternalId will be deleted
    "jobFlowId": string,
}
