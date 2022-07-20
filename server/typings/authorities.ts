import {Document, Model} from 'mongoose';

export interface IResourceAuthorities {
    resourceId?: string;
    userId: string;
    role: string;
}

export interface IUserAuthorities {
    resourceId?: string;
    userId: string;
    role: string;
    permissions?: string[];
}

export interface IResourceAuthoritiesDocument extends IResourceAuthorities, Document {

}

export interface IResourceAuthoritiesModel extends Model<IResourceAuthoritiesDocument>{
    getAuthoritiesByUserId: (userId: string) => Promise<IResourceAuthoritiesDocument[]>;
    getAuthoritiesByResourceId: (resourceId: string) => Promise<IResourceAuthoritiesDocument[]>;
    getAuthoritiesByResourceIds: (resourceIds: Set<string>) => Promise<IResourceAuthoritiesDocument[]>
    getAuthoritiesByResourceAndUserId: (resourceId: string, userId: string) => Promise<IResourceAuthoritiesDocument[]>;
    addUserAuthorities: (auths: IResourceAuthorities[]) => Promise<IResourceAuthoritiesDocument>;
    removeResourceAuthoritiesForUser: (resourceId: string, userId: string) => Promise<any>;
    removeAllAuthoritiesForUser: (userId: string) => Promise<any>;
    removeAllAuthoritiesForResource: (resourceId: string) => Promise<any>;
}