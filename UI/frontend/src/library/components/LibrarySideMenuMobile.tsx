import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { LibraryLogo } from "./LibraryAppNavbar";

const mainListItems = [
  { text: "Dashboard", icon: <DashboardRoundedIcon />, path: "/library" },
  { text: "Users", icon: <PeopleRoundedIcon />, path: "/library/users" },
  { text: "Books", icon: <BookRoundedIcon />, path: "/library/books" },
  {
    text: "Categories",
    icon: <CategoryRoundedIcon />,
    path: "/library/categories",
  },
  {
    text: "Authors",
    icon: <AutoStoriesRoundedIcon />,
    path: "/library/authors",
  },
  {
    text: "Publishers",
    icon: <BusinessRoundedIcon />,
    path: "/library/publishers",
  },
  {
    text: "Borrow/Return",
    icon: <SwapHorizRoundedIcon />,
    path: "/library/borrow-return",
  },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/library/settings" },
  {
    text: "Help & Support",
    icon: <HelpOutlineRoundedIcon />,
    path: "/library/help",
  },
];

interface LibrarySideMenuMobileProps {
  open: boolean;
  toggleDrawer: (open: boolean) => () => void;
}

export default function LibrarySideMenuMobile({
  open,
  toggleDrawer,
}: LibrarySideMenuMobileProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    toggleDrawer(false)();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      slotProps={{
        backdrop: { invisible: false },
      }}
      sx={{
        zIndex: 1300,
        "& .MuiDrawer-paper": {
          width: "280px",
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mx: 2,
          my: 2,
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <LibraryLogo />
          <Typography variant="h6" component="div">
            Library System
          </Typography>
        </Box>

        <List dense>
          {mainListItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <List dense>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
