import {Document, Model} from 'mongoose';
import {getGroupsByIds} from "../models/group";

export interface IGroup {
    name: string;
    avatarUrl?: string;
    participants?: string[]; // FE only
}

export interface IGroupDocument extends IGroup, Document {

}

export interface IGroupModel extends Model<IGroupDocument>{
    getGroupById: (id: string) => Promise<IGroupDocument | null>;
    getGroupsByIds: (groupIds: Set<string>, projection: any) => Promise<IGroupDocument[]>;
    addGroup: (group: IGroup) => Promise<IGroupDocument>;
    removeGroupById: (id: string) => Promise<IGroupDocument>;
}