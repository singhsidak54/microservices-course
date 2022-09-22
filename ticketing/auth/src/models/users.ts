import mongoose from "mongoose";
import { Password } from '../services/password';

/*
    An interface which describes the properties that are
    required to create a new User.
*/
interface UserAttrs {
    email: string;
    password: string;
}

/*
    An interface which describes the properties that a
    User model has.
*/
interface UserModel extends mongoose.Model<UserDoc> {
    build(atts: UserAttrs): UserDoc;
}

/*
    An interface which describes the properties that a
    User document has.
*/
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };