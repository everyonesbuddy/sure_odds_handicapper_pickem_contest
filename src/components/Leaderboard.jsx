import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import axios from "axios";
import moment from "moment";

const Leaderboard = () => {
  const [betsData, setBetsData] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8"
      );
      setBetsData(response.data);
      setFilteredBets(response.data); // Initial filter setup
    };
    fetchData();
  }, []);

  useEffect(() => {
    const now = moment();
    const filtered = betsData.filter((bet) => {
      const postedTime = moment(bet?.postedTime);
      switch (filter) {
        case "day":
          return now.diff(postedTime, "days") < 3;
        case "week":
          return now.diff(postedTime, "weeks") < 1;
        case "month":
          return now.diff(postedTime, "months") < 1;
        case "all":
        default:
          return true;
      }
    });
    setFilteredBets(filtered);
  }, [filter, betsData]);

  const aggregateBets = (bets) => {
    const handicappers = {};

    bets.forEach((bet) => {
      if (bet.betResult === null) return;

      const odds = parseInt(bet.odds, 10);
      const username = bet.twitterUsername || "Anonymous";
      if (!handicappers[username]) {
        handicappers[username] = {
          totalOdds: 0,
          totalWonOdds: 0,
          numberOfBets: 0,
          numberOfBetsWon: 0,
          potentialWins: 0,
        };
      }
      handicappers[username].totalOdds += odds;
      handicappers[username].numberOfBets += 1;
      if (bet.betResult === "won") {
        handicappers[username].totalWonOdds += odds;
        handicappers[username].numberOfBetsWon += 1;
        // Adjust calculation based on the sign of the odds
        if (odds > 0) {
          handicappers[username].potentialWins += 100 * (odds / 100); // For positive odds
        } else {
          handicappers[username].potentialWins += 100 * (100 / Math.abs(odds)); // For negative odds
        }
      }
    });

    return Object.entries(handicappers)
      .map(
        ([
          username,
          {
            totalOdds,
            totalWonOdds,
            numberOfBets,
            numberOfBetsWon,
            potentialWins,
          },
        ]) => ({
          username,
          totalOdds,
          totalWonOdds,
          numberOfBets,
          numberOfBetsWon,
          winRatio: (numberOfBetsWon / numberOfBets) * 100, // Calculate win ratio as a percentage
          potentialWins,
        })
      )
      .sort((a, b) => b.potentialWins - a.potentialWins); // Sort by potentialWins
  };

  return (
    <>
      <Typography align="center" gutterBottom>
        💵 Each Bet is Treated as a Single Bet with an Assumption of $100 per
        Bet. Top Handicappers Will Receive Weekly Payouts from Our Donation
        Pool! 🎉
      </Typography>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-around", p: 2 }}>
          {["all", "day", "week", "month"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "contained" : "outlined"}
              onClick={() => setFilter(f)}
              sx={{
                minWidth: "150px", // Make buttons longer
                fontWeight: "bold", // Make text bolder
                color: filter === f ? "#fff" : "#4F46E5", // Text color
                borderColor: "#4F46E5", // Border color
                backgroundColor: filter === f ? "#4F46E5" : "transparent", // Background color for selected button
                "&:hover": {
                  backgroundColor:
                    filter === f ? "#4F46E5" : "rgba(79, 70, 229, 0.1)", // Hover effect
                  borderColor: "#4F46E5",
                },
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Handicapper (X profile)</TableCell>
                <TableCell>Total Won Odds</TableCell>
                <TableCell>Total Won %</TableCell>
                <TableCell>Potential Wins</TableCell>
                <TableCell>Donate to Handicapper</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aggregateBets(filteredBets).map((handicapper, index) => (
                <TableRow key={handicapper.username}>
                  <TableCell>
                    {index + 1}.{" "}
                    <Avatar
                      src={`https://avatar.iran.liara.run/username?username=${handicapper.username}`}
                      alt={"Avatar"}
                      sx={{
                        width: 24,
                        height: 24,
                        display: "inline-flex",
                        verticalAlign: "middle",
                        marginRight: 1,
                      }}
                    />
                    <a
                      href={`https://x.com/${handicapper.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "20px" }}
                    >
                      {handicapper.username}
                    </a>
                  </TableCell>
                  <TableCell>
                    {handicapper.totalWonOdds}
                    <Tooltip title="Total amount of odds for bets that were won">
                      <IconButton size="small">
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    ({handicapper.numberOfBetsWon} / {handicapper.numberOfBets}){" "}
                    {handicapper.winRatio.toFixed(2)}%
                    <Tooltip title="Percentage of bets won out of total bets made">
                      <IconButton size="small">
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    ${handicapper.potentialWins.toFixed(2)}
                    <Tooltip title="Potential earnings based on a $100 bet for each winning bet, adjusted for the odds">
                      <IconButton size="small">
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <a
                      href="https://ko-fi.com/S6S710USRI"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        height="36"
                        style={{ border: "0px", height: "36px" }}
                        src="https://storage.ko-fi.com/cdn/kofi5.png?v=3"
                        border="0"
                        alt="Buy Me a Coffee at ko-fi.com"
                      />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Leaderboard;