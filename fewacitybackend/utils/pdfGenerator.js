import PDFDocument from 'pdfkit';

/**
 * Generates a professional prescription PDF
 * @param {Object} appointment - The populated appointment document
 * @param {WritableStream} stream - The stream to write the PDF content to
 * @returns {Promise<void>}
 */
export const generatePrescriptionPDF = (appointment, stream) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      doc.on('error', (err) => reject(err));
      doc.on('end', () => resolve());

      doc.pipe(stream);

      // Color Palette
      const primaryColor = '#156619'; // FCH Green
      const secondaryColor = '#0f4d12'; // Dark Green
      const accentColor = '#2563eb'; // Blue accent
      const textColor = '#1f2937'; // Slate 800
      const lightGray = '#f8fafc'; // Slate 50
      const borderGray = '#e2e8f0'; // Slate 200

      // --- Header / Letterhead ---
      // Programmatic Hospital Logo (Medical Cross + Circle)
      doc.save();
      doc.fillColor(primaryColor);
      doc.circle(70, 70, 20).fill();
      
      // Draw white cross
      doc.fillColor('#ffffff');
      doc.rect(67, 58, 6, 24).fill();
      doc.rect(58, 67, 24, 6).fill();
      doc.restore();

      // Hospital Name & Slogan
      doc.fillColor(primaryColor)
         .font('Helvetica-Bold')
         .fontSize(22)
         .text('FEWA CITY HOSPITAL', 105, 53);
      
      doc.fillColor('#64748b')
         .font('Helvetica-Bold')
         .fontSize(8.5)
         .text('State-of-the-Art Clinical & Diagnostic Center', 105, 75);

      // Contact info
      doc.fillColor('#475569')
         .font('Helvetica')
         .fontSize(8)
         .text('Nagdhunga, Pokhara, Nepal | Tel: +977-61-5940555 | Email: info@fewacityhospital.com', 105, 87);

      // Decorative Separator Bar (Thick green and thin blue line)
      doc.strokeColor(primaryColor).lineWidth(3).moveTo(50, 108).lineTo(545, 108).stroke();
      doc.strokeColor(accentColor).lineWidth(1).moveTo(50, 113).lineTo(545, 113).stroke();

      // Document Title
      doc.moveDown(2);
      doc.fillColor(primaryColor)
         .font('Helvetica-Bold')
         .fontSize(14)
         .text('E-PRESCRIPTION / CLINICAL SLIP', { align: 'center' });
      
      // Draw underline manually for precision spacing
      const titleY = doc.y;
      doc.strokeColor(primaryColor).lineWidth(1).moveTo(180, titleY + 2).lineTo(415, titleY + 2).stroke();

      doc.moveDown(1.5);

      // --- Patient & Doctor Information Box ---
      const infoBoxTop = doc.y;
      const boxHeight = 110;
      
      // Draw background box
      doc.roundedRect(50, infoBoxTop, 495, boxHeight, 8)
         .fillColor(lightGray)
         .fill()
         .strokeColor(borderGray)
         .lineWidth(1.5)
         .stroke();

      // Text details inside the box
      doc.fillColor(textColor);
      
      const leftColX = 70;
      const rightColX = 300;
      let currentY = infoBoxTop + 15;

      // Column Titles
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(secondaryColor).text('PATIENT DETAILS', leftColX, currentY);
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(secondaryColor).text('CONSULTATION DETAILS', rightColX, currentY);
      
      currentY += 18;
      doc.fillColor(textColor);

      // Patient Details retrieval
      const patientName = appointment.patient?.name || 'N/A';
      const patientPhone = appointment.patient?.phone || 'N/A';
      const patientGender = appointment.patient?.gender || 'Not Specified';
      const patientBlood = appointment.patient?.bloodGroup || 'Not Specified';
      
      // Age calculation
      let patientAge = 'Not Specified';
      if (appointment.patient?.dob) {
        const today = new Date();
        const birthDate = new Date(appointment.patient.dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        patientAge = age + ' Years';
      }

      // Left Column Fields
      doc.font('Helvetica-Bold').fontSize(9).text('Name: ', leftColX, currentY)
         .font('Helvetica').text(patientName, leftColX + 40, currentY);
      
      // Right Column Fields - Doctor
      const doctorName = appointment.doctor?.name || 'Specialist';
      const docQual = appointment.doctor?.qualification || 'Medical Consultant';
      doc.font('Helvetica-Bold').fontSize(9).text('Doctor: ', rightColX, currentY)
         .font('Helvetica').text(`Dr. ${doctorName}`, rightColX + 55, currentY);

      currentY += 15;

      // Left Column Age/Gen
      doc.font('Helvetica-Bold').fontSize(9).text('Age / Sex: ', leftColX, currentY)
         .font('Helvetica').text(`${patientAge} / ${patientGender}`, leftColX + 55, currentY);

      // Right Column Specialization
      const deptTitle = appointment.department?.title || 'General Medicine';
      doc.font('Helvetica-Bold').fontSize(9).text('Department: ', rightColX, currentY)
         .font('Helvetica').text(deptTitle, rightColX + 70, currentY);

      currentY += 15;

      // Left Column Blood Group
      doc.font('Helvetica-Bold').fontSize(9).text('Blood Group: ', leftColX, currentY)
         .font('Helvetica').text(patientBlood, leftColX + 65, currentY);

      // Right Column Date
      const apptDateStr = new Date(appointment.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.font('Helvetica-Bold').fontSize(9).text('Appt Date: ', rightColX, currentY)
         .font('Helvetica').text(`${apptDateStr} (${appointment.timeSlot})`, rightColX + 58, currentY);

      currentY += 15;

      // Left Column Phone
      doc.font('Helvetica-Bold').fontSize(9).text('Phone: ', leftColX, currentY)
         .font('Helvetica').text(patientPhone, leftColX + 40, currentY);

      // Right Column Appt ID
      const apptId = appointment._id.toString().toUpperCase();
      doc.font('Helvetica-Bold').fontSize(9).text('Ref ID: ', rightColX, currentY)
         .font('Helvetica').text(apptId, rightColX + 40, currentY);

      // Move cursor down past the box
      doc.y = infoBoxTop + boxHeight + 25;

      // --- Section: Chief Complaints / Symptoms ---
      if (appointment.symptoms) {
        doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10.5).text('CHIEF COMPLAINTS / SYMPTOMS', 50, doc.y);
        doc.strokeColor(primaryColor).lineWidth(1).moveTo(50, doc.y + 4).lineTo(235, doc.y + 4).stroke();
        doc.y += 12;
        doc.fillColor(textColor).font('Helvetica').fontSize(9.5).text(appointment.symptoms, 55, doc.y, { width: 485, align: 'justify', lineGap: 2 });
        doc.y += doc.heightOfString(appointment.symptoms, { width: 485 }) + 20;
      }

      // --- Section: Diagnosis & Prescription (Rx) ---
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10.5).text('DIAGNOSIS & PRESCRIPTION (Rx)', 50, doc.y);
      doc.strokeColor(primaryColor).lineWidth(1).moveTo(50, doc.y + 4).lineTo(235, doc.y + 4).stroke();
      doc.y += 15;

      const rxTop = doc.y;
      
      // Large serif Rx symbol
      doc.fillColor(primaryColor)
         .font('Times-BoldItalic')
         .fontSize(28)
         .text('Rx', 50, rxTop);

      // Prescription details next to the Rx
      const prescText = appointment.prescription || 'No specific clinical prescription or medications added.';
      doc.fillColor(textColor)
         .font('Helvetica')
         .fontSize(10)
         .text(prescText, 85, rxTop + 4, { width: 450, align: 'justify', lineGap: 3.5 });

      // Move down below Rx or prescription text
      doc.y = rxTop + Math.max(35, doc.heightOfString(prescText, { width: 450 })) + 25;

      // --- Section: Clinical Instructions / Follow-Up Notes ---
      if (appointment.adminNotes) {
        doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10.5).text('CLINICAL NOTES / FOLLOW-UP ADVISORY', 50, doc.y);
        doc.strokeColor(primaryColor).lineWidth(1).moveTo(50, doc.y + 4).lineTo(285, doc.y + 4).stroke();
        doc.y += 12;
        doc.fillColor(textColor).font('Helvetica').fontSize(9.5).text(appointment.adminNotes, 55, doc.y, { width: 485, align: 'justify', lineGap: 2 });
        doc.y += doc.heightOfString(appointment.adminNotes, { width: 485 }) + 20;
      }

      // Ensure footer doesn't get pushed off or overlaps.
      if (doc.y > 660) {
        doc.addPage();
        doc.y = 50;
      } else {
        doc.y = Math.max(doc.y, 630);
      }

      // --- Digital Signature Stamp Box (Bottom Right) ---
      const sigX = 350;
      const sigY = doc.y;

      // Signature container box
      doc.roundedRect(sigX, sigY, 195, 75, 4)
         .strokeColor('#10b981') // Green boundary
         .lineWidth(1)
         .stroke();

      // Checkmark verified badge inside signature box
      doc.save();
      doc.fillColor('#10b981');
      doc.circle(sigX + 16, sigY + 15, 6).fill();
      
      // Draw tiny white check mark lines
      doc.strokeColor('#ffffff')
         .lineWidth(1.2)
         .moveTo(sigX + 13.5, sigY + 15)
         .lineTo(sigX + 15.5, sigY + 17)
         .lineTo(sigX + 19, sigY + 13.5)
         .stroke();
      doc.restore();

      // Stamp Header
      doc.fillColor('#10b981')
         .font('Helvetica-Bold')
         .fontSize(8)
         .text('VERIFIED DIGITAL SIGNATURE', sigX + 28, sigY + 11);

      // Styled Doctor Cursive Signature
      doc.fillColor('#1d4ed8') // Blue ink
         .font('Times-BoldItalic')
         .fontSize(14)
         .text(doctorName, sigX + 15, sigY + 28, { width: 165, align: 'center' });

      // Under-signature line
      doc.strokeColor('#cbd5e1').lineWidth(0.5).moveTo(sigX + 15, sigY + 45).lineTo(sigX + 180, sigY + 45).stroke();

      // Specialist Name & Institution details
      doc.fillColor('#334155')
         .font('Helvetica-Bold')
         .fontSize(8)
         .text(`Dr. ${doctorName}`, sigX + 15, sigY + 50, { width: 165, align: 'center' });
      
      doc.fillColor('#64748b')
         .font('Helvetica')
         .fontSize(7)
         .text(`${docQual} | FCH Nepal`, sigX + 15, sigY + 60, { width: 165, align: 'center' });

      // End and write PDF
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
