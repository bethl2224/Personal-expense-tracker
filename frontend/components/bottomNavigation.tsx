import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Home } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router";
const BottomNav = () => {
  // staore the state value
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Navigate to the selected page
    if (newValue === 0) navigate("/");
    if (newValue === 1) navigate("/stats");
  };
  return (
    <BottomNavigation
      onChange={handleChange}
      className="fixed bottom-0 left-0 w-full z-50 border-t border-gray-200 bg-white py-3"
      showLabels
      value={value}
    >
      <BottomNavigationAction
        className="size-2xl"
        label="Home"
        icon={<Home />}
      />

      <BottomNavigationAction
        className="size-2xl"
        label="Stats"
        icon={<BarChartIcon />}
      />
    </BottomNavigation>
  );
};

export default BottomNav;
