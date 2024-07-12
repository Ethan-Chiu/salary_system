import { useTranslation } from "react-i18next";

export function modeDescription(mode: string) {
    const { t } = useTranslation(['common']);
    switch (mode) {
        case "create":
            return t("others.create_msg");
        case "update":
            return t("others.update_msg");
        case "delete":
            return t("others.delete_msg");
        case "auto_calculate":
            return t("others.auto_calculate_msg");
        default:
            return "";
    }
}