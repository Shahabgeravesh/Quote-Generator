import React, { useState, useEffect } from 'react';
import './QuoteForm.css';

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

interface QuoteFormProps {
  onSubmit: (data: QuoteData) => void;
  initialData: QuoteData;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<QuoteData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (field: keyof QuoteData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTableRowChange = (index: number, field: keyof TableRow, value: string) => {
    setFormData(prev => ({
      ...prev,
      tableData: prev.tableData.map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    }));
  };

  const addTableRow = () => {
    setFormData(prev => ({
      ...prev,
      tableData: [...prev.tableData, { item: '', description: '', quantity: '', unitPrice: '', total: '' }]
    }));
  };

  const removeTableRow = (index: number) => {
    if (formData.tableData.length > 1) {
      setFormData(prev => ({
        ...prev,
        tableData: prev.tableData.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="quote-form">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Quote Details</h2>
          
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="managerName">Client Name:</label>
            <input
              type="text"
              id="managerName"
              value={formData.managerName}
              onChange={(e) => handleInputChange('managerName', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="re">RE:</label>
            <input
              type="text"
              id="re"
              value={formData.re}
              onChange={(e) => handleInputChange('re', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Quote Body:</label>
            <textarea
              id="body"
              value={formData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              rows={6}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Quote Items</h2>
          <div className="table-container">
            <table className="quote-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.tableData.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={row.item}
                        onChange={(e) => handleTableRowChange(index, 'item', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => handleTableRowChange(index, 'description', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => handleTableRowChange(index, 'quantity', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={row.unitPrice}
                        onChange={(e) => handleTableRowChange(index, 'unitPrice', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={row.total}
                        onChange={(e) => handleTableRowChange(index, 'total', e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeTableRow(index)}
                        className="remove-btn"
                        disabled={formData.tableData.length === 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={addTableRow} className="add-row-btn">
              Add Item
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="generate-btn">
            Generate Quote
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuoteForm;
