import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "./CustomTabPanel";
import Leaderboard from "./Leaderboard";
import PostYourPicks from "./PostYourPicks";
// import PicksDetails from "./PicksDetails";
import "../css/Contest.css";

const Contest = () => {
  const { contestName } = useParams();
  const [contestDetails, setContestDetails] = useState(null);

  const contest = useMemo(
    () => [
      {
        contestName: "Doink Sports",
        primaryImageUrl: "https://i.ibb.co/xzk85XK/0k0-A7-Ib3-400x400.jpg",
        price: "Win a free 2 months subscription to Doink Sports",
        spreadsheetUrl:
          "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8",
        sponsored: false,
        affiliateUrl: "https://doinksports.com/?via=Sure-Odds",
        affiliateCopy: "Try Doink Sports Research Platform For Free",
        contestEndDate: "2/2/2025",
        contestStartDate: "11/15/2024",
        contestLeague: ["americanfootball_nfl", "basketball_nba", "soccer_epl"],
      },
      {
        contestName: "DG Fantasy",
        primaryImageUrl: "https://i.ibb.co/p4w0j39/o-GXbjunp-400x400.png",
        price: "Win a free 2 months subscription to DG Fantasy",
        spreadsheetUrl:
          "https://api.sheetbest.com/sheets/8dc7d109-648f-4403-8d28-37303439a580",
        sponsored: false,
        affiliateUrl: "https://dgfantasy.com/membership-signup?ref=mjkwmti",
        affiliateCopy: "Try DG Fantasy Research Platform For Free",
        contestEndDate: "2/9/2025",
        contestStartDate: "12/9/2024",
        contestLeague: ["americanfootball_nfl", "soccer_germany_bundesliga"],
      },
    ],
    []
  );

  useEffect(() => {
    const contestDetail = contest.find(
      (item) => item.contestName === contestName
    );
    if (contestDetail) {
      setContestDetails(contestDetail);
    }
    console.log("contestName", contestName);
  }, [contestName, contest]);

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [value, setValue] = React.useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!contestDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box sx={{ width: "auto", textAlign: "center", p: 3 }}>
        <div className="contest-header">
          <div className="contest-header-left">
            <h1>Welcome To The {contestDetails.contestName} Contest</h1>
            {!isMobile && <p>Participate and {contestDetails.price}</p>}
            <button
              onClick={() => window.open(contestDetails.affiliateUrl, "_blank")}
              className="button-link"
            >
              {contestDetails.affiliateCopy}
            </button>
          </div>
          <div className="contest-header-right">
            <img
              src={contestDetails.primaryImageUrl}
              alt={contestDetails.contestName}
            />
          </div>
        </div>
        <Box
          sx={{
            zIndex: 1100,
            position: "sticky",
            top: 0,
            backgroundColor: "#161616",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#4F46E5",
              },
            }}
          >
            <Tab
              label="Leaderboard 🏆"
              {...a11yProps(0)}
              sx={{
                color: "#4F46E5",
                fontSize: isMobile ? "8px" : "10px",
              }}
            />
            <Tab
              label="Post Your Picks🥇"
              {...a11yProps(1)}
              sx={{
                color: "#4F46E5",
                fontSize: isMobile ? "8px" : "10px",
              }}
            />
            {/* <Tab
              label="Live Picks Preview 📊"
              {...a11yProps(2)}
              sx={{
                color: "#4F46E5",
                fontSize: isMobile ? "8px" : "10px",
              }}
            /> */}
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Leaderboard
            contestName={contestDetails.contestName}
            primaryImageUrl={contestDetails.primaryImageUrl}
            price={contestDetails.price}
            spreadsheetUrl={contestDetails.spreadsheetUrl}
            sponsored={contestDetails.sponsored}
            contestEndDate={contestDetails.contestEndDate}
            contestStartDate={contestDetails.contestStartDate}
            affiliateUrl={contestDetails.affiliateUrl}
            affiliateCopy={contestDetails.affiliateCopy}
            contestLeague={contestDetails.contestLeague}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <PostYourPicks
            contestName={contestDetails.contestName}
            primaryImageUrl={contestDetails.primaryImageUrl}
            price={contestDetails.price}
            spreadsheetUrl={contestDetails.spreadsheetUrl}
            sponsored={contestDetails.sponsored}
            contestEndDate={contestDetails.contestEndDate}
            contestStartDate={contestDetails.contestStartDate}
            affiliateUrl={contestDetails.affiliateUrl}
            affiliateCopy={contestDetails.affiliateCopy}
            contestLeague={contestDetails.contestLeague}
          />
        </CustomTabPanel>
        {/* <CustomTabPanel value={value} index={2}>
          <PicksDetails
            contestName={contestDetails.contestName}
            primaryImageUrl={contestDetails.primaryImageUrl}
            price={contestDetails.price}
            spreadsheetUrl={contestDetails.spreadsheetUrl}
            secondaryImageUrl={contestDetails.secondaryImageUrl}
            sponsored={contestDetails.sponsored}
            contestFormat={contestDetails.contestFormat}
            affiliateUrl={contestDetails.affiliateUrl}
          />
        </CustomTabPanel> */}
      </Box>
    </>
  );
};

export default Contest;
