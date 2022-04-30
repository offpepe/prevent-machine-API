import RequestData from "../models/DTO/Base/RequestData";
import ReturningDataValidationOptions from "../models/DTO/Unit/ReturningDataValidationOptions";
import prisma from "../prisma";
import CustomError from "../utils/CustomError";
import Roles from "../models/enums/Roles";

export default class BaseService {
    protected static async ValidateManager({ ownerId, managerId }: RequestData, options?: ReturningDataValidationOptions) {
        const owner = await prisma.company.findUnique({ where: { id: ownerId }, include: { workers: true } });
        if (!owner) throw CustomError.EntityNotFound('company not found');
        const [manager] = owner
            .workers.filter((worker) =>
                worker.role === Roles.companyManager || worker.role === Roles.companyManager
                && worker.id === managerId);
        if (!manager)
            throw CustomError.BadRequest('you need to be a unitManager to update unit or asset data');
        if (options?.return.company) return owner;
        if (options?.return.manager) return manager;
        return;
    }
}