import prisma from "../prisma";
import Roles from "../models/enums/Roles";
import CompanyDTO from "../models/DTO/CompanyDTO";
import CustomError from "../utils/CustomError";
import InputNewMemberDTO from "../models/DTO/InputNewMemberDTO";


// TODO dependency injection HERE!
export default class CompanyService {
    async RegisterCompany(name: string, managerId: string) {
        const user = await prisma.user.findUnique({where: {id: managerId}});
        if (!user) throw CustomError.EntityNotFound('user does not exists');
        await prisma.user.update({
            where: {id: managerId},
            data: {role: Roles.companyManager}
        });
        const company = await prisma.company.create({
            data: {
                name,
                workers: {
                    connect: {id: managerId}
                }
            },
            include: {
                workers: true
            },
        });
        return CompanyDTO.MapToDTO(company);
    }

    async IncludeMembersRange(managerId: string, companyId: string, newMembers: [InputNewMemberDTO]) {
        try {
            const manager = await prisma.user.findFirst({
                where: {
                    id: managerId,
                    companyId,
                    role: Roles.companyManager,
                }
            });
            const company = await prisma.company.findUnique({ where: { id: companyId }, include: { workers: true } });
            if (!company) throw CustomError.EntityNotFound('company not found');
            if (!manager) throw CustomError.BadRequest('you need to be manager to include new members on company');
            await Promise.all(newMembers.map(async (member) => this.IncludeMember(member, companyId)));
            return CompanyDTO.MapToDTO(company);
        } catch (e) {
            console.error(e);
            if (e instanceof CustomError) throw e;
            throw CustomError.Internal();
        }
    }

    async ListAllMembers() {
        try {
            const companies = await prisma.company.findMany({ include: { workers: true } });
            return await Promise.all<CompanyDTO>(companies.map((company) => CompanyDTO.MapToDTO(company)));
        } catch (e) {
            throw CustomError.Internal()
        }
    }

    private async IncludeMember({ id, role }: InputNewMemberDTO, companyId: string) {
        const user = await prisma.user.findUnique({
            where: {id},
        });
        if (!user) throw CustomError.EntityNotFound(`user with id ${id}, does not exist`);
        await prisma.user.update({
            where: {id},
            data: {role,}
        });
        await prisma.company.update({
            where: {id: companyId},
            data: {
                workers: {
                    connect: {
                        id,
                    }
                }
            }
        });
    }
}