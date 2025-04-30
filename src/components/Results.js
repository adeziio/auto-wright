import React from 'react';
import { Box, Typography, List, Accordion, AccordionSummary, AccordionDetails, ListItem, ListItemText, Card, CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Results({ groupedFilteredResults }) {
    const hasResults = Object.keys(groupedFilteredResults).length > 0;

    if (!hasResults) {
        return null; // Don't render anything if there are no results
    }

    return (
        <Card sx={{ m: 2, width: '80%' }}>
            <CardContent>
                {Object.entries(groupedFilteredResults).map(([type, typeResults], typeIdx) => (
                    <Box key={typeIdx} sx={{ mt: 4 }}>
                        <Typography variant="h5" sx={{ mb: 2, textAlign: 'left' }}>
                            {type === 'UI' ? 'UI Tests' : 'API Tests'}
                        </Typography>
                        <List>
                            {Object.entries(
                                typeResults.reduce((acc, result) => {
                                    acc[result.test] = acc[result.test] || [];
                                    acc[result.test].push(result);
                                    return acc;
                                }, {})
                            ).map(([testName, testResults], idx) => (
                                <Accordion key={idx}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                                            {testName} ({testResults.length})
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color={testResults.some(result => !result.pass) ? 'error.main' : 'success.main'}
                                            sx={{ marginRight: 2 }}
                                        >
                                            {testResults.some(result => !result.pass) ? '❌ Fail' : '✅ Pass'}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <List>
                                            {testResults.map((result, subIdx) => (
                                                <ListItem key={subIdx} divider>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body2" component="span" color={result.pass ? 'success.main' : 'error.main'}>
                                                                Result: {result.pass ? '✅ Pass' : '❌ Fail'}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <>
                                                                <Typography variant="body2" component="span" sx={{ display: 'block', mt: 1 }}>
                                                                    <strong>Expected:</strong>
                                                                </Typography>
                                                                <Typography variant="body2" component="span" sx={{ display: 'block', ml: 2 }}>
                                                                    {result.expected}
                                                                </Typography>
                                                                <Typography variant="body2" component="span" sx={{ display: 'block', mt: 1 }}>
                                                                    <strong>Actual:</strong>
                                                                </Typography>
                                                                <Typography variant="body2" component="span" sx={{ display: 'block', ml: 2 }}>
                                                                    {result.actual}
                                                                </Typography>
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </List>
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
}