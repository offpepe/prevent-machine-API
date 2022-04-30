import prisma from "../prisma";
import Roles from "../models/enums/Roles";
import CompanyDTO from "../models/DTO/Company/CompanyDTO";
import CustomError from "../utils/CustomError";
import InputNewMemberDTO from "../models/DTO/Company/InputNewMemberDTO";
import RemoveMembersResponse from "../models/DTO/Company/RemoveMembersResponse";
import UpdateCompanyDTO from "../models/DTO/Company/UpdateCompanyDTO";

// TODO dependency injection HERE!
export default class CompanyService {
    public async RegisterCompany(name: string, description: string, managerId: string) {
        const user = await prisma.user.findUnique({where: {id: managerId}});
        if (!user) throw CustomError.EntityNotFound('user does not exists');
        await prisma.user.update({
            where: {id: managerId},
            data: {role: Roles.companyManager}
        });
        const company = await prisma.company.create({
            data: {
                name,
                description,
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
            await this.ValidateManager(managerId, companyId);
            await this.CompanyById(companyId);
            await Promise.all(newMembers.map(async (member) => this.IncludeMember(member, companyId)));
            return CompanyDTO.MapToDTO(await this.CompanyById(companyId));
    }

    public async ListAllMembers() {
            const companies = await prisma.company.findMany({ include: { workers: true } });
            return await Promise.all<CompanyDTO>(companies.map((company) => CompanyDTO.MapToDTO(company)));
    }

    public async RemoveMembersRange(managerId: string, companyId: string, users: [string]) {
            await this.ValidateManager(managerId, companyId);
            await this.CompanyById(companyId);
            await Promise.all(users.map((user) => this.RemoveMember(companyId, user)));
            return new RemoveMembersResponse('members removed sucessfully');
    }

    public async DeleteCompany(companyId:string, managerId:string) {
            await this.ValidateManager(managerId, companyId);
            await this.CompanyById(companyId);
            await prisma.user.updateMany({
                where: { companyId, },
                data: {
                    companyId: null,
                    role: Roles.unregistered,
                }});
            await prisma.company.delete({
                where: { id: companyId },
            });
            return { message: 'company deleted successfully'};
    }

    public async UpdateCompany(companyId: string, managerId: string, updatedFields: UpdateCompanyDTO  ) {
            await this.CompanyById(companyId);
            await this.ValidateManager(managerId, companyId);
            const updated = await prisma.company.update({
                where: { id: companyId },
                data: { ...updatedFields },
                include: { workers: true },
            });
            return CompanyDTO.MapToDTO(updated);
    }

    protected async RemoveMember(companyId: string, userId: string) {
        try {
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
        } catch (e) {
            if (e.code === 'P2025') throw CustomError.EntityNotFound(`user ${userId} not found`);
            throw e;
        }
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
        if (!manager) throw CustomError.BadRequest('you need to be a manager to update company data');
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
