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

        const resultParagraphs = [];
        let lastTestName = null;
        let stepCounter = 1;

        typeResults.forEach((result, idx) => {
            // Only add the test name if it's different from the previous one
            if (result.test !== lastTestName) {
                resultParagraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Test: ${result.test}`,
                                bold: true,
                                size: 24,
                            }),
                        ],
                        spacing: { after: 100 },
                    })
                );
                lastTestName = result.test;
                stepCounter = 1; // Reset step number for each new test
            }

            const stepNumber = new Paragraph({
                children: [
                    new TextRun({
                        text: `Step ${stepCounter++}`,
                        bold: true,
                    }),
                ],
            });

            let statusText = 'Pending ⏳';
            if (result.pass === true) statusText = 'Pass ✅';
            else if (result.pass === false) statusText = 'Fail ❌';

            const status = new Paragraph({
                children: [
                    new TextRun({ text: 'Status: ', bold: true }),
                    new TextRun(statusText),
                ],
            });

            const description = result.description
                ? new Paragraph({
                    children: [
                        new TextRun({ text: 'Description: ', bold: true }),
                        new TextRun(result.description),
                    ],
                })
                : null;

            const expected = new Paragraph({
                children: [
                    new TextRun({ text: 'Expected: ', bold: true }),
                    new TextRun(result.expected !== undefined ? String(result.expected) : 'N/A'),
                ],
            });

            const actual = new Paragraph({
                children: [
                    new TextRun({ text: 'Actual: ', bold: true }),
                    new TextRun(result.actual !== undefined ? String(result.actual) : 'N/A'),
                ],
            });

            const url = result.url
                ? new Paragraph({
                    children: [
                        new TextRun({ text: 'URL: ', bold: true }),
                        new TextRun(result.url),
                    ],
                })
                : null;

            const request = result.request
                ? new Paragraph({
                    children: [
                        new TextRun({ text: 'Request: ', bold: true }),
                        new TextRun(JSON.stringify(result.request)),
                    ],
                })
                : null;

            const response = result.response
                ? new Paragraph({
                    children: [
                        new TextRun({ text: 'Response: ', bold: true }),
                        new TextRun(JSON.stringify(result.response)),
                    ],
                })
                : null;

            resultParagraphs.push(
                stepNumber,
                status,
                ...(description ? [description] : []),
                expected,
                actual,
                ...(url ? [url] : []),
                ...(request ? [request] : []),
                ...(response ? [response] : []),
                new Paragraph({ children: [], spacing: { after: 300 } })
            );
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
    const marginLeft = 10;
    let y = 20;

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

    Object.entries(groupedByType).forEach(([type, typeResults]) => {
        // Type header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(type === 'UI' ? 'UI Tests' : 'API Tests', marginLeft, y);
        y += 8;

        let lastTestName = null;
        let stepCounter = 1;

        typeResults.forEach((result, idx) => {
            // Only add the test name if it's different from the previous one
            if (result.test !== lastTestName) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(`Test: ${result.test}`, marginLeft, y);
                y += 7;
                lastTestName = result.test;
                stepCounter = 1; // Reset step number for each new test
            }

            // Step number
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`Step ${stepCounter++}`, marginLeft, y);
            y += 6;

            // Status
            let statusText = 'Status: Pending ⏳';
            let color = [128, 128, 128];
            if (result.pass === true) {
                statusText = 'Status: Pass ✅';
                color = [0, 128, 0];
            } else if (result.pass === false) {
                statusText = 'Status: Fail ❌';
                color = [255, 0, 0];
            }
            doc.setTextColor(...color);
            doc.setFont('helvetica', 'bold');
            doc.text(statusText, marginLeft, y);
            doc.setTextColor(0, 0, 0);
            y += 6;

            // Description
            if (result.description) {
                doc.setFont('helvetica', 'normal');
                doc.text(`Description: ${result.description}`, marginLeft, y);
                y += 6;
            }

            // Expected
            doc.text(`Expected: ${result.expected !== undefined ? String(result.expected) : 'N/A'}`, marginLeft, y);
            y += 6;

            // Actual
            doc.text(`Actual: ${result.actual !== undefined ? String(result.actual) : 'N/A'}`, marginLeft, y);
            y += 6;

            // URL
            if (result.url) {
                doc.text(`URL: ${result.url}`, marginLeft, y);
                y += 6;
            }

            // Request
            if (result.request) {
                doc.text(`Request: ${JSON.stringify(result.request)}`, marginLeft, y);
                y += 6;
            }

            // Response
            if (result.response) {
                doc.text(`Response: ${JSON.stringify(result.response)}`, marginLeft, y);
                y += 6;
            }

            y += 4; // Spacing after each step

            // Page break if needed
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
        });

        y += 10; // Spacing after each type
    });

    doc.save(`test-run-${new Date(timestamp).toISOString()}.pdf`);
};