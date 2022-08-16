import { Request, Response } from "express";
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserByEmail, findUserById } from "../service/user.service";
import log from "../utils/logger";
import { nanoid } from "nanoid";

import sendEmail from '../utils/mailer';

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
  const body = req.body
  try {
    const user = await createUser(body)
    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      subject: 'Verify your account',
      text: `Verification code: ${user.verificationCode}. Id: ${user._id}`,
    });

    return res.send('User successfully created')
  } catch (e) {
    // 11000 means that unique constraint is violated
    if (e.code === 11000) {
      return res.status(409).send("Account already exists")
    }

    return res.status(500).send(e)
  }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
  const id = req.params.id
  const verificationCode = req.params.verificationCode

  // find the user by id
  const user = await findUserById(id)

  if (!user) {
    return res.status(404).send("User not found")
  }

  // check to see if they are already verified
  if (user.verified) {
    return res.status(409).send("User already verified")
  }

  // check to see if the verificationCode matches
  if (user.verificationCode === verificationCode) {
    user.verified = true

    await user.save()

    return res.send("User successfully verified")
  }

  return res.send("Could not verify user")
}

export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
  const message = "If a user with that email is registered you will receive a password reset email";

  const { email } = req.body

  const user = await findUserByEmail(email)

  if (!user) {
    log.debug(`User with email ${email} does not exist`);
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("User is not verified");
  }

  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;

  await user.save();

  await sendEmail({
    to: user.email,
    from: "test@example.com",
    subject: "Password Reset",
    text: `Reset code: ${passwordResetCode}. Id: ${user._id}`,
  })

  log.debug(`Password reset email sent to ${email}`)

  return res.send(message);
}

export async function resetPasswordHandler(req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>, res: Response) {
  const { id, passwordResetCode } = req.params

  const { password } = req.body

  const user = findUserById(id)

  // if  user is not register, or passwordResetCode is null, or that the reset code doesn't match return error
  if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
    return res.status(400).send('Could not reset user password')
  }

  user.passwordResetCode = null

  // since in user.model.ts, we have presave hook, we don't need to hash the password
  user.password = password

  await user.save()

  return res.send('Successfully updated the password')
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user)
}