import {Schema, model, Document, Model} from 'mongoose';

interface IGroup {
    name: string;
    avatarUrl?: string;
    posts?: [string];
}

interface IGroupDocument extends IGroup, Document {

}

interface IGroupModel extends Model<IGroupDocument>{

}


const GroupSchema = new Schema<IGroup>({
    name: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    posts: [String],
});

const Group = model<IGroupDocument, IGroupModel>('Groups', GroupSchema);


GroupSchema.statics.getGroupById = async function(id: string): Promise<IGroupDocument | null> {
    return await this.findById(id).exec();
};

GroupSchema.statics.getAllGroups = async function(): Promise<IGroupDocument[]> {
    return await this.find({}).exec();
};

GroupSchema.statics.addGroup = function(newGroup: IGroupDocument): Promise<IGroupDocument> {
    return newGroup.save();
};

GroupSchema.statics.removeGroupById = function(id: string): Promise<IGroupDocument> {
    return this.deleteOne({_id: id});
};

export default Group