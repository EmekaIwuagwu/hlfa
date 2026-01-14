export const applicationNotificationTemplate = (candidate) => ({
    subject: `New Application Received: ${candidate.playerName}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #1a3a5f;">New Academy Application</h2>
      <p>A new application has been submitted for Homeland Football Academy.</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Player Name:</strong></td><td>${candidate.playerName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Gender:</strong></td><td>${candidate.gender}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Program:</strong></td><td>${candidate.preferredProgram}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Parent:</strong></td><td>${candidate.parentName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td>${candidate.phone}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td>${candidate.email}</td></tr>
      </table>
      <p style="margin-top: 20px;">Please login to the admin dashboard to review the full application.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://admin.homelandfc.com/applications" style="background-color: #d4af37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Applications</a>
      </div>
    </div>
  `
});

export const statusUpdateTemplate = (candidate, status) => {
    let statusMessage = "";
    let color = "#333";

    switch (status) {
        case 'reviewed':
            statusMessage = "Your application has been reviewed and is currently under consideration. We will contact you shortly for the next steps.";
            color = "#1a3a5f";
            break;
        case 'enrolled':
            statusMessage = "Congratulations! Your child has been officially enrolled at Homeland Football Academy. Welcome to the family!";
            color = "#28a745";
            break;
        case 'rejected':
            statusMessage = "Thank you for your interest. Unfortunately, we are unable to proceed with your application at this time.";
            color = "#dc3545";
            break;
        default:
            statusMessage = "The status of your application has been updated to: " + status;
    }

    return {
        subject: `Application Status Updated: ${candidate.playerName}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: ${color};">Application Update</h2>
        <p>Hello <strong>${candidate.parentName}</strong>,</p>
        <p>The status of <strong>${candidate.playerName}</strong>'s application for Homeland Football Academy has been updated.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid ${color}; margin: 20px 0;">
          <p style="margin: 0; font-size: 16px;"><strong>Status:</strong> ${status.toUpperCase()}</p>
          <p style="margin: 10px 0 0 0;">${statusMessage}</p>
        </div>
        <p>If you have any questions, please feel free to contact us.</p>
        <p>Best regards,<br>The Homeland FC Team</p>
      </div>
    `
    };
};

export const contactNotificationTemplate = (data) => ({
    subject: `New Inquiry from ${data.name}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #1a3a5f;">New Contact Message</h2>
      <p><strong>From:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${data.childName ? `<p><strong>Child Name:</strong> ${data.childName}</p>` : ''}
      ${data.childAge ? `<p><strong>Child Age:</strong> ${data.childAge}</p>` : ''}
      ${data.program ? `<p><strong>Program:</strong> ${data.program}</p>` : ''}
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${data.message}</p>
    </div>
  `
});
