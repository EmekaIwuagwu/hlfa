import ExcelJS from 'exceljs';
import { stringify } from 'csv-stringify/sync';

export const exportToExcel = async (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    worksheet.columns = [
        { header: 'Player Name', key: 'playerName', width: 25 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Program', key: 'preferredProgram', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Date Applied', key: 'createdAt', width: 20 },
        { header: 'Parent Name', key: 'parentName', width: 20 },
        { header: 'State', key: 'stateOfOrigin', width: 15 },
        { header: 'LGA', key: 'lga', width: 15 },
        { header: 'Experience', key: 'previousExperience', width: 30 },
    ];

    data.forEach(item => {
        const json = item.toJSON ? item.toJSON() : item;
        worksheet.addRow({
            playerName: json.playerName,
            email: json.email,
            phone: json.phone,
            preferredProgram: json.preferredProgram,
            status: json.status,
            createdAt: new Date(json.createdAt).toISOString(),
            parentName: json.parentName,
            stateOfOrigin: json.stateOfOrigin,
            lga: json.lga,
            previousExperience: json.previousExperience
        });
    });

    return await workbook.xlsx.writeBuffer();
};

export const exportToCSV = (data) => {
    const records = data.map(item => {
        const json = item.toJSON ? item.toJSON() : item;
        return {
            playerName: json.playerName,
            email: json.email,
            phone: json.phone,
            preferredProgram: json.preferredProgram,
            status: json.status,
            createdAt: new Date(json.createdAt).toISOString(),
            parentName: json.parentName,
            stateOfOrigin: json.stateOfOrigin,
            lga: json.lga
        };
    });

    return stringify(records, { header: true });
};
