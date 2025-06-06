import { Document, Packer, Paragraph, TextRun } from 'docx';
import jsPDF from 'jspdf';

/**
 * Exports the test results as a .docx file.
 * @param {string} timestamp - The timestamp of the test run.
 * @param {Array} results - The array of test results.
 */
export const exportResultsAsDocx = (timestamp, results) => {
    const groupedByType = results.reduce((acc, result) => {
        acc[result.type] = acc[result.type] || [];
        acc[result.type].push(result);
        return acc;
    }, {});

    const title = new Paragraph({
        children: [
            new TextRun({
                text: `Test Run: ${new Date(timestamp).toLocaleString()}`,
                bold: true,
                size: 28,
            }),
        ],
        spacing: { after: 300 },
    });

    const typeParagraphs = Object.entries(groupedByType).flatMap(([type, typeResults]) => {
        const typeHeader = new Paragraph({
            children: [
                new TextRun({
                    text: type === 'UI' ? 'UI Tests' : 'API Tests',
                    bold: true,
                    size: 26,
                }),
            ],
            spacing: { after: 200 },
        });

        const resultParagraphs = typeResults.map((result) => {
            const testName = new Paragraph({
                children: [
                    new TextRun({
                        text: `Test: ${result.test}`,
                        bold: true,
                        size: 24,
                    }),
                ],
                spacing: { after: 200 },
            });

            const expected = new Paragraph({
                children: [
                    new TextRun({
                        text: `Expected: `,
                        bold: true,
                    }),
                    new TextRun(result.expected ? String(result.expected) : 'N/A'),
                ],
            });

            const actual = new Paragraph({
                children: [
                    new TextRun({
                        text: `Actual: `,
                        bold: true,
                    }),
                    new TextRun(result.actual ? String(result.actual) : 'N/A'),
                ],
            });

            let statusText = 'Pending ⏳';
            if (result.pass === true) statusText = 'Pass ✅';
            else if (result.pass === false) statusText = 'Fail ❌';

            const status = new Paragraph({
                children: [
                    new TextRun({
                        text: `Status: `,
                        bold: true,
                    }),
                    new TextRun(statusText),
                ],
                spacing: { after: 300 },
            });

            return [testName, expected, actual, status];
        });

        return [typeHeader, ...resultParagraphs.flat()];
    });

    const flattenedParagraphs = [title, ...typeParagraphs];

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: flattenedParagraphs,
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `test-run-${new Date(timestamp).toISOString()}.docx`;
        link.click();
        URL.revokeObjectURL(url);
    });
};

/**
 * Exports the test results as a .pdf file.
 * @param {string} timestamp - The timestamp of the test run.
 * @param {Array} results - The array of test results.
 */
export const exportResultsAsPdf = (timestamp, results) => {
    const doc = new jsPDF();
    const marginLeft = 10; // Left margin for text
    let y = 20; // Vertical position for text

    // Title
    const title = `Test Run: ${new Date(timestamp).toLocaleString()}`;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, marginLeft, y);
    y += 10;

    // Group results by type (e.g., UI, API)
    const groupedByType = results.reduce((acc, result) => {
        acc[result.type] = acc[result.type] || [];
        acc[result.type].push(result);
        return acc;
    }, {});

    // Iterate through each type and its results
    Object.entries(groupedByType).forEach(([type, typeResults]) => {
        // Add a header for the type
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(type === 'UI' ? 'UI Tests' : 'API Tests', marginLeft, y);
        y += 8;

        // Iterate through each test result in the type
        typeResults.forEach((result) => {
            // Test Name
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`Test: ${result.test}`, marginLeft, y);
            y += 6;

            // Expected
            doc.setFont('helvetica', 'normal');
            doc.text(`Expected: ${result.expected ? String(result.expected) : 'N/A'}`, marginLeft, y);
            y += 6;

            // Actual
            doc.text(`Actual: ${result.actual ? String(result.actual) : 'N/A'}`, marginLeft, y);
            y += 6;

            // Status with colored text
            let statusText = 'Status: Pending';
            let color = [128, 128, 128]; // Gray for pending
            if (result.pass === true) {
                statusText = 'Status: Pass';
                color = [0, 128, 0]; // Green
            } else if (result.pass === false) {
                statusText = 'Status: Fail';
                color = [255, 0, 0]; // Red
            }
            doc.setTextColor(...color);
            doc.setFont('helvetica', 'bold');
            doc.text(statusText, marginLeft, y);
            doc.setTextColor(0, 0, 0); // Reset text color to black
            y += 10; // Add spacing after each test

            // Check if the page needs to break
            if (y > 280) {
                doc.addPage();
                y = 20; // Reset vertical position for the new page
            }
        });

        // Add spacing after each type
        y += 10;
    });

    // Save the PDF
    doc.save(`test-run-${new Date(timestamp).toISOString()}.pdf`);
};