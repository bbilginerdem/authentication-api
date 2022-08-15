import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";

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

export async function verifyUserHandler(req: Request<{}, {}, { id: string }>, res: Response) { }
