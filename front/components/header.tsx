"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { User, Settings, LogOut } from "lucide-react";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [admin, setAdmin] = useState<any>(null);
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // hides text on md and smaller

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const adminData = localStorage.getItem("admin");

    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    setUser(null);
    setAdmin(null);
    router.push("/");
  };

  return (
    <AppBar
      position="static"
      color="default"
      sx={{ borderBottom: 2, borderColor: "primary.main" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
            <Typography
              variant="caption"
              color="primary.contrastText"
              fontWeight="bold"
            >
              PS
            </Typography>
          </Avatar>
          <Typography
            variant="h6"
            color="primary"
            fontWeight="bold"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            PrintSerbia
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={isMobile ? 0 : 2}>
          <Button
            variant="text"
            size="small"
            onClick={() => router.push("/login")}
            startIcon={<User size={16} />}
          >
            {!isMobile && "Za kopirnice"}
          </Button>
          {/* {user ? (
            <>
              <Button
                variant="text"
                size="small"
                onClick={() => router.push("/profile")}
                startIcon={<User size={16} />}
              >
                {!isMobile && user.name}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={handleLogout}
                startIcon={<LogOut size={16} />}
              >
                {!isMobile && "Odjavi se"}
              </Button>
            </>
          ) : admin ? (
            <>
              <Button
                variant="text"
                size="small"
                onClick={() => router.push("/admin")}
                startIcon={<Settings size={16} />}
              >
                {!isMobile && admin.shopName}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={handleLogout}
                startIcon={<LogOut size={16} />}
              >
                {!isMobile && "Odjavi se"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="text"
                size="small"
                onClick={() => router.push("/login")}
                startIcon={<User size={16} />}
              >
                {!isMobile && "Prijavi se"}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => router.push("/login")}
                startIcon={<Settings size={16} />}
              >
                {!isMobile && "Admin"}
              </Button>
            </>
          )} */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}