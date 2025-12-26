"use client"

import type React from "react"
import { useState } from "react"
import { Container, Box, Tabs, Tab, Paper } from "@mui/material"
import OrderManagement from "../components/admin/OrderManagement"
import ShopSettings from "../components/admin/ShopSettings"
import Analytics from "../components/admin/Analytics"
import PricingSettings from "../components/admin/PricingSettings"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`admin-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const AdminPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            border: "3px solid",
            borderColor: "primary.main",
            borderRadius: 2,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: "2px solid",
              borderColor: "primary.main",
              "& .MuiTab-root": {
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "uppercase",
                color: "primary.main",
              },
              "& .Mui-selected": {
                color: "secondary.main",
              },
            }}
          >
            <Tab label="Narudžbe" />
            <Tab label="Podešavanja štamparije" />
            <Tab label="Cene" />
            <Tab label="Analitika" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <OrderManagement />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ShopSettings />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <PricingSettings />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Analytics />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  )
}

export default AdminPage
