import { Translate } from "./translation";

export function modeDescription(mode: string) {
    switch (mode) {
        case "create":
            return Translate("Fill in the parameters to create new data.");
        case "update":
            return Translate("Please select one data to update.");
        case "delete":
            return Translate("Please select one data to delete.");
        case "auto calculate":
            return Translate("Please select data to auto calculate.");
        default:
            return "";
    }
}