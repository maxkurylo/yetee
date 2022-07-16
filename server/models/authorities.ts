import {Schema, model} from 'mongoose';
import {IResourceAuthorities, IResourceAuthoritiesDocument, IResourceAuthoritiesModel} from "../typings/authorities";


const UserAuthoritiesSchema = new Schema<IResourceAuthorities>({
    resourceId: { type: String, required: true },
    userId:     { type: String, required: true },
    role:       { type: String, required: true }
});

const UserAuthorities = model<IResourceAuthoritiesDocument, IResourceAuthoritiesModel>('Authorities', UserAuthoritiesSchema);

export function getAuthoritiesByUserId (userId: string): Promise<IResourceAuthoritiesDocument[]> {
    return UserAuthorities.find({ userId }).exec();
}
export function getAuthoritiesByResourceId (resourceId: string): Promise<IResourceAuthoritiesDocument[]> {
    return UserAuthorities.find({ resourceId }).exec();
}

export function getAuthoritiesByResourceAndUserId (resourceId: string, userId: string): Promise<IResourceAuthoritiesDocument[]> {
    return UserAuthorities.find({ resourceId, userId }).exec();
}

export function addUserAuthorities (auths: IResourceAuthorities[]): Promise<IResourceAuthoritiesDocument[]> {
    return UserAuthorities.insertMany(auths);
}

export function removeResourceAuthoritiesForUser (resourceId: string, userId: string): Promise<any> {
    return UserAuthorities.deleteMany({ userId, resourceId }).exec();
}

export function removeAllAuthoritiesForUser (userId: string): Promise<any> {
    return UserAuthorities.deleteMany({ userId }).exec();
}

export function removeAllAuthoritiesForResource (resourceId: string): Promise<any> {
    return UserAuthorities.deleteMany({ resourceId }).exec();
}