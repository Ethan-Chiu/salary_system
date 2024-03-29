import { z } from "zod";

export enum RolesEnumType {
	"Admin",
	"Operator",
	"User",
}

export const RolesEnum = z.nativeEnum(RolesEnumType);
