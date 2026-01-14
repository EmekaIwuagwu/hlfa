import express from 'express';
import { sendContactEmail } from '../controllers/contactController.js';
import { validate } from '../middleware/validationMiddleware.js';
import { contactSchema } from '../middleware/validators.js';

const router = express.Router();

router.post('/send-contact-email', validate(contactSchema), sendContactEmail);

export default router;
