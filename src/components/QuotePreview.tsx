import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './QuotePreview.css';

interface TableRow {
  item: string;
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

  const generatePDF = async () => {
    if (!quoteRef.current) return;

    try {
      const canvas = await html2canvas(quoteRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
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
                      <th>Service</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tableData.map((row, index) => (
                      <tr key={index}>
                        <td className="service-name">{row.item}</td>
                        <td className="service-description">{row.description}</td>
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
