// src/utils/dummyDashboardData.js

// Dummy data for the summary cards, matching the structure produced by parseChangeString
export const dummySummaryData = {
    activeUser: 40689,
    activeUserChange: '8.5% Up from yesterday' ,
    totalBuyers: 10293,
    buyersChange: '1.3% Up from yesterday',
    totalSellers: 2040,
    sellersChange: ' 1.8% Up from yesterday', // Matches your screenshot
    totalEarning: 89000.00, // Use a number for calculation
    earningChange: '4.3% Up from yesterday', // Matches your screenshot
};

// Dummy data for the graphs, already in Chart.js format
// This structure matches what the useMemo hook in DashboardHome should eventually produce
export const dummyGraphJsData = {
    salesDetails: {
        labels: ['1k', '5k', '10k', '15k', '20k', '21k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'],
        datasets: [{
            label: 'Sales',
            data: [20, 30, 45, 55, 80, 95, 60, 50, 40, 25, 40, 60, 55, 45], // Sample percentages or relative values
            borderColor: '#4661F0', // Blue color matching design
            backgroundColor: 'rgba(70, 97, 240, 0.1)', // Light blue fill
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#4661F0',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#4661F0',
            pointRadius: 3,
            pointHoverRadius: 5,
             segment: { // Ensure segment color is also applied
                borderColor: '#4661F0'
            },
             // Linear gradient background fill for area chart
            // backgroundColor: (context) => {
            //     const ctx = context.chart.ctx;
            //     const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
            //     gradient.addColorStop(0, 'rgba(70, 97, 240, 0.3)'); // Top color
            //     gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Bottom (transparent)
            //     return gradient;
            // }
        }]
    },
    revenue: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Monthly labels
        datasets: [
          {
            label: 'Sales', // Name for the dataset
            data: [70, 80, 65, 75, 85, 70, 78, 88, 70, 75, 68, 80], // Sample values (e.g., in thousands $)
            borderColor: 'transparent', // No line for area chart
            backgroundColor: 'rgba(149, 117, 205, 0.5)', // Purple fill matching design
            fill: 'start', // Fill from the axis
            tension: 0.4, // Curve the line
            pointRadius: 0, // No points
          },
          {
            label: 'Profit', // Second dataset for the orange area
            data: [85, 70, 90, 80, 100, 95, 88, 75, 92, 89, 98, 110], // Sample values
            borderColor: 'transparent',
            backgroundColor: 'rgba(255, 110, 64, 0.5)', // Orange fill matching design
            fill: 'start',
            tension: 0.4,
            pointRadius: 0,
          }
        ]
    }
};