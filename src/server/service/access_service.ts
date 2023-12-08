import { injectable } from "tsyringe";
import { RolesEnumType } from "../api/types/role_type";
import { AccessiblePagesType, accessiblePages } from "../api/types/access_page_type";
import { AccessSetting } from "../database/entity/access_setting";
import "reflect-metadata"

@injectable()
export class AccessService {
	constructor() {}

	async getAccessByRole(role: RolesEnumType | null): Promise<AccessiblePagesType> {

        if (role === null) {
            return accessiblePages.parse({});
        }

        const accessSettings = await AccessSetting.findOne({ where: {
            auth_l: role
        }});

        if (accessSettings === null) {
            return accessiblePages.parse({});
        }

        const ret = accessiblePages.parse(accessSettings);
        return ret;
	}

    async createAccessData(role: RolesEnumType, access: AccessiblePagesType) {
        await AccessSetting.create({
            auth_l: role,
            actions: access.actions,
            settings: access.settings,
            report: access.report,
            roles: access.roles,
            create_by: "system",
            update_by: "system",
        })
    }
}
