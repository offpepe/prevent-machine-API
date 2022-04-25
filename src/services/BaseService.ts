import RequestData from "../models/DTO/Base/RequestData";
import ReturningDataValidationOptions from "../models/DTO/Unit/ReturningDataValidationOptions";
import prisma from "../prisma";
import CustomError from "../utils/CustomError";
import Roles from "../models/enums/Roles";

export default class BaseService {
    protected static async ValidateManagerCompany({ ownerId, managerId }: RequestData, options?: ReturningDataValidationOptions) {
        const company = await prisma.company.findUnique({ where: { id: ownerId } });
        if (!company) throw CustomError.EntityNotFound('company not found');
        const manager = await prisma.user.findFirst({
            where: {
                id: managerId,
                companyId: ownerId,
                OR: [{ role: Roles.companyManager }, { role: Roles.unitManager }],
            }
        });
        if (!manager) throw CustomError.BadRequest('you need to be a unitManager to update unit or asset data');
        if (options?.return.company) return company;
        if (options?.return.manager) return manager;
    }
}