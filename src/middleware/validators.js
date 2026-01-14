import Joi from 'joi';

export const applicationSchema = Joi.object({
    playerName: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    stateOfOrigin: Joi.string().required(),
    lga: Joi.string().required(),
    nationality: Joi.string().required(),
    school: Joi.string().required(),
    classGrade: Joi.string().required(),
    preferredProgram: Joi.string().required(),
    preferredPosition: Joi.string().required(),
    preferredFoot: Joi.string().valid('left', 'right', 'both').required(),
    height: Joi.number().required(),
    weight: Joi.number().required(),
    previousExperience: Joi.string().required(),
    videoLink: Joi.string().uri().allow('', null),
    parentName: Joi.string().required(),
    relationship: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    occupation: Joi.string().required(),
    emergencyContactName: Joi.string().required(),
    emergencyContactPhone: Joi.string().required(),
    emergencyContactRelationship: Joi.string().required(),
    medicalConditions: Joi.string().allow('', null),
    allergies: Joi.string().allow('', null),
    currentMedications: Joi.string().allow('', null),
    dietaryRestrictions: Joi.string().allow('', null),
});

export const videoSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow('', null),
    category: Joi.string().required(),
    youtubeUrl: Joi.string().uri().required(),
    thumbnailUrl: Joi.string().uri().allow('', null)
});

// Partial schema for video updates
export const videoUpdateSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string().allow('', null),
    category: Joi.string(),
    youtubeUrl: Joi.string().uri(),
    thumbnailUrl: Joi.string().uri().allow('', null)
}).min(1);

export const contactSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    childAge: Joi.number().allow(null),
    childName: Joi.string().allow('', null),
    program: Joi.string().allow('', null),
    message: Joi.string().required()
});
