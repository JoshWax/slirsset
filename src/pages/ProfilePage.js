import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import EqualizerIcon from "@material-ui/icons/Equalizer";

import ProfileName from "../components/ProfileName";
import UserStatistics from "../components/UserStatistics";
import ProfileGamesTable from "../components/ProfileGamesTable";
import useFirebaseRef from "../hooks/useFirebaseRef";
import firebase from "../firebase";
import { computeState } from "../util";
import LoadingPage from "./LoadingPage";

const useStyles = makeStyles((theme) => ({
  divider: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  mainGrid: {
    marginBottom: theme.spacing(1),
  },
}));

function mergeGameData(game, gameData) {
  const scores = computeState(gameData).scores;
  const winner = Object.keys(game.users).sort((u1, u2) => {
    const s1 = scores[u1] || 0;
    const s2 = scores[u2] || 0;
    if (s1 !== s2) return s2 - s1;
    return u1 < u2 ? -1 : 1;
  })[0];
  return {
    ...game,
    ...gameData,
    winner: winner,
    scores: scores,
  };
}

function ProfilePage({ match }) {
  const userId = match.params.id;

  const [games, loadingGames] = useFirebaseRef(`/userGames/${userId}`);
  const [gamesData, setGamesData] = useState(null);
  const [redirect, setRedirect] = useState(null);

  const classes = useStyles();

  const handleClickGame = (gameId) => {
    setRedirect(`/room/${gameId}`);
  };

  useEffect(() => {
    async function getGamesData() {
      const gameReads = [];
      const gameDataReads = [];
      for (const gameId of Object.keys(games || {})) {
        gameReads.push(
          firebase.database().ref(`games/${gameId}`).once("value")
        );
        gameDataReads.push(
          firebase.database().ref(`gameData/${gameId}`).once("value")
        );
      }
      const gameReadsValues = await Promise.all(gameReads);
      const gameDataReadsValues = await Promise.all(gameDataReads);
      if (!loadingGames) {
        const gamesDataCopy = {};
        Object.keys(games || {}).forEach((gameId, i) => {
          const game = gameReadsValues[i].val();
          const gameData = gameDataReadsValues[i].val();
          if (game.status === "done") {
            gamesDataCopy[gameId] = {
              ...mergeGameData(game, gameData),
              gameId: gameId,
            };
          }
        });
        setGamesData(gamesDataCopy);
      }
    }
    getGamesData();
  }, [games, userId, loadingGames]);

  if (loadingGames) {
    return <LoadingPage />;
  }
  if (redirect) return <Redirect push to={redirect} />;

  return (
    <Container>
      <Paper style={{ padding: 16 }}>
        <Grid container className={classes.mainGrid}>
          <Grid item xs={12} md={4}>
            <ProfileName userId={userId} />
          </Grid>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            className={classes.divider}
          />
          <Grid item xs={12} style={{ flex: 1 }} p={1}>
            <div style={{ display: "flex" }}>
              <Typography variant="overline">Statistics</Typography>
              <EqualizerIcon />
            </div>
            <UserStatistics userId={userId} gamesData={gamesData} />
          </Grid>
        </Grid>
        <Typography variant="overline" component="div">
          Finished Games
        </Typography>
        <ProfileGamesTable
          userId={userId}
          handleClickGame={handleClickGame}
          gamesData={gamesData}
        />
      </Paper>
    </Container>
  );
}

export default ProfilePage;
