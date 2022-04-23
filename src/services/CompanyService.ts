import prisma from "../prisma";
import Roles from "../models/enums/Roles";
import {UserDTO} from "../models/DTO/UserDTO";
import CompanyDTO from "../models/DTO/CompanyDTO";
import CustomError from "../utils/CustomError";

export default class CompanyService {
    async RegisterCompany(name: string, managerId: string) {
        const user = await prisma.user.findUnique({where: {id: managerId}});
        if (!user) throw CustomError.EntityNotFound('user does not exists');
        const updatedManager = await prisma.user.update({
            where: {id: managerId},
            data: {role: Roles.companyManager}
        });
        const company = await prisma.company.create({
            data: {
                name,
                workers: {
                    connect: {id: managerId}
                }
            }
        });
        return new CompanyDTO(company.id, name, [UserDTO.MapToDTO(updatedManager)])
    }
}