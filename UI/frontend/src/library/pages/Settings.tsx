import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

export default function Settings() {
  const [settings, setSettings] = React.useState({
    notificationsEnabled: true,
    emailAlerts: true,
    overdueReminders: true,
    autoApproval: false,
    maxBorrowPeriodDays: 14,
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack spacing={2}>
        <Card>
          <CardHeader title="Library Settings" />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Notifications
                </Typography>
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notificationsEnabled}
                        onChange={() => handleSettingChange("notificationsEnabled")}
                      />
                    }
                    label="Enable Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailAlerts}
                        onChange={() => handleSettingChange("emailAlerts")}
                      />
                    }
                    label="Email Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.overdueReminders}
                        onChange={() => handleSettingChange("overdueReminders")}
                      />
                    }
                    label="Overdue Book Reminders"
                  />
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Borrowing Rules
                </Typography>
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoApproval}
                        onChange={() => handleSettingChange("autoApproval")}
                      />
                    }
                    label="Auto-Approve Borrow Requests"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Maximum Borrow Period: {settings.maxBorrowPeriodDays} days
                  </Typography>
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  System Information
                </Typography>
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <Typography variant="body2">
                    <strong>System Version:</strong> 1.0.0
                  </Typography>
                  <Typography variant="body2">
                    <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Database:</strong> Local Mock Data
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="About Library Management System" />
          <Divider />
          <CardContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              This is a comprehensive library management system designed to help manage
              books, users, borrowing records, and more. The system currently uses mock
              data for demonstration purposes and can be extended with a backend database.
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              <div>
                <strong>Features include:</strong>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  <li>User Management (Create, Read, Update, Delete)</li>
                  <li>Book Management with categories, authors, and publishers</li>
                  <li>Book borrowing and return tracking</li>
                  <li>Overdue book notifications</li>
                  <li>Responsive design for desktop and mobile devices</li>
                </ul>
              </div>
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
