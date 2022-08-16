import express from 'express';
import { createUserHandler, forgotPasswordHandler, getCurrentUserHandler, resetPasswordHandler, verifyUserHandler } from '../controller/user.controller';
import requireUser from '../middleware/requireUser';
import validateResource from '../middleware/validateResource';
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from '../schema/user.schema';

const router = express.Router()

// createUserSchema will return the function inside validateResource to will do the parsing of the schema
router.post('/api/users', validateResource(createUserSchema), createUserHandler)

router.post('/api/users/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler)

router.post("/api/users/forgot-password", validateResource(forgotPasswordSchema), forgotPasswordHandler)

router.post("/api/users/resetpassword/:id/:passwordResetCode", validateResource(resetPasswordSchema), resetPasswordHandler)

router.get('/api/users/me', requireUser, getCurrentUserHandler)

export default router;
