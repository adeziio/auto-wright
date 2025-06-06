import React, { useState } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText,
    Menu, MenuItem, useTheme
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { exportResultsAsDocx, exportResultsAsPdf } from './ResultsExport';

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

export default function Results({ groupedResultsByTimestamp }) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentExportData, setCurrentExportData] = useState(null);

    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentExportData(null);
    };

    const handleMenuOpen = (event, timestamp, results) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setCurrentExportData({ timestamp, results });
    };

    if (!groupedResultsByTimestamp || groupedResultsByTimestamp.length === 0) {
        return null;
    }

    const sortedResults = [...groupedResultsByTimestamp].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <>
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', color: 'text.primary' }}>
                Results Log
            </Typography>
            {sortedResults.map(({ timestamp, queued, results, status }, index) => {
                const hasFailedTest = results.some((result) => result.pass === false);
                const isPending = status === 'pending' || results.some(r => r.status === 'pending');

                return (
                    <Accordion
                        key={index}
                        sx={{
                            border: '1px solid #ccc',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            backgroundColor: isPending ? '#f0f0f0' : undefined,
                        }}
                        disabled={isPending}
                    >
                        <AccordionSummary
                            expandIcon={
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ mr: 1, color: hasFailedTest ? 'error.main' : isPending ? 'text.secondary' : 'success.main' }}>
                                        {isPending ? '⏳' : hasFailedTest ? '❌' : '✅'}
                                    </Typography>
                                    {!isPending && (
                                        <DownloadIcon
                                            sx={{
                                                ml: 1,
                                                color: 'primary.main',
                                                cursor: 'pointer',
                                                '&:hover': { color: 'primary.dark' },
                                                fontSize: 24,
                                                verticalAlign: 'middle',
                                            }}
                                            onClick={(e) => handleMenuOpen(e, timestamp, results)}
                                            aria-label="Export Results"
                                        />
                                    )}
                                </span>
                            }
                            sx={{
                                '& .MuiAccordionSummary-expandIconWrapper': {
                                    transform: 'none !important',
                                },
                                backgroundColor: isPending
                                    ? '#e0e0e0'
                                    : hasFailedTest
                                        ? theme.statusColors.fail.background
                                        : theme.statusColors.pass.background,
                                '&:hover': {
                                    backgroundColor: isPending
                                        ? '#e0e0e0'
                                        : hasFailedTest
                                            ? theme.statusColors.fail.hover
                                            : theme.statusColors.pass.hover,
                                },
                                color: 'text.primary',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1, color: 'text.primary' }}>
                                Test Run:
                                <span style={{ fontWeight: 400, marginLeft: 8 }}>
                                    Queued: {queued ? new Date(queued).toLocaleString() : 'N/A'}
                                    {timestamp && queued && timestamp !== queued && (
                                        <>
                                            &rarr; Finished: {new Date(timestamp).toLocaleString()}
                                            <span style={{ marginLeft: 12, color: '#888', fontWeight: 400 }}>
                                                ({formatDuration(timestamp - queued)})
                                            </span>
                                        </>
                                    )}
                                </span>
                            </Typography>
                            {isPending && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        ml: 2,
                                        color: 'text.secondary',
                                        background: '#bdbdbd',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Pending...
                                </Typography>
                            )}
                        </AccordionSummary>
                        <AccordionDetails sx={{ backgroundColor: isPending ? '#f5f5f5' : 'background.paper' }}>
                            {isPending ? (
                                <Typography color="text.secondary">This test run is still pending...</Typography>
                            ) : (
                                Object.entries(
                                    results.reduce((acc, result) => {
                                        acc[result.type] = acc[result.type] || [];
                                        acc[result.type].push(result);
                                        return acc;
                                    }, {})
                                ).map(([type, typeResults], typeIndex) => {
                                    const hasFailedType = typeResults.some((result) => result.pass === false);

                                    return (
                                        <Accordion
                                            key={typeIndex}
                                            sx={{ border: '1px solid #ccc' }}
                                        >
                                            <AccordionSummary
                                                expandIcon={
                                                    <Typography sx={{ mr: 1, color: hasFailedType ? 'error.main' : 'success.main' }}>
                                                        {hasFailedType ? '❌' : '✅'}
                                                    </Typography>
                                                }
                                                sx={{
                                                    '& .MuiAccordionSummary-expandIconWrapper': {
                                                        transform: 'none !important',
                                                    },
                                                    backgroundColor: hasFailedType
                                                        ? theme.statusColors.fail.background
                                                        : theme.statusColors.pass.background,
                                                    '&:hover': {
                                                        backgroundColor: hasFailedType
                                                            ? theme.statusColors.fail.hover
                                                            : theme.statusColors.pass.hover,
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
                                                    const hasFailedTest = testResults.some((result) => result.pass === false);

                                                    return (
                                                        <Accordion
                                                            key={testIndex}
                                                            sx={{ border: '1px solid #ccc' }}
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
                                                                        transform: 'none !important',
                                                                    },
                                                                    backgroundColor: hasFailedTest
                                                                        ? theme.statusColors.fail.background
                                                                        : theme.statusColors.pass.background,
                                                                    '&:hover': {
                                                                        backgroundColor: hasFailedTest
                                                                            ? theme.statusColors.fail.hover
                                                                            : theme.statusColors.pass.hover,
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
                                                                                            color:
                                                                                                result.pass === true
                                                                                                    ? 'success.main'
                                                                                                    : result.pass === false
                                                                                                        ? 'error.main'
                                                                                                        : 'text.secondary',
                                                                                        }}
                                                                                    >
                                                                                        {result.pass === true
                                                                                            ? '✅ Pass'
                                                                                            : result.pass === false
                                                                                                ? '❌ Fail'
                                                                                                : '⏳ Pending'}
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
                                })
                            )}
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