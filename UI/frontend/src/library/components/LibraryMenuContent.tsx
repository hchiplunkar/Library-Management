import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import AuthorRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import PublisherRoundedIcon from "@mui/icons-material/BusinessRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

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
    icon: <AuthorRoundedIcon />,
    path: "/library/authors",
  },
  {
    text: "Publishers",
    icon: <PublisherRoundedIcon />,
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

export default function LibraryMenuContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
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
      <Box>
        <Divider sx={{ my: 1 }} />
        <List dense>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
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
    </Stack>
  );
}
