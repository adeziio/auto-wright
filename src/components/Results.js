import React, { useState } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText,
    Menu, MenuItem, useTheme
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { exportResultsAsDocx, exportResultsAsPdf } from './ResultsExport';
import ScreenshotModal from '../components/ScreenshotModal';

function formatDuration(ms) {
    if (typeof ms !== 'number' || isNaN(ms) || ms < 0) return 'N/A';
    if (ms < 1000) return '0s';
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

export default function Results({ groupedFilteredResults }) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentExportData, setCurrentExportData] = useState(null);

    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentExportData(null);
    };

    // Now pass both finished and queued to export
    const handleMenuOpen = (event, finished, queued, results) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setCurrentExportData({ finished, queued, results });
    };

    if (!groupedFilteredResults || groupedFilteredResults.length === 0) {
        return null;
    }

    // Filter out runs with no results (empty after filtering)
    // Sort by queued time (newest first, oldest last)
    const sortedResults = [...groupedFilteredResults]
        .filter(run => Array.isArray(run.results) && run.results.length > 0)
        .sort((a, b) => {
            // If either queued is missing, fallback to finished
            if (a.queued && b.queued) {
                return new Date(b.queued) - new Date(a.queued);
            }
            return new Date(b.finished) - new Date(a.finished);
        });

    if (sortedResults.length === 0) {
        return null;
    }

    return (
        <>
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', color: 'text.primary' }}>
                Results Log
            </Typography>
            {sortedResults.map(({ finished, queued, results, status }, index) => {
                const runNumber = sortedResults.length - index; // 1-based, newest is highest
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
                                            onClick={(e) => handleMenuOpen(e, finished, queued, results)}
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
                            <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                    Test Run #{runNumber}:
                                    <span style={{ fontWeight: 400, marginLeft: 8 }}>
                                        {queued ? new Date(queued).toLocaleString() : 'N/A'}
                                        {finished && queued && finished !== queued && (
                                            <>
                                                &rarr; {new Date(finished).toLocaleString()}
                                            </>
                                        )}
                                    </span>
                                </Typography>
                                {/* Duration to the far right, left of status icons, same size as step durations */}
                                {finished && queued && finished !== queued && (
                                    <Typography
                                        variant="body1"
                                        component="span"
                                        sx={{
                                            marginLeft: 'auto',
                                            marginRight: 2,
                                            color: '#888',
                                            fontWeight: 400,
                                            fontSize: '1rem', // match step duration size
                                        }}
                                    >
                                        ({formatDuration(finished - queued)})
                                    </Typography>
                                )}
                            </span>
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

                                    // For each test file, sum durations of its inner results
                                    const testFileDurations = Object.values(
                                        typeResults.reduce((acc, result) => {
                                            acc[result.test] = acc[result.test] || [];
                                            acc[result.test].push(result);
                                            return acc;
                                        }, {})
                                    ).map(testResults =>
                                        testResults.reduce(
                                            (sum, r) => sum + (typeof r.duration === 'number' ? r.duration : 0),
                                            0
                                        )
                                    );

                                    // The duration for the UI/API group is the max of the test file sums
                                    const typeDuration = Math.max(...testFileDurations, 0);

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
                                                <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {type === 'UI' ? 'UI Tests' : 'API Tests'}
                                                    </Typography>
                                                    <Typography
                                                        variant="body1"
                                                        component="span"
                                                        sx={{
                                                            marginLeft: 'auto',
                                                            marginRight: 2,
                                                            color: '#888',
                                                            fontWeight: 400,
                                                            fontSize: '1rem',
                                                        }}
                                                    >
                                                        ({formatDuration(typeDuration)})
                                                    </Typography>
                                                </span>
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

                                                    // For individual test file, duration is the sum of inner results' durations
                                                    const testDuration = testResults.reduce(
                                                        (sum, r) => sum + (typeof r.duration === 'number' ? r.duration : 0),
                                                        0
                                                    );

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
                                                                <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                        {testName}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body1"
                                                                        component="span"
                                                                        sx={{
                                                                            marginLeft: 'auto',
                                                                            marginRight: 2,
                                                                            color: '#888',
                                                                            fontWeight: 400,
                                                                            fontSize: '1rem',
                                                                        }}
                                                                    >
                                                                        ({formatDuration(testDuration)})
                                                                    </Typography>
                                                                </span>
                                                            </AccordionSummary>
                                                            <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                                                <List>
                                                                    {testResults.map((result, idx) => (
                                                                        <ListItem key={idx} divider sx={{ alignItems: 'flex-start' }}>
                                                                            <ListItemText
                                                                                primary={
                                                                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                                                                                            <span style={{ marginRight: 8, color: '#888', fontWeight: 400 }}>
                                                                                                Step {idx + 1}.
                                                                                            </span>
                                                                                            {result.pass === true
                                                                                                ? '✅ Pass'
                                                                                                : result.pass === false
                                                                                                    ? '❌ Fail'
                                                                                                    : '⏳ Pending'}
                                                                                        </Typography>
                                                                                        <span style={{ marginLeft: 'auto', color: '#888', fontWeight: 400 }}>
                                                                                            {result.duration !== undefined && (
                                                                                                <>({formatDuration(result.duration)})</>
                                                                                            )}
                                                                                        </span>
                                                                                    </span>
                                                                                }
                                                                                secondary={
                                                                                    <span>
                                                                                        {result.description && (
                                                                                            <Typography variant="caption" component="span" sx={{ mb: 0.5, display: 'block', color: 'text.secondary' }}>
                                                                                                <strong>Description:</strong> {result.description}
                                                                                            </Typography>
                                                                                        )}
                                                                                        {result.expected !== undefined && (
                                                                                            <Typography variant="caption" component="span" sx={{ mb: 0.5, display: 'block' }}>
                                                                                                <strong>Expected:</strong> <span style={{ fontFamily: 'monospace' }}>{String(result.expected)}</span>
                                                                                            </Typography>
                                                                                        )}
                                                                                        {result.actual !== undefined && (
                                                                                            <Typography variant="caption" component="span" sx={{ mb: 0.5, display: 'block' }}>
                                                                                                <strong>Actual:</strong> <span style={{ fontFamily: 'monospace' }}>{String(result.actual)}</span>
                                                                                            </Typography>
                                                                                        )}
                                                                                        {result.url && (
                                                                                            <Typography variant="caption" component="span" sx={{ mb: 0.5, display: 'block' }}>
                                                                                                <strong>URL:</strong> <span style={{ fontFamily: 'monospace' }}>{result.url}</span>
                                                                                            </Typography>
                                                                                        )}
                                                                                        {result.type === 'API' && (
                                                                                            <span>
                                                                                                {result.request && (
                                                                                                    <Typography variant="caption" component="span" sx={{ mb: 0.5, display: 'block' }}>
                                                                                                        <strong>Request:</strong>{' '}
                                                                                                        <span style={{ fontFamily: 'monospace' }}>
                                                                                                            {JSON.stringify(result.request)}
                                                                                                        </span>
                                                                                                    </Typography>
                                                                                                )}
                                                                                                {result.response && (
                                                                                                    <Typography variant="caption" component="span" sx={{ display: 'block' }}>
                                                                                                        <strong>Response:</strong>{' '}
                                                                                                        <span style={{ fontFamily: 'monospace' }}>
                                                                                                            {JSON.stringify(result.response)}
                                                                                                        </span>
                                                                                                    </Typography>
                                                                                                )}
                                                                                            </span>
                                                                                        )}
                                                                                        {result.screenshotBase64 && <ScreenshotModal screenshotBase64={result.screenshotBase64} />}
                                                                                    </span>
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
                        if (currentExportData) {
                            exportResultsAsDocx(currentExportData.finished, currentExportData.queued, currentExportData.results);
                        }
                        handleMenuClose();
                    }}
                >
                    Export as DOCX
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (currentExportData) {
                            exportResultsAsPdf(currentExportData.finished, currentExportData.queued, currentExportData.results);
                        }
                        handleMenuClose();
                    }}
                >
                    Export as PDF
                </MenuItem>
            </Menu>
        </>
    );
}