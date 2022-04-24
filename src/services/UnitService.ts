import prisma from "../prisma";
import InputUnitDTO from "../models/DTO/Unit/InputUnitDTO";
import Roles from "../models/enums/Roles";
import CustomError from "../utils/CustomError";
import ReturningDataValidationOptions from "../models/DTO/Unit/ReturningDataValidationOptions";
import UnitDTO from "../models/DTO/Unit/UnitDTO";
import RequesterData from "../models/DTO/Unit/RequesterData";
import UpdateUnitDTO from "../models/DTO/Unit/UpdateUnitDTO";

export default class UnitService {
    public async CreateUnit(reqData:RequesterData, unitData: InputUnitDTO ) {
        await this.ValidateManagerCompany(reqData);
        const unit = await prisma.unit.create({
            data: {
                ...unitData,
                owner: {
                     connect: {
                         id: reqData.companyId,
                     }
                }
            },
            include: {
                owner: true,
            },
        });
        return UnitDTO.MapToDTO(unit);
    }

    public async UpdateUnit(reqData: RequesterData, unitId: string, updatedData: UpdateUnitDTO) {
        await this.ValidateManagerCompany(reqData);
        const updated = await prisma.unit.update({
            where: {
                id: unitId
            },
            data: {
                ...updatedData,
            },
            include: {
                owner: true,
            }
        });
        return UnitDTO.MapToDTO(updated);
    }

    protected async ValidateManagerCompany({ companyId, managerId }: RequesterData, options?: ReturningDataValidationOptions) {
        const company = await prisma.company.findUnique({ where: { id: companyId } });
        if (!company) throw CustomError.EntityNotFound('company not found');
        const manager = await prisma.user.findFirst({
            where: {
                id: managerId,
                companyId,
                OR: [{ role: Roles.companyManager }, { role: Roles.unitManager }],
            }
        });
        if (!managerId) throw CustomError.BadRequest('you need to be a unitManager to update unit data');
        if (options.return.company) return company;
        if (options.return.manager) return manager;
    }
}