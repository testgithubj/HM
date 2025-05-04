const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const getInvoicePdf = (booking, hotelDetails) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4',
        info: {
          Title: 'Spa Invoice',
          Author: hotelDetails.name,
          Subject: 'Invoice for spa services',
        }
      });

      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      const colors = {
        primary: '#007bff',
        secondary: '#6c757d',
        highlight: '#17a2b8',
        text: '#212529',
        light: '#f8f9fa'
      };

      // ✅ Update path to actual logo file
      const logoPath = path.resolve(__dirname, 'logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 50, { width: 120 });
      }

      doc.fontSize(24)
         .font('Helvetica-Bold')
         .fillColor(colors.primary)
         .text('Spa Invoice', 200, 65, { align: 'right' });

      doc.fontSize(10)
         .font('Helvetica')
         .fillColor(colors.secondary)
         .text(`Invoice #: ${booking.id || 'INV-' + Date.now().toString().substr(-6)}`, 200, 95, { align: 'right' })
         .text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'right' });

      doc.moveTo(50, 120).lineTo(550, 120).lineWidth(1).strokeColor(colors.primary).stroke();
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica-Bold').fillColor(colors.primary)
         .text('CUSTOMER DETAILS', 50, 140)
         .text('HOTEL DETAILS', 300, 140);

      doc.fontSize(10).font('Helvetica').fillColor(colors.text)
         .text(`${booking.firstName} ${booking.lastName}`, 50, 165)
         .text(`${booking.email}`, 50, null)
         .text(`Phone: ${booking.phoneNumber || 'N/A'}`, 50, null);

      doc.text(`${hotelDetails.name}`, 300, 165)
         .text(`${hotelDetails.email}`, 300, null)
         .text(`${hotelDetails.address}`, 300, null)

      doc.moveDown(4);
      doc.rect(50, 240, 500, 25).fillAndStroke(colors.primary, colors.primary);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('white').text('SERVICE DETAILS', 60, 248);

      const tableTop = 280;
      const tableHeaders = ['Service', 'Date & Time', 'Duration', 'Price'];
      const columnWidths = [220, 120, 80, 80];
      let xPos = 50;

      doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.text);
      tableHeaders.forEach((header, i) => {
        doc.text(header, xPos, tableTop);
        xPos += columnWidths[i];
      });

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).lineWidth(0.5).strokeColor(colors.secondary).stroke();

      xPos = 50;
      const serviceDate = new Date(booking.bookingDateTime);
      const formattedDate = serviceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      const formattedTime = serviceDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      doc.fontSize(10).font('Helvetica').fillColor(colors.text)
         .text(booking.serviceName, xPos, tableTop + 25);
      xPos += columnWidths[0];
      doc.text(`${formattedDate}\n${formattedTime}`, xPos, tableTop + 25);
      xPos += columnWidths[1];
      doc.text(booking.duration || '60 min', xPos, tableTop + 25);
      xPos += columnWidths[2];
      doc.text(`$${booking.totalAmount || 'N/A'}`, xPos, tableTop + 25);

      doc.moveTo(50, tableTop + 45).lineTo(550, tableTop + 45).lineWidth(0.5).strokeColor(colors.secondary).stroke();

      doc.fontSize(12).font('Helvetica-Bold').fillColor(colors.primary).text('TOTAL', 400, tableTop + 60);
      doc.fontSize(14).font('Helvetica-Bold').fillColor(colors.text).text(`$${booking.totalAmount || 'N/A'}`, 500, tableTop + 60, { align: 'right' });

      let statusColor = colors.primary;
      if (booking.status === 'Completed') statusColor = '#28a745';
      else if (booking.status === 'Cancelled') statusColor = '#dc3545';
      else if (booking.status === 'Pending') statusColor = '#ffc107';

      doc.roundedRect(400, tableTop + 85, 150, 25, 3).fillAndStroke(statusColor, statusColor);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('white').text(`Status: ${booking.status}`, 400, tableTop + 92, { width: 150, align: 'center' });

      // Notes Section
      doc.moveDown(5);
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.primary).text('NOTES', 50);
      doc.fontSize(10).font('Helvetica').fillColor(colors.text)
         .text('Thank you for choosing our spa services. If you have any questions regarding this invoice, please contact our customer service team.', 50, doc.y + 5, { width: 500 });

      // Footer Section
      const footerTop = doc.y + 40;
      doc.moveTo(50, footerTop).lineTo(550, footerTop).lineWidth(1).strokeColor(colors.primary).stroke();

      doc.fontSize(10).font('Helvetica').fillColor(colors.text)
         .text('Thank you for choosing us for your wellness journey.', 50, footerTop + 10, { align: 'center' })
         .font('Helvetica-Oblique')
         .fillColor(colors.secondary)
         .text('We look forward to welcoming you again soon!', { align: 'center' })
         .fillColor(colors.primary)
         .font('Helvetica-Bold')
         .text(hotelDetails.email, { align: 'center' });

      doc.fontSize(8).fillColor(colors.secondary).text('Page 1 of 1', 500, footerTop + 50);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getInvoicePdf };
