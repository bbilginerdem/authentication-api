// to export ts interface as well as model, we will use typegoose
import { getModelForClass, modelOptions, prop, Severity, pre, DocumentType, index } from "@typegoose/typegoose";
import { nanoid } from "nanoid";
import argon2 from 'argon2';
import log from "../utils/logger";


// when we sign jwt, we want to remove these fields from the user
export const privateFields = [
  'password',
  '__v',
  'verificationCode',
  'passwordResetCode',
  'verified',
]

// User class set for pre to get type validations
@pre<User>("save", async function () {
  if (!this.isModified('Password')) {
    return;
  }

  // to make the password hashed
  const hash = await argon2.hash(this.password)

  // to replace the password user puts in with our new hash
  this.password = hash;

  return;
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    // to prevent password resetting using the same token by setting passwordResetCode to null
    allowMixed: Severity.ALLOW
  }
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string

  @prop({ required: true })
  firstName: string

  @prop({ required: true })
  lastName: string

  @prop({ required: true })
  password: string

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword)
    } catch (e) {
      log.error(e, "Could not validate password")
      return false
    }
  }
}

const UserModel = getModelForClass(User)

export default UserModel

