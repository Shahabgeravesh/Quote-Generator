# Quote Generator

A web-based application for generating professional quotes. This tool allows you to easily create quotes without needing to use Adobe PDF or write code each time.

## Features

- **Easy Form Interface**: Simple form to input all quote details
- **Dynamic Table**: Add/remove items with quantities and prices
- **Live Preview**: See how your quote will look before generating
- **PDF Export**: Download the quote as a professional PDF
- **Responsive Design**: Works on desktop and mobile devices
- **No Programming Required**: Just fill out the form and generate

## What You Can Customize

- **Date**: Set the quote date
- **Manager Name**: Change the manager's name
- **RE Line**: Customize the subject line
- **Body Text**: Write the main quote content
- **Items Table**: Add multiple items with descriptions, quantities, and prices

## What Stays the Same

- Company logo at the top
- "Sincerely" closing
- Professional formatting and layout
- Signature section structure
- Footer with company address

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
   ```bash
   cd quote-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

## How to Use

1. **Fill Out the Form**:
   - Enter the date
   - Add the manager's name
   - Write the RE (subject) line
   - Add the quote body text
   - Fill in the items table with your services/products

2. **Add Items**:
   - Click "Add Item" to add more rows to the table
   - Fill in item name, description, quantity, unit price, and total
   - Remove items using the "Remove" button (at least one item must remain)

3. **Preview and Generate**:
   - Click "Generate Quote" to see a preview
   - Review the quote in the preview mode
   - Click "Download PDF" to save as a PDF file
   - Use "Edit Quote" to go back and make changes

## File Structure

```
src/
├── components/
│   ├── QuoteForm.tsx      # Form for inputting quote data
│   ├── QuoteForm.css      # Styles for the form
│   ├── QuotePreview.tsx   # Preview and PDF generation
│   └── QuotePreview.css   # Styles for the preview
├── App.tsx               # Main application component
└── App.css              # Main application styles
```

## Customization

### Changing the Company Name
To change "Chicago OCEO" to your company name, edit the `QuotePreview.tsx` file and update the company name in the header section.

### Modifying the Layout
The CSS files can be modified to change colors, fonts, spacing, and overall appearance of the quote.

### Adding New Fields
To add new fields to the quote, you'll need to:
1. Update the `QuoteData` interface in both components
2. Add form inputs in `QuoteForm.tsx`
3. Display the new fields in `QuotePreview.tsx`

## Troubleshooting

### PDF Generation Issues
- Make sure all required fields are filled out
- Try refreshing the page if PDF generation fails
- Check that your browser supports PDF downloads

### Styling Issues
- Clear your browser cache if styles don't update
- Make sure all CSS files are properly imported

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (not recommended)

## Technologies Used

- React 18
- TypeScript
- jsPDF (for PDF generation)
- html2canvas (for converting HTML to PDF)
- CSS3 with modern styling

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is for internal use by Chicago OCEO.

## Support

For issues or questions, please contact your development team.
