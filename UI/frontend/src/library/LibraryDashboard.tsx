import * as React from "react";
import { Outlet, Routes, Route } from "react-router-dom";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import LibraryAppNavbar from "./components/LibraryAppNavbar";
import LibraryHeader from "./components/LibraryHeader";
import LibrarySideMenu from "./components/LibrarySideMenu";
import LibraryMainDashboard from "./components/LibraryMainDashboard";
import Users from "./pages/Users";
import Books from "./pages/Books";
import Categories from "./pages/Categories";
import Authors from "./pages/Authors";
import Publishers from "./pages/Publishers";
import BorrowReturn from "./pages/BorrowReturn";
import Settings from "./pages/Settings";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../dashboard/theme/customizations/index";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function LibraryDashboard() {
  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <LibrarySideMenu />
        <LibraryAppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <LibraryHeader />
            <Routes>
              <Route index element={<LibraryMainDashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="books" element={<Books />} />
              <Route path="categories" element={<Categories />} />
              <Route path="authors" element={<Authors />} />
              <Route path="publishers" element={<Publishers />} />
              <Route path="borrow-return" element={<BorrowReturn />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
            <Outlet />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
