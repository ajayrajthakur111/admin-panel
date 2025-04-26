// src/components/Layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAdmin } from '../../features/auth/authSlice';

import {
  Box,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
  Paper
} from '@mui/material';
import { styled } from '@mui/system';

// Import Icons (ensure you have @mui/icons-material installed)
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PolicyIcon from '@mui/icons-material/Policy';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

// Icons for Notification Dropdown (examples - replace with actual icons if different)
import BuildIcon from '@mui/icons-material/Build'; // Settings
import EventIcon from '@mui/icons-material/Event'; // Event Update
import PersonIcon from '@mui/icons-material/Person'; // Profile
import ErrorIcon from '@mui/icons-material/Error'; // Application Error

// Icons for Profile Dropdown
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'; // Manage Account
import LockOpenIcon from '@mui/icons-material/LockOpen'; // Change Password
import HistoryIcon from '@mui/icons-material/History'; // Activity Log
import LogoutIcon from '@mui/icons-material/Logout'; // Log out


const drawerWidth = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#fff',
  color: '#333',
  boxShadow: 'none',
  borderBottom: '1px solid #ddd',
}));

const StyledDrawer = styled(Drawer)({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        color: '#000',
        '& .Mui-selected': {
            backgroundColor: '#198fa3',
            color: '#fff',
        },
    },
});

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(8),
  backgroundColor: 'transparent',
  minHeight: '100vh',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    fontWeight:700,
  '&.Mui-selected': {
    backgroundColor: '#198fa3',
    color:"#fff",
    '& .MuiListItemIcon-root': {
      color: '#fff',
    },
    '&:hover': {
      backgroundColor: '#14abc6',
    },
  },
  '&:hover': {
    backgroundColor: '#eff1f1',
    color:"#363535"
  },
  paddingLeft: theme.spacing(2), // Default padding
}));

const StyledSubListItemButton = styled(ListItemButton)(({ theme }) => ({
    textAlign:'center',
   '&.Mui-selected': {
    backgroundColor: 'transparent', // Match parent highlight
    '&:hover': {
      backgroundColor: '#198fa3',
    },
  },
  '&:hover': {
    backgroundColor: '#005a4e', // Slightly lighter hover for sub-items
  },
  paddingLeft: theme.spacing(4), // Indent sub-menu items
}));
const iconMap = {
    Dashboard: <DashboardIcon sx={{ color: 'currentColor' }} />,
    Article: <ArticleIcon sx={{ color: 'currentColor' }} />,
    'Auto dealership': <DirectionsCarIcon sx={{ color: 'currentColor' }} />,
    Blog: <RssFeedIcon sx={{ color: 'currentColor' }} />,
    Career: <WorkIcon sx={{ color: 'currentColor' }} />,
    'Country, state, city': <LocationOnIcon sx={{ color: 'currentColor' }} />,
    "FAQ's": <HelpOutlineIcon sx={{ color: 'currentColor' }} />,
    'Free shop news': <ShoppingBagIcon sx={{ color: 'currentColor' }} />,
    'Help Center': <HelpOutlineIcon sx={{ color: 'currentColor' }} />,
    'How it works': <SettingsIcon sx={{ color: 'currentColor' }} />,
    Jobs: <WorkIcon sx={{ color: 'currentColor' }} />,
    Press: <DescriptionIcon sx={{ color: 'currentColor' }} />,
    Product: <ShoppingBagIcon sx={{ color: 'currentColor' }} />,
    'Privacy & Terms': <PolicyIcon sx={{ color: 'currentColor' }} />,
    'Trust & safety': <VerifiedUserIcon sx={{ color: 'currentColor' }} />,
    'User Management': <SupervisedUserCircleIcon sx={{ color: 'currentColor' }} />,
};

