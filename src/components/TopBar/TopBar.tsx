import {
  AppBar,
  Avatar,
  Box,
  Container,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bar, Logo, Navigation, NavigationItem } from "./TopBar.style";

export const TopBar: FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { logOut, user, isInGroup } = useAuth();

  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const closeUserMenu = () => {
    setAnchorElUser(null);
  };

  const toUsers = () => navigate("/users");
  const toCustomers = () => navigate("/customers");
  const toJobs = () => navigate("/jobs");

  const toProfile = () => {
    closeUserMenu();
    navigate("/users/me");
  };

  const logOutHandler = async () => {
    if (logOut) {
      await logOut();
    }
    closeUserMenu();
    navigate("/");
  };

  const getInitials = () => {
    if (!user?.attributes) {
      return "";
    }
    if (!user?.attributes?.name) {
      return user?.attributes.email[0].toUpperCase();
    }
    return user?.attributes.name[0].toUpperCase();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Bar disableGutters>
          <Logo variant="h6" noWrap onClick={toUsers}>
            AUTH
          </Logo>
          <Navigation>
            {isInGroup("Admin") && (
              <NavigationItem onClick={toUsers}>Users</NavigationItem>
            )}
            <NavigationItem onClick={toCustomers}>Customers</NavigationItem>
            <NavigationItem onClick={toJobs}>Jobs</NavigationItem>
          </Navigation>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={openUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Fake User">{getInitials()}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={closeUserMenu}
            >
              <MenuItem onClick={toProfile}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>

              <MenuItem onClick={logOutHandler}>
                <Typography textAlign="center">Log out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Bar>
      </Container>
    </AppBar>
  );
};
