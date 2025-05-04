import { Paper, Typography, Box, useMediaQuery ,useTheme} from '@mui/material';
import Chart from 'react-apexcharts';

const SummaryCard = ({ title, data = [0, 0], labels, colors }) => {
    console.log('SummaryCard Data:', { title, data, labels, colors });
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
  
    const chartHeight = isSmallScreen ? '180px' : isMediumScreen ? '220px' :isLargeScreen?'400px':'230px';

    const defaultColors = ['#846cf9', '#ff9e69']; // deep blue and gold

    const options = {
        chart: {
            width: '100%',
            type: 'donut',
            background: '#FFFFFF'
        },
        labels: labels,
        colors: colors || defaultColors,
        dataLabels: {
            enabled: true,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%'
                }
            }
        },
        theme: {
            mode: 'light',
            palette: 'palette1'
        },
        legend: {
            show: true,
            position: 'bottom',
            labels: {
                colors: '#2C3E50'  // text color
            }
        }
    };

    // Force positive numbers for the chart
    const chartData = data.map(val => Math.max(0, Number(val) || 0));
    
    // Check if all values in chartData are zero
    const isAllZero = chartData.every(value => value === 0);

    return (
        <Paper sx={{
            p: 2,
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
           display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography variant="h4" gutterBottom>{title}</Typography>
            
            {isAllZero ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: chartHeight,
                    height:{chartHeight},
                    flexGrow: 1,
                    py: 4
                }}>
                    <Typography variant="h4" color="text.secondary">
                        No Room is Available
                    </Typography>
                </Box>
            ) : (
                <Chart
                height={chartHeight}
                    options={options}
                    series={chartData}
                    type="donut"
                    width="100%"
                />
            )}
        </Paper>
    );
};

export default SummaryCard;