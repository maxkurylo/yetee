import {Schema, model} from 'mongoose';
import {IGroup, IGroupDocument, IGroupModel} from "../typings/group";


const GroupSchema = new Schema<IGroup>({
    name: { type: String, required: true },
    avatarUrl: { type: String, required: false },
});

const Group = model<IGroupDocument, IGroupModel>('Groups', GroupSchema);

export function getGroupById(id: string): Promise<IGroupDocument | null> {
    return Group.findById(id).exec();
}

export function getGroupsByIds(groupIds: Set<string>, projection: any = {}): Promise<IGroupDocument[]> {
    return Group.find({ _id: { $in: Array.from(groupIds) } }, projection).exec();
}

export function addGroup(group: IGroup): Promise<IGroupDocument> {
    const newGroup = new Group(group);
    return newGroup.save();
}

export function removeGroupById(id: string): Promise<any> {
    return Group.deleteOne({ _id: id }).exec();
}