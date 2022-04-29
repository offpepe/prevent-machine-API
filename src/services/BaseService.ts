import RequestData from "../models/DTO/Base/RequestData";
import ReturningDataValidationOptions from "../models/DTO/Unit/ReturningDataValidationOptions";
import prisma from "../prisma";
import CustomError from "../utils/CustomError";
import Roles from "../models/enums/Roles";

export default class BaseService {
    protected static async ValidateManager({ ownerId, managerId }: RequestData, options?: ReturningDataValidationOptions) {
        let owner = await prisma.company.findUnique({ where: { id: ownerId } });
        if (!owner && options.include.unit) {
            owner = await prisma.unit.findUnique({ where: { id: ownerId } });
            if (!owner) throw CustomError.EntityNotFound('unit or company not found');
        }  else {
            throw CustomError.EntityNotFound('company not found');
        }
        const manager = await prisma.user.findFirst({
            where: {
                id: managerId,
                OR: [{ role: Roles.companyManager }, { role: Roles.unitManager }],
            }
        });
        if (!manager) throw CustomError.BadRequest('you need to be a unitManager to update unit or asset data');
        if (options?.return.company) return owner;
        if (options?.return.manager) return manager;
        return;
    }
}