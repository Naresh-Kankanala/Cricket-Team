const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error : ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1

app.get("/players/", async (request, response) => {
  const getQuery = `
        SELECT player_id AS playerId,
                player_name AS playerName,
                jersey_number AS jerseyNumber,
                role AS role
        FROM cricket_team;`;
  const playersList = await db.all(getQuery);
  response.send(playersList);
});

//API 2

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const addPlayerQuery = `
                INSERT INTO 
                    cricket_team(player_name, jersey_number, role)
                VALUES 
                    ('${playerName}', '${jerseyNumber}', '${role}');`;
  const responseDB = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//API 3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getQuery = `
        SELECT player_id AS playerId,
                player_name AS playerName,
                jersey_number AS jerseyNumber,
                role AS role
        FROM cricket_team
        WHERE player_id = ${playerId};`;
  const player = await db.get(getQuery);
  response.send(player);
});

//API 4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const updateQuery = `
            UPDATE cricket_team
            SET 
                player_name = '${playerName}',
                jersey_number = '${jerseyNumber}',
                role = '${role}'
            WHERE player_id = ${playerId};`;
  const responseDB = await db.run(updateQuery);
  response.send("Player Details Updated");
});

// API 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
            DELETE FROM cricket_team
            WHERE player_id = ${playerId};`;
  const responseDB = await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
