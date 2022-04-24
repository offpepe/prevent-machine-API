import prisma from "../prisma";
import Roles from "../models/enums/Roles";
import CompanyDTO from "../models/DTO/CompanyDTO";
import CustomError from "../utils/CustomError";
import InputNewMemberDTO from "../models/DTO/InputNewMemberDTO";
import RemoveMembersResponse from "../models/DTO/RemoveMembersResponse";

// TODO dependency injection HERE!
export default class CompanyService {
    public async RegisterCompany(name: string, managerId: string) {
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

    public async IncludeMembersRange(managerId: string, companyId: string, newMembers: [InputNewMemberDTO]) {
        try {
            await this.ValidateManager(managerId, companyId);
            await this.CompanyById(companyId);
            await Promise.all(newMembers.map(async (member) => this.IncludeMember(member, companyId)));
            return CompanyDTO.MapToDTO(await this.CompanyById(companyId));
        } catch (e) {
            console.error(e);
            if (e instanceof CustomError) throw e;
            throw CustomError.Internal();
        }
    }

    public async ListAllMembers() {
        try {
            const companies = await prisma.company.findMany({ include: { workers: true } });
            return await Promise.all<CompanyDTO>(companies.map((company) => CompanyDTO.MapToDTO(company)));
        } catch (e) {
            throw CustomError.Internal()
        }
    }

    public async RemoveMembersRange(managerId: string, companyId: string, users: [string]) {
        try {
            await this.ValidateManager(managerId, companyId);
            await this.CompanyById(companyId);
            await Promise.all(users.map((user) => this.RemoveMember(companyId, user)));
            return new RemoveMembersResponse('members removed sucessfully');
        } catch (e) {
            if (e instanceof CustomError) throw e;
            throw CustomError.Internal();
        }
    }


    protected async RemoveMember(companyId: string, userId: string) {
        const user = prisma.user.findFirst({
            where: {
                id: userId,
                companyId: companyId,
            }
        });
        if (!user) throw CustomError.BadRequest(`user ${userId} is not part of this company`);
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                companyId: null,
                role: Roles.unregistered,
            }
        });
    }

    protected async IncludeMember({ id, role }: InputNewMemberDTO, companyId: string) {
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

    protected async ValidateManager(managerId: string, companyId: string) {
        const manager = await prisma.user.findFirst({
            where: {
                id: managerId,
                companyId,
                role: Roles.companyManager,
            }
        });
        if (!manager) throw CustomError.BadRequest('you need to be a manager to include members on company');
    }

    protected async CompanyById(companyId: string) {
        const company = await prisma.company.findUnique({
            where: {
                id: companyId,
            },
            include: {
                workers: true,
            }
        });
        if (!company) throw CustomError.EntityNotFound('company not found');
        return company;
    }

}