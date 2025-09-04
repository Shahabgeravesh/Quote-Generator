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
  taxPercentage: string;
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

  // Calculate subtotal from all table rows
  const calculateSubtotal = () => {
    return data.tableData.reduce((sum, row) => {
      return sum + (parseFloat(row.total) || 0);
    }, 0);
  };

  // Calculate tax amount
  const calculateTaxAmount = () => {
    const subtotal = calculateSubtotal();
    const taxPercentage = parseFloat(data.taxPercentage) || 0;
    return (subtotal * taxPercentage) / 100;
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTaxAmount();
    return subtotal + taxAmount;
  };

  const generatePDF = async () => {
    if (!quoteRef.current) return;

    try {
      const canvas = await html2canvas(quoteRef.current, {
        scale: 2, // High scale for crisp quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        logging: false,
        removeContainer: true,
        foreignObjectRendering: false,
        // High quality settings
        width: 1200, // High resolution width
        height: undefined, // Auto height
        scrollX: 0,
        scrollY: 0
      });

      // Convert to PNG for maximum quality
      const imgData = canvas.toDataURL('image/png', 1.0); // PNG for best quality
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      // A4 dimensions: 210mm x 297mm
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 5; // Minimal margins for maximum content space
      const imgWidth = pageWidth - (2 * margin); // 200mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if content fits on one page
      const maxHeight = pageHeight - (2 * margin); // 287mm
      
      if (imgHeight <= maxHeight) {
        // Content fits on one page - use full quality
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST');
      } else {
        // Content is too tall - use multiple pages but maintain quality
        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= (pageHeight - (2 * margin));

        // Additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, margin + position, imgWidth, imgHeight, undefined, 'FAST');
          heightLeft -= (pageHeight - (2 * margin));
        }
      }

      pdf.save(`quote-${data.managerName.replace(/[^a-zA-Z0-9]/g, '-')}-${formatDate(data.date).replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
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
          Download PDF
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

            {/* Tax and Totals Section */}
            <div className="totals-section">
              <div className="totals-container">
                <div className="total-row">
                  <span className="total-label">Subtotal:</span>
                  <span className="total-value">${calculateSubtotal().toFixed(2)}</span>
                </div>
                {data.taxPercentage && parseFloat(data.taxPercentage) > 0 && (
                  <div className="total-row">
                    <span className="total-label">Tax ({data.taxPercentage}%):</span>
                    <span className="total-value">${calculateTaxAmount().toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row grand-total">
                  <span className="total-label">Total:</span>
                  <span className="total-value">${calculateGrandTotal().toFixed(2)}</span>
                </div>
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
