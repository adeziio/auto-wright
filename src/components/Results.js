import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download'; // Download icon
import { exportResultsAsDocx, exportResultsAsPdf } from './ResultsExport'; // Import export functions

export default function Results({ groupedResultsByTimestamp }) {
    const theme = useTheme(); // Access the theme
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentExportData, setCurrentExportData] = useState(null);

    const handleMenuOpen = (event, timestamp, results) => {
        event.stopPropagation(); // Prevent accordion toggle
        setAnchorEl(event.currentTarget);
        setCurrentExportData({ timestamp, results });
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentExportData(null);
    };

    // If no data, return null (render nothing)
    if (!groupedResultsByTimestamp || groupedResultsByTimestamp.length === 0) {
        return null;
    }

    const sortedResults = [...groupedResultsByTimestamp].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <>
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', color: 'text.primary' }}>
                Results Log
            </Typography>
            {sortedResults.map(({ timestamp, results }, index) => {
                const hasFailedTest = results.some((result) => !result.pass);

                return (
                    <Accordion
                        key={index}
                        sx={{
                            border: '1px solid #ccc',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={
                                <Typography sx={{ mr: 1, color: hasFailedTest ? 'error.main' : 'success.main' }}>
                                    {hasFailedTest ? '❌' : '✅'}
                                </Typography>
                            }
                            sx={{
                                '& .MuiAccordionSummary-expandIconWrapper': {
                                    transform: 'none !important', // Prevent rotation
                                },
                                backgroundColor: hasFailedTest
                                    ? theme.statusColors.fail.background // Use theme color for fail
                                    : theme.statusColors.pass.background, // Use theme color for pass
                                '&:hover': {
                                    backgroundColor: hasFailedTest
                                        ? theme.statusColors.fail.hover // Use theme hover color for fail
                                        : theme.statusColors.pass.hover, // Use theme hover color for pass
                                },
                                color: 'text.primary',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1, color: 'text.primary' }}>
                                Test Run: {new Date(timestamp).toLocaleString()}
                            </Typography>
                            <IconButton
                                color="primary"
                                onClick={(e) => handleMenuOpen(e, timestamp, results)}
                                sx={{ ml: 2 }}
                            >
                                <DownloadIcon />
                            </IconButton>
                        </AccordionSummary>
                        <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                            {Object.entries(
                                results.reduce((acc, result) => {
                                    acc[result.type] = acc[result.type] || [];
                                    acc[result.type].push(result);
                                    return acc;
                                }, {})
                            ).map(([type, typeResults], typeIndex) => {
                                const hasFailedTest = typeResults.some((result) => !result.pass);

                                return (
                                    <Accordion
                                        key={typeIndex}
                                        sx={{
                                            border: '1px solid #ccc',
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <Typography sx={{ mr: 1, color: hasFailedTest ? 'error.main' : 'success.main' }}>
                                                    {hasFailedTest ? '❌' : '✅'}
                                                </Typography>
                                            }
                                            sx={{
                                                '& .MuiAccordionSummary-expandIconWrapper': {
                                                    transform: 'none !important', // Prevent rotation
                                                },
                                                backgroundColor: hasFailedTest
                                                    ? theme.statusColors.fail.background // Use theme color for fail
                                                    : theme.statusColors.pass.background, // Use theme color for pass
                                                '&:hover': {
                                                    backgroundColor: hasFailedTest
                                                        ? theme.statusColors.fail.hover // Use theme hover color for fail
                                                        : theme.statusColors.pass.hover, // Use theme hover color for pass
                                                },
                                                color: 'text.primary',
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {type === 'UI' ? 'UI Tests' : 'API Tests'}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                            {Object.entries(
                                                typeResults.reduce((acc, result) => {
                                                    acc[result.test] = acc[result.test] || [];
                                                    acc[result.test].push(result);
                                                    return acc;
                                                }, {})
                                            ).map(([testName, testResults], testIndex) => {
                                                const hasFailedTest = testResults.some((result) => !result.pass);

                                                return (
                                                    <Accordion
                                                        key={testIndex}
                                                        sx={{
                                                            border: '1px solid #ccc',
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={
                                                                <Typography
                                                                    sx={{
                                                                        mr: 1,
                                                                        color: hasFailedTest ? 'error.main' : 'success.main',
                                                                    }}
                                                                >
                                                                    {hasFailedTest ? '❌' : '✅'}
                                                                </Typography>
                                                            }
                                                            sx={{
                                                                '& .MuiAccordionSummary-expandIconWrapper': {
                                                                    transform: 'none !important', // Prevent rotation
                                                                },
                                                                backgroundColor: hasFailedTest
                                                                    ? theme.statusColors.fail.background // Use theme color for fail
                                                                    : theme.statusColors.pass.background, // Use theme color for pass
                                                                '&:hover': {
                                                                    backgroundColor: hasFailedTest
                                                                        ? theme.statusColors.fail.hover // Use theme hover color for fail
                                                                        : theme.statusColors.pass.hover, // Use theme hover color for pass
                                                                },
                                                                color: 'text.primary',
                                                            }}
                                                        >
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                {testName}
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                                            <List>
                                                                {testResults.map((result, idx) => (
                                                                    <ListItem key={idx} divider>
                                                                        <ListItemText
                                                                            primary={
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    component="span"
                                                                                    sx={{
                                                                                        fontWeight: 'bold',
                                                                                        color: result.pass
                                                                                            ? 'success.main'
                                                                                            : 'error.main',
                                                                                    }}
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
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        exportResultsAsDocx(currentExportData.timestamp, currentExportData.results);
                        handleMenuClose();
                    }}
                >
                    Export as DOCX
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        exportResultsAsPdf(currentExportData.timestamp, currentExportData.results);
                        handleMenuClose();
                    }}
                >
                    Export as PDF
                </MenuItem>
            </Menu>
        </>
    );
}