// Sample menu structure (needs to match your actual navigation paths and API endpoints)
const menuItems = [
  { text: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
  { text: 'Article', path: '/article', icon: 'Article' },
  { text: 'Auto dealership', path: '/auto-dealership', icon: 'Auto dealership' },
  {
    text: 'Blog', icon: 'Blog',
    subMenu: [
      { text: 'Blog Posts', path: '/blog/posts' },
      { text: 'Blog Categories', path: '/blog/categories' },
      { text: 'Blog Pages', path: '/blog/pages' },
    ]
  },
  {
    text: 'Career', icon: 'Career',
    subMenu: [
      { text: 'Career Posts', path: '/career/posts' },
      { text: 'Career Openings', path: '/career/openings' },
      { text: 'Career Categories', path: '/career/categories' },
    ]
  },
  { text: 'Country, state, city', path: '/locations', icon: 'Country, state, city' },
  { text: "FAQ's", path: '/faqs', icon: "FAQ's" },
  {
    text: 'Free shop news', icon: 'Free shop news',
     subMenu: [
      { text: 'News Posts', path: '/free-shop-news/posts' },
      { text: 'News Categories', path: '/free-shop-news/categories' },
    ]
  },
  { text: 'Help Center', path: '/help-center', icon: 'Help Center' },
  { text: 'How it works', path: '/how-it-works', icon: 'How it works' },
  { text: 'Jobs', icon: 'Jobs',
    subMenu: [
      { text: 'Job Posts', path: '/jobs/posts' },
      { text: 'Job Categories', path: '/jobs/categories' },
    ]
  },
   { text: 'Press', icon: 'Press',
    subMenu: [
      { text: 'Press News', path: '/press/news' },
      { text: 'Press Categories', path: '/press/categories' },
      { text: 'Press Topics', path: '/press/topics' },
      { text: 'OfferUp News', path: '/press/offerup-news' },
    ]
  },
  { text: 'Product', icon: 'Product',
     subMenu: [
      { text: 'Product Listings', path: '/product/listings' },
      { text: 'Product Categories', path: '/product/categories' },
      { text: 'Subcategories', path: '/product/subcategories' },
      { text: 'Conditions', path: '/product/conditions' },
      { text: 'Brands', path: '/product/brands' },
      { text: 'Models', path: '/product/models' },
    ]
  },
  { text: 'Privacy & Terms', path: '/privacy-terms', icon: 'Privacy & Terms' },
  { text: 'Trust & safety', path: '/trust-safety', icon: 'Trust & safety' },
  { text: 'User Management', path: '/users', icon: 'User Management' },
];

// Sample Notification Data (replace with data fetched from API /api/v1/admin/notification/allAdminNotification)
const mockNotifications = [
    { id: 1, icon: <BuildIcon />, iconBgColor: '#42a5f5', title: 'Settings', description: 'Update Dashboard' },
    { id: 2, icon: <EventIcon />, iconBgColor: '#ec407a', title: 'Event Update', description: 'An event date update again' },
    { id: 3, icon: <PersonIcon />, iconBgColor: '#9575cd', title: 'Profile', description: 'Update your profile' },
    { id: 4, icon: <ErrorIcon />, iconBgColor: '#ef5350', title: 'Application Error', description: 'Check Your runnung application' },
];


function DashboardLayout() {
  const dispatch = useDispatch();
  const location = useLocation(); // To check current path for active sidebar item
  const { user } = useSelector((state) => state.auth);

  // State for menu expansion
  const [openMenus, setOpenMenus] = useState({});
  // State for Header menus
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const isNotificationMenuOpen = Boolean(notificationAnchorEl);
  const isProfileMenuOpen = Boolean(profileAnchorEl);

  // Handlers for Header Menus
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  // Handler for Logout
  const handleLogout = () => {
    dispatch(logoutAdmin());
    handleProfileMenuClose();
  };

  // Handler for Sidebar Menu Expansion
  const handleMenuClick = (text) => {
    setOpenMenus(prev => ({ ...prev, [text]: !prev[text] }));
  };

   // Determine if a sidebar item is currently active
  const isMenuItemActive = (path) => {
      if (!path) return false;
      // Special case for dashboard index route
      if (path === '/dashboard' && location.pathname === '/') return true;
      return location.pathname.startsWith(path);
  }


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Header */}
      <StyledAppBar position="fixed">
        <Toolbar sx={{display:"flex" , justifyContent:'space-between'}}>
          {/* Logo placeholder */}
          <Box sx={{ mr: 2, flexGrow: 0, display: 'flex', alignItems: 'center' }}>
             <img src="src/assets/freeshopps-logo.png" alt="Logo" style={{ height: '50px' }} />
          </Box>
          

          {/* Search Bar */}
          <TextField
             variant="outlined"
             size="small"
             placeholder="Search..."
             sx={{
                mr: 2,
                minWidth: '200px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f0f2f5',
                  '& fieldset': { border: 'none' },
                },
                '& input::placeholder': {
                    opacity: 0.8,
                }
             }}
             InputProps={{
               startAdornment: (
                 <InputAdornment position="start">
                   <SearchIcon sx={{ color: '#777' }} />
                 </InputAdornment>
               ),
             }}
          />
