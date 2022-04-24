import prisma from "../prisma";
import InputUnitDTO from "../models/DTO/Unit/InputUnitDTO";
import Roles from "../models/enums/Roles";
import CustomError from "../utils/CustomError";
import ReturningDataValidationOptions from "../models/DTO/Unit/ReturningDataValidationOptions";
import UnitDTO from "../models/DTO/Unit/UnitDTO";
import RequesterData from "../models/DTO/Unit/RequesterData";
import UpdateUnitDTO from "../models/DTO/Unit/UpdateUnitDTO";
import Unit from "../models/entities/Unit";
import DeleteResponseDTO from "../models/DTO/Unit/DeleteResponseDTO";

export default class UnitService {
    public async CreateUnit(reqData:RequesterData, unitData: InputUnitDTO ) {
        try {
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
                    owner: {
                        include: {
                            workers: true,
                        }
                    },
                },
            });
            return UnitDTO.MapToDTO(unit);
        } catch (e) {
            throw e;
        }
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
                owner: {
                    include: {
                        workers: true
                    }
                },
            }
        });
        return UnitDTO.MapToDTO(updated);
    }

    public async ListUnits(ownerId: string) {
        const units = await prisma.unit.findMany({ where: { ownerId },include: { owner: { include: { workers: true } }, assets: true } });
        return await Promise.all(units.map((unit) => UnitDTO.MapToDTO(unit)));
    }

    public async GetUnit(id: string, ownerId: string) {
        const unit = await prisma.unit.findFirst({ where: { id, ownerId } , include: { owner: {
            include: {
                workers: true
            }
                }, assets: true } });
        if (!unit) throw CustomError.EntityNotFound('unit not found at this company ');
        return UnitDTO.MapToDTO(unit);
    }

    public async DeleteUnit(id: string, reqData: RequesterData) {
        try {
            await this.ValidateManagerCompany(reqData);
            await prisma.unit.delete({
                where: {
                    id
                }
            });
            return new DeleteResponseDTO('unit deleted successfully');
        } catch (e) {
            if (e.code === 'P2025') throw CustomError.EntityNotFound('unit does not exist');
            throw e;
        }
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
        if (!manager) throw CustomError.BadRequest('you need to be a unitManager to update unit data');
        if (options?.return.company) return company;
        if (options?.return.manager) return manager;
    }
}