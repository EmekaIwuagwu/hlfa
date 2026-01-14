import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ContactMessage = sequelize.define('ContactMessage', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    childAge: { type: DataTypes.INTEGER, allowNull: true },
    childName: { type: DataTypes.STRING, allowNull: true },
    program: { type: DataTypes.STRING, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
});

export default ContactMessage;
