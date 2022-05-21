import {Schema, model} from 'mongoose';
import {IGroup, IGroupDocument, IGroupModel} from "../typings/group";


const GroupSchema = new Schema<IGroup>({
    name: { type: String, required: true },
    avatar: { type: String, required: false },
});

const Group = model<IGroupDocument, IGroupModel>('Groups', GroupSchema);


GroupSchema.statics.getGroupById = async function(id: string): Promise<IGroupDocument | null> {
    return await this.findById(id).exec();
};

GroupSchema.statics.getAllGroups = async function(): Promise<IGroupDocument[]> {
    return await this.find({}).exec();
};

GroupSchema.statics.addGroup = function(group: IGroup): Promise<IGroupDocument> {
    const newGroup = new Group(group);
    return newGroup.save();
};

GroupSchema.statics.removeGroupById = function(id: string): Promise<IGroupDocument> {
    return this.deleteOne({_id: id});
};

export default Group