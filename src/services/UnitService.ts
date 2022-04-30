import prisma from "../prisma";
import InputUnitDTO from "../models/DTO/Unit/InputUnitDTO";
import Roles from "../models/enums/Roles";
import CustomError from "../utils/CustomError";
import ReturningDataValidationOptions from "../models/DTO/Unit/ReturningDataValidationOptions";
import UnitDTO from "../models/DTO/Unit/UnitDTO";
import RequestData from "../models/DTO/Base/RequestData";
import UpdateUnitDTO from "../models/DTO/Unit/UpdateUnitDTO";
import Unit from "../models/entities/Unit";
import DeleteResponseDTO from "../models/DTO/Unit/DeleteResponseDTO";
import BaseService from "./BaseService";

export default class UnitService extends BaseService{
    public async CreateUnit(reqData:RequestData, unitData: InputUnitDTO ) {
        try {
            await UnitService.ValidateManager(reqData);
            const unit = await prisma.unit.create({
                data: {
                    ...unitData,
                    owner: {
                        connect: {
                            id: reqData.ownerId,
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

    public async UpdateUnit(reqData: RequestData, unitId: string, updatedData: UpdateUnitDTO) {
        try {
            await UnitService.ValidateManager(reqData);
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
        } catch (e) {
            if (e.code === 'P2025') throw CustomError.EntityNotFound('unit does not exist');
            throw e;
        }
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

    public async DeleteUnit(id: string, reqData: RequestData) {
        try {
            await UnitService.ValidateManager(reqData);
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
}