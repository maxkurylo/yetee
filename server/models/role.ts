import {Schema, model, UpdateWriteOpResult} from 'mongoose';
import {IRole, IRoleDocument, IRoleModel} from "../typings/role";


const UserAuthoritiesSchema = new Schema<IRole>({
    name:        { type: String, required: true, unique: true },
    permissions: { type: [String], required: true }
});

const Roles = model<IRoleDocument, IRoleModel>('Roles', UserAuthoritiesSchema);

export function getRoleByName (roleName: string): Promise<IRoleDocument | null> {
    return Roles.findOne({ name: roleName }).exec();
}

export function getAllRoles(projection: any = {}): Promise<IRoleDocument[]> {
    return Roles.find({}, projection).exec();
}

export function addRole (role: IRole): Promise<IRoleDocument> {
    const newRole = new Roles(role);
    return newRole.save();
}

export function removeRoleByName (roleName: string): Promise<any> {
    return Roles.deleteOne({ name: roleName }).exec();
}

export function editRolePermissions (roleName: string, permissions: string[]): Promise<UpdateWriteOpResult> {
    return Roles.updateOne({ role: roleName }, { $set: { permissions } }).exec();
}
