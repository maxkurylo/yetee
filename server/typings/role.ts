import {Document, Model} from 'mongoose';

export interface IRole {
    name: string;
    permissions: string[];
}

export interface IRoleDocument extends IRole, Document {

}

export interface IRoleModel extends Model<IRoleDocument> {
    getRoleByName: (roleName: string) => Promise<IRoleDocument | null>;
    addRole: (role: IRole) => Promise<IRoleDocument>;
    removeRoleByName: (roleName: string) => Promise<any>;
    editRolePermissions: (roleName: string, permissions: string[]) => Promise<IRoleDocument | null>;
}