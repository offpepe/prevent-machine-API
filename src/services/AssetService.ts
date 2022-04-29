import CreateAssetDTO from "../models/DTO/Asset/CreateAssetDTO";
import RequestData from "../models/DTO/Base/RequestData";
import BaseService from "./BaseService";
import prisma from "../prisma";
import AssetDTO from "../models/DTO/Asset/AssetDTO";
import UpdateAssetDTO from "../models/DTO/Asset/UpdateAssetDTO";
import AssetStatus from "../models/enums/AssetStatus";
import assetStatus from "../models/enums/AssetStatus";
import ReturningDataValidationOptions from "../models/DTO/Unit/ReturningDataValidationOptions";
import CustomError from "../utils/CustomError";
import Roles from "../models/enums/Roles";
import EmailService from "./EmailService";
import {UserDTO} from "../models/DTO/User/UserDTO";
import UserDTOTiny from "../models/DTO/User/UserDTO.tiny";

const emailService = new EmailService();
export default class AssetService extends BaseService {
    public async CreateAsset(assetData: CreateAssetDTO, requestData: RequestData) {
        await this.ValidateManager(requestData);
        const asset = await prisma.asset.create({
            data: {
                ...assetData,
                owner: {
                    connect: {
                        id: requestData.ownerId,
                    }
                }
            },
            include: {
                owner: true
            }
        });
        return AssetDTO.MapToDTO(asset);
    }

    public async UpdateAsset(id: string, reqData: RequestData, updateData: UpdateAssetDTO) {
        await this.ValidateManager(reqData);
        const updated = await prisma.asset.update({
            where: {
                id,
            },
            data: {
                ...updateData
            },
            include: {
                owner: true,
            },
        });
        return AssetDTO.MapToDTO(updated);
    }

    public async ListAssets(reqData: RequestData) {
        await this.ValidateManager(reqData);
        const assets = await prisma.asset.findMany({
            where: {
                ownerId: reqData.ownerId,
            },
            include: {
                owner: true,
            }
        });
        return assets.map((asset) => AssetDTO.MapToDTO(asset));
    }

    public async GetAssetById(reqData: RequestData, id: string) {
        console.log(reqData);
        await this.ValidateManager(reqData);
        const asset = await prisma.asset.findUnique({
            where: {
                id,
            },
            include: {
                owner: true,
            }
        });
        return AssetDTO.MapToDTO(asset);
    }

    public async DeleteAsset(reqData: RequestData, id: string) {
        await this.ValidateManager(reqData);
        await prisma.asset.delete({
            where: {
                id
            }
        });
        return {message: 'asset deleted successfully'};
    }

    public async ChangeHealthLevel(healthLevel: number, assetId: string) {
        const statusAsset = this.CalculateStatus(healthLevel);
        console.log(assetId);
        const asset = await prisma.asset.update({
            where: {
                id: assetId,
            },
            data: {
                healthLevel: healthLevel,
                status: statusAsset,
            },
            include: { owner: { include: { owner: { include: { workers: true } } } } }
        });
        const assetDTO = AssetDTO.MapToDTO(asset);
        if (statusAsset == AssetStatus.Alerting || statusAsset == AssetStatus.Stopped) {
            const workers = asset.owner.owner.workers;
            await Promise.all(workers.map(async (worker) => {
                await emailService.SendWarningReport(UserDTOTiny.MapToDTO(worker), assetDTO);
                return true;
            }));
        }
        return assetDTO;
    }

    protected CalculateStatus(healthLevel: number) {
        if (healthLevel >= 0.6) return AssetStatus.Running;
        if (healthLevel > 0.2 && healthLevel < 0.6) return AssetStatus.Alerting;
        if (healthLevel <= 0.2) return assetStatus.Stopped;
    }

    protected async ValidateManager({ownerId, managerId}: RequestData, options?: ReturningDataValidationOptions) {
        console.log(ownerId);
        const unit = await prisma.unit.findUnique({where: {id: ownerId}, include: {owner: {include: {workers: true}}}});
        if (!unit) throw CustomError.EntityNotFound('unit not found');
        if (!unit.owner.workers.some((worker) => worker.id === managerId))
            throw CustomError.BadRequest('you need to be a unitManager to update unit or asset data');
        const manager = await prisma.user.findFirst({
            where: {
                id: managerId,
                OR: [{role: Roles.companyManager}, {role: Roles.unitManager}],
            },
            include: {
                company: {
                    include: {
                        units: true
                    }
                }
            }

        });
        if (options?.return.company) return unit;
        if (options?.return.manager) return manager;
        return;
    }
}