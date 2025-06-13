import { Document, Packer, Paragraph, TextRun } from 'docx';
import jsPDF from 'jspdf';

// Helper to format ms to h/m/s
function formatDuration(ms) {
    if (!ms || ms < 0) return 'N/A';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
        hours > 0 ? `${hours}h` : null,
        minutes > 0 ? `${minutes}m` : null,
        `${seconds}s`
    ].filter(Boolean).join(' ');
}

export const exportResultsAsDocx = (finished, queued, results) => {
    const groupedByType = results.reduce((acc, result) => {
        acc[result.type] = acc[result.type] || [];
        acc[result.type].push(result);
        return acc;
    }, {});

    const duration = finished && queued ? formatDuration(finished - queued) : 'N/A';
    const queuedStr = queued ? new Date(queued).toLocaleString() : 'N/A';
    const finishedStr = finished ? new Date(finished).toLocaleString() : 'N/A';

    const title = new Paragraph({
        children: [
            new TextRun({
                text: `Test Run: ${queuedStr} -> ${finishedStr} (${duration})`,
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
            if (result.test !== lastTestName) {
                resultParagraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: result.test,
                                bold: true,
                                size: 24,
                            }),
                        ],
                        spacing: { after: 100 },
                    })
                );
                lastTestName = result.test;
                stepCounter = 1;
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

            const durationPara = new Paragraph({
                children: [
                    new TextRun({ text: 'Duration: ', bold: true }),
                    new TextRun(
                        result.duration !== undefined
                            ? formatDuration(result.duration)
                            : duration
                    ),
                ],
            });

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
                durationPara,
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
        link.download = `test-run-${finished ? new Date(finished).toISOString() : 'unknown'}.docx`;
        link.click();
        URL.revokeObjectURL(url);
    });
};

export const exportResultsAsPdf = (finished, queued, results) => {
    const doc = new jsPDF();
    const marginLeft = 10;
    let y = 20;

    const duration = finished && queued ? formatDuration(finished - queued) : 'N/A';
    const queuedStr = queued ? new Date(queued).toLocaleString() : 'N/A';
    const finishedStr = finished ? new Date(finished).toLocaleString() : 'N/A';

    // Title line with queued, finished, and duration
    const title = `Test Run: ${queuedStr} -> ${finishedStr} (${duration})`;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, marginLeft, y);
    y += 12;

    // Group results by type (e.g., UI, API)
    const groupedByType = results.reduce((acc, result) => {
        acc[result.type] = acc[result.type] || [];
        acc[result.type].push(result);
        return acc;
    }, {});

    Object.entries(groupedByType).forEach(([type, typeResults]) => {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(type === 'UI' ? 'UI Tests' : 'API Tests', marginLeft, y);
        y += 8;

        let lastTestName = null;
        let stepCounter = 1;

        typeResults.forEach((result, idx) => {
            if (result.test !== lastTestName) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(result.test, marginLeft, y);
                y += 7;
                lastTestName = result.test;
                stepCounter = 1;
            }

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`Step ${stepCounter++}`, marginLeft, y);
            y += 6;

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

            if (result.description) {
                doc.setFont('helvetica', 'normal');
                doc.text(`Description: ${result.description}`, marginLeft, y);
                y += 6;
            }

            doc.setFont('helvetica', 'normal');
            doc.text(
                `Duration: ${result.duration !== undefined
                    ? formatDuration(result.duration)
                    : duration
                }`,
                marginLeft,
                y
            );
            y += 6;

            doc.text(`Expected: ${result.expected !== undefined ? String(result.expected) : 'N/A'}`, marginLeft, y);
            y += 6;

            doc.text(`Actual: ${result.actual !== undefined ? String(result.actual) : 'N/A'}`, marginLeft, y);
            y += 6;

            if (result.url) {
                doc.text(`URL: ${result.url}`, marginLeft, y);
                y += 6;
            }

            if (result.request) {
                doc.text(`Request: ${JSON.stringify(result.request)}`, marginLeft, y);
                y += 6;
            }

            if (result.response) {
                doc.text(`Response: ${JSON.stringify(result.response)}`, marginLeft, y);
                y += 6;
            }

            y += 4;

            if (y > 280) {
                doc.addPage();
                y = 20;
            }
        });

        y += 10;
    });

    doc.save(`test-run-${finished ? new Date(finished).toISOString() : 'unknown'}.pdf`);
};