import {Document, Model} from 'mongoose';

export interface IGroup {
    name: string;
    avatarUrl?: string;
}

export interface IGroupDocument extends IGroup, Document {

}

export interface IGroupModel extends Model<IGroupDocument>{
    getGroupById: (id: string) => Promise<IGroupDocument | null>;
    getAllGroups: () => Promise<IGroupDocument[]>;
    addGroup: (group: IGroup) => Promise<IGroupDocument>;
    removeGroupById: (id: string) => Promise<IGroupDocument>;
}