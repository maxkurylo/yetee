import {Schema, model} from 'mongoose';
import {IResourceAuthorities, IResourceAuthoritiesDocument, IResourceAuthoritiesModel} from "../typings/authorities";


const UserAuthoritiesSchema = new Schema<IResourceAuthorities>({
    resourceId: { type: String, required: true },
    userId:     { type: String, required: true },
    role:       { type: String, required: true }
});

const UserAuthorities = model<IResourceAuthoritiesDocument, IResourceAuthoritiesModel>('Authorities', UserAuthoritiesSchema);

export function getAuthoritiesByUserId(userId: string, projection: any = {}): Promise<IResourceAuthoritiesDocument[]> {
    return UserAuthorities.find({ userId }, projection).exec();
}

export function getAuthoritiesByResourceId(resourceId: string, projection: any = {}): Promise<IResourceAuthoritiesDocument[]> {
    return UserAuthorities.find({ resourceId }, projection).exec();
}

export function getAuthoritiesByResourceIds(resourceIds: Set<string>, projection: any = {}): Promise<IResourceAuthoritiesDocument[]> {
    return UserAuthorities.find({ resourceId: { $in: Array.from(resourceIds) } }, projection).exec();
}

export function getAuthoritiesByResourceAndUserId(resourceId: string, userId: string, projection: any = {}): Promise<IResourceAuthoritiesDocument[]> {
    return UserAuthorities.find({ resourceId, userId }, projection).exec();
}

export function addUserAuthorities(auths: IResourceAuthorities[]): Promise<IResourceAuthoritiesDocument[]> {
    return UserAuthorities.insertMany(auths);
}

export function removeResourceAuthoritiesForUser(resourceId: string, userId: string): Promise<any> {
    return UserAuthorities.deleteMany({ userId, resourceId }).exec();
}

export function removeAllAuthoritiesForUser(userId: string): Promise<any> {
    return UserAuthorities.deleteMany({ userId }).exec();
}

export function removeAllAuthoritiesForResource(resourceId: string): Promise<any> {
    return UserAuthorities.deleteMany({ resourceId }).exec();
}