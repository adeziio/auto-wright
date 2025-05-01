import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Pass icon
import ErrorIcon from '@mui/icons-material/Error'; // Fail icon

export default function Results({ groupedResultsByTimestamp }) {
    if (!groupedResultsByTimestamp || groupedResultsByTimestamp.length === 0) {
        return <Typography>No results to display.</Typography>;
    }

    // Sort the results by latest timestamp first
    const sortedResults = [...groupedResultsByTimestamp].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <>
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
                Results Log
            </Typography>
            {sortedResults.map(({ timestamp, results }, index) => {
                // Determine if there is at least one failed test in the entire run
                const hasFailedTest = results.some((result) => !result.pass);

                return (
                    <Accordion key={index}>
                        <AccordionSummary
                            expandIcon={
                                hasFailedTest ? (
                                    <ErrorIcon color="error" sx={{ mr: 1 }} />
                                ) : (
                                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                )
                            }
                            sx={{
                                '& .MuiAccordionSummary-expandIconWrapper': {
                                    transform: 'none !important', // Prevent rotation
                                },
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Test Run: {new Date(timestamp).toLocaleString()}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {/* Group results by type */}
                            {Object.entries(
                                results.reduce((acc, result) => {
                                    acc[result.type] = acc[result.type] || [];
                                    acc[result.type].push(result);
                                    return acc;
                                }, {})
                            ).map(([type, typeResults], typeIndex) => {
                                // Determine if there is at least one failed test in the type group
                                const hasFailedTest = typeResults.some((result) => !result.pass);

                                return (
                                    <Accordion key={typeIndex}>
                                        <AccordionSummary
                                            expandIcon={
                                                hasFailedTest ? (
                                                    <ErrorIcon color="error" sx={{ mr: 1 }} />
                                                ) : (
                                                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                                )
                                            }
                                            sx={{
                                                '& .MuiAccordionSummary-expandIconWrapper': {
                                                    transform: 'none !important', // Prevent rotation
                                                },
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {type === 'UI' ? 'UI Tests' : 'API Tests'}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {/* Nested accordion for each test */}
                                            {Object.entries(
                                                typeResults.reduce((acc, result) => {
                                                    acc[result.test] = acc[result.test] || [];
                                                    acc[result.test].push(result);
                                                    return acc;
                                                }, {})
                                            ).map(([testName, testResults], testIndex) => {
                                                // Determine if there is at least one failed test in the test group
                                                const hasFailedTest = testResults.some((result) => !result.pass);

                                                return (
                                                    <Accordion key={testIndex}>
                                                        <AccordionSummary
                                                            expandIcon={
                                                                hasFailedTest ? (
                                                                    <ErrorIcon color="error" sx={{ mr: 1 }} />
                                                                ) : (
                                                                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                                                )
                                                            }
                                                            sx={{
                                                                '& .MuiAccordionSummary-expandIconWrapper': {
                                                                    transform: 'none !important', // Prevent rotation
                                                                },
                                                            }}
                                                        >
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                {testName}
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <List>
                                                                {testResults.map((result, idx) => (
                                                                    <ListItem key={idx} divider>
                                                                        <ListItemText
                                                                            primary={
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    component="span"
                                                                                    sx={{ fontWeight: 'bold' }}
                                                                                >
                                                                                    {result.pass ? '✅ Pass' : '❌ Fail'}
                                                                                </Typography>
                                                                            }
                                                                            secondary={
                                                                                <>
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        component="span"
                                                                                        sx={{ mt: 1, display: 'block' }}
                                                                                    >
                                                                                        <strong>Expected:</strong> {result.expected}
                                                                                    </Typography>
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        component="span"
                                                                                        sx={{ mt: 1, display: 'block' }}
                                                                                    >
                                                                                        <strong>Actual:</strong> {result.actual}
                                                                                    </Typography>
                                                                                </>
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                );
                                            })}
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </>
    );
}