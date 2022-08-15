import express from 'express';
import { createUserHandler } from '../controller/user.controller';
import validateResource from '../middleware/validateResource';
import { createUserSchema } from '../schema/user.schema';

const router = express.Router()

// createUserSchema will return the function inside validateResource to will do the parsing of the schema
router.post('/api/users', validateResource(createUserSchema), createUserHandler)

export default router;