<Box sx={{display:"flex"}}>

          {/* Notifications Icon with Badge and Menu */}
          <IconButton color="inherit" sx={{ mr: 1 }} onClick={handleNotificationMenuOpen}>
             <Badge badgeContent={mockNotifications.length} color="error"> {/* Use actual notification count */}
                <NotificationsIcon />
             </Badge>
          </IconButton>
           <Menu
              anchorEl={notificationAnchorEl}
              open={isNotificationMenuOpen}
              onClose={handleNotificationMenuClose}
              onClick={handleNotificationMenuClose} // Close menu on item click
              PaperProps={{ // Custom styling for the menu paper
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  borderRadius: '8px', // Rounded corners
                  minWidth: 250,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                   // Style the triangle pointer if needed (more complex CSS)
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
               <Typography variant="subtitle2" sx={{ p: 2, fontWeight: 'bold' }}>Notification</Typography>
               <Divider sx={{ mb: 1 }} />
               {/* Map over notification data */}
               {mockNotifications.map(notification => (
                   <MenuItem key={notification.id} sx={{ mb: 1, alignItems: 'flex-start' }}>
                       <ListItemIcon sx={{ minWidth: 40 }}>
                           {/* Custom icon styling */}
                            <Box sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: notification.iconBgColor || '#ddd', // Use color from data or default
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff' // Icon color white
                            }}>
                              {React.cloneElement(notification.icon, { sx: { fontSize: 20 }})} {/* Adjust icon size */}
                           </Box>
                       </ListItemIcon>
                       <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{notification.title}</Typography>
                           <Typography variant="caption" color="text.secondary">{notification.description}</Typography>
                       </Box>
                   </MenuItem>
               ))}
               <Divider sx={{ mt: 1 }} />
               {/* "See all" link */}
               <MenuItem component={Link} to="/notifications" sx={{ justifyContent: 'center' }}> {/* Link to notifications page */}
                   <Typography variant="body2" color="primary">See all notification</Typography>
               </MenuItem>
            </Menu>


          {/* User Info and Profile Menu */}
          <Box
             sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
             onClick={handleProfileMenuOpen}
          >
             {/* Replace with actual user avatar */}
             <Avatar sx={{ bgcolor: '#ffab91', color: '#e64a19', mr: 1 }}>
                 {user?.firstName ? user.firstName.charAt(0) : 'A'} {/* Use user's initial */}
             </Avatar>
             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{user?.fullName || 'Admin User'}</Typography>
                <Typography variant="caption">Admin</Typography>
             </Box>
             {/* Dropdown arrow */}
              <ExpandMore sx={{ ml: 0.5 }} />
          </Box>
           <Menu
              anchorEl={profileAnchorEl}
              open={isProfileMenuOpen}
              onClose={handleProfileMenuClose}
              onClick={handleProfileMenuClose} // Close menu on item click
               PaperProps={{ // Custom styling for the menu paper
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  borderRadius: '8px', // Rounded corners
                  minWidth: 180,
                   // Style the triangle pointer if needed (more complex CSS)
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* Profile Menu Items */}
              <MenuItem component={Link} to="/profile/manage-account"> {/* Link to Manage Account page */}
                 <ListItemIcon>
                     {/* Custom icon styling */}
                      <Box sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#42a5f5', // Example blue color
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          mr: 1, // Margin to separate from text
                      }}>
                        <ManageAccountsIcon sx={{ fontSize: 20 }} />
                     </Box>
                 </ListItemIcon>
                 Manage Account
             </MenuItem>
             <MenuItem component={Link} to="/profile/change-password"> {/* Link to Change Password page */}
                 <ListItemIcon>
                     {/* Custom icon styling */}
                      <Box sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#ec407a', // Example pink color
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          mr: 1,
                      }}>
                        <LockOpenIcon sx={{ fontSize: 20 }} />
                     </Box>
                 </ListItemIcon>
                 Change Password
             </MenuItem>
              <MenuItem component={Link} to="/profile/activity-log"> {/* Link to Activity Log page */}
                 <ListItemIcon>
                     {/* Custom icon styling */}
                      <Box sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#9575cd', // Example purple color
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                           mr: 1,
                      }}>
                        <HistoryIcon sx={{ fontSize: 20 }} />
                     </Box>
                 </ListItemIcon>
                 Activity Log
             </MenuItem>
              <MenuItem onClick={handleLogout}> {/* Calls the logout action */}
                 <ListItemIcon>
                      {/* Custom icon styling */}
                      <Box sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#ff7043', // Example orange color
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                           mr: 1,
                      }}>
                        <LogoutIcon sx={{ fontSize: 20 }} />
                     </Box>
                 </ListItemIcon>
                 Log out
             </MenuItem>
            </Menu>
            </Box>

        </Toolbar>
      </StyledAppBar>

      {/* Sidebar */}
      <StyledDrawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
         {/* Logo area in sidebar */}
         <Toolbar sx={{
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             backgroundColor: 'transparent',
             minHeight: '64px',
             borderBottom: '1px solid #003d33',
         }}>
             <img src="/path/to/your/sidebar-logo.png" alt="Freeshopps Logo" style={{ width: '100px' }} />
         </Toolbar>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              {item.subMenu ? (
                <StyledListItemButton onClick={() => handleMenuClick(item.text)} selected={isMenuItemActive(item.path)}>
                  <ListItemIcon>
                     {iconMap[item.icon]}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {openMenus[item.text] ? <ExpandLess /> : <ExpandMore />}
                </StyledListItemButton>
              ) : (
                <ListItem disablePadding component={Link} to={item.path}>
                   <StyledListItemButton selected={isMenuItemActive(item.path)}>
                      <ListItemIcon>
                        {iconMap[item.icon]}
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                   </StyledListItemButton>
                </ListItem>
              )}
              {item.subMenu && (
                <Collapse in={openMenus[item.text] || item.subMenu.some(subItem => isMenuItemActive(subItem.path))} timeout="auto" unmountOnExit> {/* Keep open if a sub-item is active */}
                  <List component="div" disablePadding sx={{ backgroundColor: '#transparent',color:"gray",textAlign:'center' }}>
                    {item.subMenu.map((subItem) => (
                       <ListItem disablePadding key={subItem.text} component={Link} to={subItem.path}>
                         <StyledSubListItemButton selected={isMenuItemActive(subItem.path)}>
                            <ListItemText primary={subItem.text} />
                         </StyledSubListItemButton>
                       </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </StyledDrawer>

      {/* Main Content Area */}
      <MainContent component="main" sx={{ flexGrow: 1,  mt: 2, }}>
         <Outlet />
      </MainContent>
    </Box>
  );
}

export default DashboardLayout;