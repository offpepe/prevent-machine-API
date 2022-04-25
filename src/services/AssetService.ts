import CreateAssetDTO from "../models/DTO/Asset/CreateAssetDTO";
import RequestData from "../models/DTO/Base/RequestData";
import BaseService from "./BaseService";
import prisma from "../prisma";
import AssetDTO from "../models/DTO/Asset/AssetDTO";
import UpdateAssetDTO from "../models/DTO/Asset/UpdateAssetDTO";
import ReturningDataValidationOptions from "../models/DTO/Unit/ReturningDataValidationOptions";
import CustomError from "../utils/CustomError";
import Roles from "../models/enums/Roles";

export default class AssetService extends BaseService {
    public async CreateAsset(assetData: CreateAssetDTO, requestData: RequestData ) {
        await AssetService.ValidateManagerCompany(requestData);
        const asset = await prisma.asset.create({
            data: {
                ...assetData,
                owner: { connect: {
                        id: requestData.ownerId,
                    }}
            },
            include: {
                owner: true
            }
        });
        return AssetDTO.MapToDTO(asset);
    }
    public async UpdateAsset(id: string, reqData:RequestData ,updateData: UpdateAssetDTO) {
        await AssetService.ValidateManagerCompany(reqData);
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
        await AssetService.ValidateManagerCompany(reqData);
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
        await AssetService.ValidateManagerCompany(reqData);
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
        await AssetService.ValidateManagerCompany(reqData);
        await prisma.asset.delete({
            where: {
                id
            }
        });
        return { message: 'asset deleted successfullys' };
    }
}