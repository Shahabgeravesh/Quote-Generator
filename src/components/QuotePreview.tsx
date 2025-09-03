import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './QuotePreview.css';

interface TableRow {
  time: string;
  description: string;
  quantity: string;
  unitPrice: string;
  total: string;
}

interface QuoteData {
  date: string;
  managerName: string;
  re: string;
  body: string;
  tableData: TableRow[];
}

interface QuotePreviewProps {
  data: QuoteData;
  onBack: () => void;
  onEdit: (data: QuoteData) => void;
}

const QuotePreview: React.FC<QuotePreviewProps> = ({ data, onBack, onEdit }) => {
  const quoteRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateCompactPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Set font and colors
    pdf.setFont('helvetica');
    pdf.setFontSize(12);
    
    let yPosition = 20;
    const margin = 20;
    const pageWidth = 210;
    const contentWidth = pageWidth - (2 * margin);
    
    // Header
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Quote', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    
    // Date
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${formatDate(data.date)}`, margin, yPosition);
    
    yPosition += 10;
    
    // Manager Name
    pdf.text(`To: ${data.managerName}`, margin, yPosition);
    yPosition += 10;
    
    // Subject
    pdf.text(`Subject: ${data.re}`, margin, yPosition);
    yPosition += 15;
    
    // Body text
    pdf.setFontSize(11);
    const bodyLines = pdf.splitTextToSize(data.body, contentWidth);
    pdf.text(bodyLines, margin, yPosition);
    yPosition += (bodyLines.length * 5) + 10;
    
    // Table header
    if (data.tableData.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Services & Pricing', margin, yPosition);
      yPosition += 8;
      
      // Table columns
      const colWidths = [40, 60, 25, 30, 25];
      const colPositions = [margin];
      for (let i = 1; i < colWidths.length; i++) {
        colPositions.push(colPositions[i-1] + colWidths[i-1]);
      }
      
      // Table headers
      pdf.setFontSize(10);
      const headers = ['Service', 'Description', 'Qty', 'Price', 'Total'];
      headers.forEach((header, index) => {
        pdf.text(header, colPositions[index], yPosition);
      });
      yPosition += 8;
      
      // Table data
      pdf.setFont('helvetica', 'normal');
      data.tableData.forEach(row => {
        if (yPosition > 250) { // Check if we need a new page
          pdf.addPage();
          yPosition = 20;
        }
        
        const rowData = [
          row.description || '',
          row.time || '',
          row.quantity || '',
          row.unitPrice || '',
          row.total || ''
        ];
        
        rowData.forEach((cell, index) => {
          const text = pdf.splitTextToSize(cell, colWidths[index] - 2);
          pdf.text(text, colPositions[index], yPosition);
        });
        
        yPosition += Math.max(...rowData.map((cell, index) => 
          pdf.splitTextToSize(cell, colWidths[index] - 2).length
        )) * 4 + 2;
      });
    }
    
    pdf.save('chicago-oceo-quote-compact.pdf');
  };

  const generatePDF = async () => {
    if (!quoteRef.current) return;

    try {
      const canvas = await html2canvas(quoteRef.current, {
        scale: 1.5, // Reduced from 2 to 1.5 for smaller file size
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff', // Ensure white background
        imageTimeout: 0, // No timeout for images
        logging: false, // Disable logging for production
        removeContainer: true, // Clean up after rendering
        foreignObjectRendering: false // Better compatibility
      });

      // Convert to JPEG with compression instead of PNG
      const imgData = canvas.toDataURL('image/jpeg', 0.8); // JPEG with 80% quality
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST'); // Use FAST compression
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save('chicago-oceo-quote.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="quote-preview">
      <div className="preview-controls">
        <button onClick={onBack} className="back-btn">
          ← Back to Form
        </button>
        <button onClick={() => onEdit(data)} className="edit-btn">
          Edit Quote
        </button>
        <button onClick={generatePDF} className="download-btn">
          Download PDF (Standard)
        </button>
        <button onClick={generateCompactPDF} className="download-btn compact">
          Download PDF (Compact)
        </button>
      </div>

      <div className="quote-container" ref={quoteRef}>
        <div className="quote-document">
          {/* Header Section */}
          <div className="quote-header">
            <div className="company-section">
              <img src="/allie-universal-logo.png" alt="Allie Universal" className="logo-image" />
            </div>
            <div className="quote-info">
              <div className="quote-number">
                <p className="quote-date">Date: {formatDate(data.date)}</p>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="client-section">
            <div className="client-info">
              <span className="to-label">To:</span>
              <span className="client-name">{data.managerName}</span>
            </div>
            <div className="subject-info">
              <span className="subject-label">Subject:</span>
              <span className="subject-text">{data.re}</span>
            </div>
          </div>

          {/* Quote Content */}
          <div className="quote-content">
            <div className="quote-body">
              {data.body.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Services Table */}
            <div className="services-section">
              <h3>Services & Pricing</h3>
              <div className="table-container">
                <table className="quote-items-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Time</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tableData.map((row, index) => (
                      <tr key={index}>
                        <td className="service-name">{row.description}</td>
                        <td className="service-description">{row.time}</td>
                        <td className="quantity">{row.quantity}</td>
                        <td className="unit-price">${parseFloat(row.unitPrice || '0').toFixed(2)}</td>
                        <td className="total-price">${parseFloat(row.total || '0').toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>



            {/* Signature Section */}
            <div className="signature-section">
              <p>Sincerely,</p>
              <div className="signature-box">
                <img src="/Signature.png" alt="Signature" className="signature-image" />
              </div>
            </div>
          </div>

          {/* Footer with Footer Image */}
          <div className="quote-footer">
            <div className="footer-image">
              <img src="/Footer.png" alt="Allie Universal Footer" className="footer-logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePreview;
