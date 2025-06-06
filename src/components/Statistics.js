import React from 'react';
import { Box, Typography, useTheme } from '@mui/material'; // Import useTheme
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Statistics({ groupedFilteredResults }) {
    const theme = useTheme(); // Access the theme

    // Check if there is any data
    const hasData = groupedFilteredResults && groupedFilteredResults.length > 0;

    // If no data, return null (render nothing)
    if (!hasData) {
        return null;
    }

    // Flatten results for easier processing
    const flattenedResults = groupedFilteredResults.flatMap((run) => run.results);

    // Group results by type
    const groupedByType = flattenedResults.reduce((acc, result) => {
        acc[result.type] = acc[result.type] || [];
        acc[result.type].push(result);
        return acc;
    }, {});

    // Prepare data for the charts
    const types = Object.keys(groupedByType);
    const passFailCounts = types.map((type) => {
        const results = groupedByType[type];
        const passCount = results.filter((result) => result.pass).length;
        const failCount = results.length - passCount;
        return { type, pass: passCount, fail: failCount };
    });

    const totalPass = passFailCounts.reduce((sum, counts) => sum + counts.pass, 0);
    const totalFail = passFailCounts.reduce((sum, counts) => sum + counts.fail, 0);

    // Data for the pie chart
    const pieChartData = {
        labels: [`Pass (${totalPass})`, `Fail (${totalFail})`], // Include values in the labels
        datasets: [
            {
                data: [totalPass, totalFail],
                backgroundColor: [
                    theme.statusColors.pass.background, // Use theme color for pass
                    theme.statusColors.fail.background, // Use theme color for fail
                ],
                hoverBackgroundColor: [
                    theme.statusColors.pass.hover, // Use theme hover color for pass
                    theme.statusColors.fail.hover, // Use theme hover color for fail
                ],
            },
        ],
    };

    // Data for the bar chart
    const barChartData = {
        labels: types.map((type, index) => {
            const { pass, fail } = passFailCounts[index];
            return `${type} (Pass: ${pass}, Fail: ${fail})`; // Include values in the labels
        }),
        datasets: [
            {
                label: `Pass (${totalPass})`, // Include total pass count in the legend
                data: passFailCounts.map((counts) => counts.pass),
                backgroundColor: theme.statusColors.pass.background, // Use theme color for pass
            },
            {
                label: `Fail (${totalFail})`, // Include total fail count in the legend
                data: passFailCounts.map((counts) => counts.fail),
                backgroundColor: theme.statusColors.fail.background, // Use theme color for fail
            },
        ],
    };

    return (
        <>
            {/* Pie Chart */}
            <Box
                sx={{
                    width: '100%',
                    height: '45%', // Allocate 45% of the height to the pie chart
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 2, // Add spacing between the charts
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Overall Pass/Fail Ratio
                </Typography>
                <Pie
                    data={pieChartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false, // Allow the chart to resize dynamically
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        size: 18, // Adjust font size for better visibility
                                    },
                                },
                            },
                        },
                    }}
                />
            </Box>

            {/* Bar Chart */}
            <Box
                sx={{
                    width: '100%',
                    height: '45%', // Allocate 45% of the height to the bar chart
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Pass/Fail by Type
                </Typography>
                <Bar
                    data={barChartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false, // Allow the chart to resize dynamically
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        size: 18, // Adjust font size for better visibility
                                    },
                                },
                            },
                        },
                    }}
                />
            </Box>
        </>
    );
}