import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    playerName: { type: DataTypes.STRING, allowNull: false },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: false },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false
    },
    stateOfOrigin: { type: DataTypes.STRING, allowNull: false },
    lga: { type: DataTypes.STRING, allowNull: false },
    nationality: { type: DataTypes.STRING, allowNull: false },
    school: { type: DataTypes.STRING, allowNull: false },
    classGrade: { type: DataTypes.STRING, allowNull: false },
    preferredProgram: { type: DataTypes.STRING, allowNull: false },
    preferredPosition: { type: DataTypes.STRING, allowNull: false },
    preferredFoot: {
        type: DataTypes.ENUM('left', 'right', 'both'),
        allowNull: false
    },
    height: { type: DataTypes.FLOAT, allowNull: false },
    weight: { type: DataTypes.FLOAT, allowNull: false },
    previousExperience: { type: DataTypes.TEXT, allowNull: false },
    videoLink: { type: DataTypes.STRING, allowNull: true },
    parentName: { type: DataTypes.STRING, allowNull: false },
    relationship: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address: { type: DataTypes.TEXT, allowNull: false },
    occupation: { type: DataTypes.STRING, allowNull: false },
    emergencyContactName: { type: DataTypes.STRING, allowNull: false },
    emergencyContactPhone: { type: DataTypes.STRING, allowNull: false },
    emergencyContactRelationship: { type: DataTypes.STRING, allowNull: false },
    medicalConditions: { type: DataTypes.TEXT, allowNull: true },
    allergies: { type: DataTypes.TEXT, allowNull: true },
    currentMedications: { type: DataTypes.TEXT, allowNull: true },
    dietaryRestrictions: { type: DataTypes.TEXT, allowNull: true },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'enrolled', 'rejected'),
        defaultValue: 'pending'
    }
});

export default Application;
