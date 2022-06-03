import {Schema, model} from 'mongoose';
import {IGroup, IGroupDocument, IGroupModel} from "../typings/group";


const GroupSchema = new Schema<IGroup>({
    name: { type: String, required: true },
    avatar: { type: String, required: false },
}, {
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) { delete ret._id; }
        },
});

GroupSchema.virtual('id').get(function (this: { _id: any }) {
    return this._id.toHexString();
});

const Group = model<IGroupDocument, IGroupModel>('Groups', GroupSchema);

export function getGroupById(id: string): Promise<IGroupDocument | null> {
    return Group.findById(id).exec();
}

export function getAllGroups(projection: any = {}): Promise<IGroupDocument[] | null> {
    return Group.find({}, projection).exec();
}

export function addGroup(group: IGroup): Promise<IGroupDocument> {
    const newGroup = new Group(group);
    return newGroup.save();
}

export function removeGroupById(id: string): Promise<any> {
    return Group.deleteOne({_id: id}).exec();
}