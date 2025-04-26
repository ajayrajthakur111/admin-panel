// src/pages/DashboardHome.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  LinearProgress,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// Chart.js imports and registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Import async thunks for dashboard data
import {
  fetchDashboardData,
  fetchGraphData,
} from "../features/dashboard/dashboardSlice";
import {
  History,
  QueryStats,
  SupervisorAccount,
  TrendingDown,
  TrendingUp,
  ViewInAr,
} from "@mui/icons-material";

// Styled Paper for the summary cards
const SummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "left",
  color: theme.palette.text.secondary,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "230px",
  height: "150px",
  borderRadius: "12px",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
  border: "1px solid #eee",
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#FFFFFF",
}));

// Styled icon containers for the cards
const IconContainer = styled(Box)(({ bgcolor }) => ({
  position: "absolute",
  top: "15px",
  right: "15px",
  width: "45px",
  height: "45px",
  backgroundColor: bgcolor || "rgba(77, 182, 172, 0.1)",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// Styled change indicator
const ChangeIndicator = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
  fontSize: "0.875rem",
});

// Mapping card types to icon background colors and icons (using Unicode emojis for now)
const cardStyles = {
  activeUser: {
    bgcolor: "rgba(146, 170, 239, 0.1)",
    iconColor: "#92AAEF",
  },
  totalBuyers: {
    bgcolor: "rgba(255, 208, 66, 0.1)",
    iconColor: "#FFD042",
  },
  totalSellers: {
    bgcolor: "rgba(255, 138, 101, 0.1)",
    iconColor: "#FF8A65",
  },
  totalEarning: {
    bgcolor: "rgba(111, 222, 186, 0.1)",
    iconColor: "#6FDEBA",
  }, // API names
};

function DashboardHome() {
  const dispatch = useDispatch();
  const { summary, graphData, isLoading, summaryError, graphError } =
    useSelector((state) => state.dashboard);

  // State for the period selector
  const [selectedPeriod, setSelectedPeriod] = useState(
    new Date().toLocaleString("default", { month: "long" })
  ); // Set to current month

  // Fetch data on component mount and when selectedPeriod changes
  useEffect(() => {
    // Fetch summary data (doesn't seem to be filterable by period based on API spec)
    dispatch(fetchDashboardData());

    // Determine the correct filterType and value for the graph data API
    const currentDate = new Date();
    let filterType = "month";
    let value = "";

    if (selectedPeriod === "Year") {
      filterType = "year";
      value = currentDate.getFullYear().toString();
    } else {
      // Map month name to 'YYYY-MM' format
      const monthMap = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
      };
      const monthNumber = monthMap[selectedPeriod];
      if (monthNumber) {
        // Determine the year. For simplicity, assume current year unless month is in the past relative to now.
        // For truly dynamic filtering, you might need year selection UI.
        const year = currentDate.getFullYear();
        const monthString =
          monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
        value = `${year}-${monthString}`;
      } else {
        // Fallback if selectedPeriod is not a recognized month or 'Year'
        filterType = "year";
        value = currentDate.getFullYear().toString();
        console.warn(
          "Unknown period selected:",
          selectedPeriod,
          "Falling back to current yearly data."
        );
      }
    }

    console.log("Dispatching fetchGraphData with:", { filterType, value });
    dispatch(fetchGraphData({ filterType, value }));
  }, [dispatch, selectedPeriod]); // Re-fetch when selectedPeriod changes

  // --- Transform Raw Graph Data from API for Chart.js ---
  const transformedGraphData = useMemo(() => {
    // If graphData is null or empty, return null for charts
    if (!graphData) {
      console.warn("No graph data available. Charts will not display.");
      return { salesDetails: null, revenue: null };
    }

    try {
      return {
        salesDetails: {
          labels: graphData.salesDetails.labels,
          datasets: [
            {
              label: "Sales",
              data: graphData.salesDetails.datasets[0].data,
              borderColor: "#4661F0",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#4661F0",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#4661F0",
              pointRadius: 3,
              pointHoverRadius: 5,
              segment: { borderColor: "#4661F0" },
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(
                  0,
                  0,
                  0,
                  context.chart.height
                );
                gradient.addColorStop(0, "rgba(70, 97, 240, 0.3)");
                gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
                return gradient;
              },
            },
          ],
        },
        revenue: {
          labels: graphData.revenue.labels,
          datasets: [
            {
              ...graphData.revenue.datasets[0],
              borderColor: "transparent",
              fill: "start",
              tension: 0.4,
              pointRadius: 0,
            },
            {
              ...graphData.revenue.datasets[1],
              borderColor: "transparent",
              fill: "start",
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        },
      };
    } catch (e) {
      console.error("Error transforming graph data:", e);
      return { salesDetails: null, revenue: null };
    }
  }, [graphData]); // Only recompute when graphData changes

  // Chart options (adjust based on your charting library and desired appearance)
  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        // Adjust min/max based on expected data range (if sales are percentages, keep 0-100)
        // If sales are raw counts, remove min/max or set based on API response data range
        // min: 0,
        // max: 100,
        ticks: {
          stepSize: 20,
          min: 20,
          callback: function (value) {
            // Format based on whether data is percentage or count
            // Assuming sales data is percentage for the graph UI shown
            return value + "%";
            // If sales data is count: return value.toLocaleString();
          },
          font: {
            size: 10,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false, // Hide vertical grid lines
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            const value = context.raw;
            label += value + "%"; // Assuming sales are percentages for tooltip
            return label;
          },
        },
      },
    },
    hover: { mode: "index", intersect: false },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 3, hoverRadius: 5 },
    },
    // Add layout padding to prevent points being cut off at edges
    layout: {
      padding: { left: 10, right: 10, top: 10, bottom: 10 },
    },
  };

  // Chart options for Revenue
  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
          font: { size: 10 },
        },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 8,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            const value = context.raw;
            label += "$" + value;
            return label;
          },
        },
      },
    },
    hover: { mode: "index", intersect: false },
    elements: { line: { tension: 0.4 }, point: { radius: 0 } },
    layout: {
      // Add layout padding
      padding: { left: 10, right: 10, top: 10, bottom: 10 },
    },
  };

  // Function to render the change indicator text and arrow
  const renderChangeIndicator = (changeData) => {
    if (!changeData) return null;

    // Extract percentage and direction from the text
    const matches = changeData.match(/(\d+\.?\d*)%\s+(Up|Down)/i);
    if (!matches) return null;

    const [, percentage, direction] = matches;
    const isUp = direction.toLowerCase() === "up";
    const color = isUp ? "#4CAF50" : "#F44336";
    const Icon = isUp ? TrendingUp : TrendingDown;

    // Split the text into colored and gray parts
    const remainingText = changeData.replace(`${percentage}% ${direction}`, "");

    return (
      <ChangeIndicator>
        <Icon sx={{ color: color }} />
        <Typography component="span" variant="body2">
          <Box
            component="span"
            sx={{ color: color, fontWeight: "bold", fontSize: 14 }}
          >
            {percentage}%
          </Box>
          <Box component="span" sx={{ color: "text.secondary" }}>
            {` ${direction}${remainingText}`}
          </Box>
        </Typography>
      </ChangeIndicator>
    );
  };

  // Show loading spinner or linear progress bar
  if (isLoading && !summary && !graphData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if fetching failed
  if (summaryError || graphError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{summaryError || graphError}</Alert>
      </Box>
    );
  }

  // Check if both summary and graph data are still null after loading (e.g., API returned no data)
  if (
    !summary &&
    !transformedGraphData?.salesDetails &&
    !transformedGraphData?.revenue
  ) {
    // This check might be too strict if you expect summary but no graph data, or vice versa.
    // Adjust based on what constitutes a "no data" state for the entire dashboard.
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No dashboard data available.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 4, textAlign: "left" }}
      >
        Dashboard
      </Typography>

      {/* Summary Cards - Use 'summary' directly from Redux */}
      {summary ? ( // Only render if summary data is available
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Active Users Card */}
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard>
              <IconContainer bgcolor={cardStyles.activeUser.bgcolor}>
                {" "}
                {/* Use API key name */}
                <Box
                  sx={{
                    color: cardStyles.activeUser.iconColor,
                    fontSize: "24px",
                  }}
                >
                  <SupervisorAccount />
                </Box>
              </IconContainer>
              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Active Users
                </Typography>
                <Typography
                  variant="h5"
                  color="text.primary"
                  fontWeight="bold"
                  sx={{ mt: 1 }}
                >
                  {summary.activeUser?.toLocaleString() || "0"}{" "}
                  {/* Use summary.activeUser, default to 0 */}
                </Typography>
              </Box>
              {renderChangeIndicator(summary.activeUserChange)}
            </SummaryCard>
          </Grid>

          {/* Total Buyers Card */}
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard>
              <IconContainer bgcolor={cardStyles.totalBuyers.bgcolor}>
                {" "}
                {/* Use API key name */}
                <Box
                  sx={{
                    color: cardStyles.totalBuyers.iconColor,
                    fontSize: "24px",
                  }}
                >
                  <ViewInAr />
                </Box>
              </IconContainer>
              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Buyers
                </Typography>
                <Typography
                  variant="h5"
                  color="text.primary"
                  fontWeight="bold"
                  sx={{ mt: 1 }}
                >
                  {summary.totalBuyers?.toLocaleString() || "0"}{" "}
                  {/* Use summary.totalBuyers, default to 0 */}
                </Typography>
              </Box>
              {renderChangeIndicator(summary.buyersChange)}
            </SummaryCard>
          </Grid>

          {/* Total Sellers Card */}
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard>
              <IconContainer bgcolor={cardStyles.totalSellers.bgcolor}>
                {" "}
                {/* Use API key name */}
                <Box
                  sx={{
                    color: cardStyles.totalSellers.iconColor,
                    fontSize: "24px",
                  }}
                >
                  <History />
                </Box>
              </IconContainer>
              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Sellers
                </Typography>
                <Typography
                  variant="h5"
                  color="text.primary"
                  fontWeight="bold"
                  sx={{ mt: 1 }}
                >
                  {summary.totalSellers?.toLocaleString() || "0"}{" "}
                  {/* Use summary.totalSellers, default to 0 */}
                </Typography>
              </Box>
              {renderChangeIndicator(summary.sellersChange)}
            </SummaryCard>
          </Grid>

          {/* Total Sales/Earnings Card (API calls it totalEarning) */}
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard>
              <IconContainer bgcolor={cardStyles.totalEarning.bgcolor}>
                {" "}
                {/* Use API key name */}
                <Box
                  sx={{
                    color: cardStyles.totalEarning.iconColor,
                    fontSize: "24px",
                  }}
                >
                  <QueryStats />{" "}
                </Box>
              </IconContainer>
              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Sales
                </Typography>{" "}
                {/* Display as Sales as per screenshot */}
                <Typography
                  variant="h5"
                  color="text.primary"
                  fontWeight="bold"
                  sx={{ mt: 1 }}
                >
                  ${summary.totalEarning?.toFixed(2) || "0.00"}{" "}
                  {/* Use summary.totalEarning, format to 2 decimal places, default to 0.00 */}
                </Typography>
              </Box>
              {renderChangeIndicator(summary.earningChange)}
            </SummaryCard>
          </Grid>
        </Grid>
      ) : (
        // Show placeholder or message if summary data is null
        !isLoading && (
          <Typography sx={{ mb: 2 }}>Summary data not available.</Typography>
        )
      )}

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
          border: "1px solid #eee",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Sales Details
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sales-period-label">Period</InputLabel>
            <Select
              labelId="sales-period-label"
              value={selectedPeriod}
              label="Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
              sx={{ borderRadius: "8px" }}
            >
              {/* Dynamic year options */}
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <MenuItem key={`year-${year}`} value={`Year-${year}`}>
                    {year}
                  </MenuItem>
                );
              })}
              <Divider />
              {/* Dynamic month options */}
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {/* Check if transformedGraphData and salesDetails exist before rendering chart */}
        {transformedGraphData?.salesDetails ? (
          <Box sx={{ height: 320, position: "relative", mt: 2 }}>
            {/* Pass transformed data to the chart */}
            <Line
              data={transformedGraphData.salesDetails}
              options={salesChartOptions}
            />
            {/* --- Peak value tooltip (if needed) ---
                 Remove this static Box or make it dynamic if you need it.
             */}
          </Box>
        ) : (
          // Show message if sales chart data is not available
          // Don't show if still loading overall
          !isLoading && (
            <Box
              sx={{
                height: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>No sales data available for this period.</Typography>
            </Box>
          )
        )}
      </Paper>

      {/* Revenue Chart - Use transformedGraphData */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
          border: "1px solid #eee",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Revenue
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sales-period-label">Period</InputLabel>
            <Select
              labelId="sales-period-label"
              value={selectedPeriod}
              label="Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
              sx={{ borderRadius: "8px" }}
            >
              {/* Dynamic year options */}
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <MenuItem key={`year-${year}`} value={`Year-${year}`}>
                    {year}
                  </MenuItem>
                );
              })}
              <Divider />
              {/* Dynamic month options */}
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {/* Check if transformedGraphData and revenue exist before rendering chart */}
        {transformedGraphData?.revenue ? (
          <Box sx={{ height: 300, mt: 2 }}>
            {/* Pass transformed data to the chart */}
            <Line
              data={transformedGraphData.revenue}
              options={revenueChartOptions}
            />
          </Box>
        ) : (
          // Show message if revenue chart data is not available
          // Don't show if still loading overall
          !isLoading && (
            <Box
              sx={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>
                No revenue data available for this period.
              </Typography>
            </Box>
          )
        )}
      </Paper>
    </Box>
  );
}

export default DashboardHome;
