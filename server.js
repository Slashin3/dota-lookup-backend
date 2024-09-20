import express from "express";
import axios from 'axios';
import cors from 'cors';

const PORT = 5000;
const app = express();

app.use(cors());

app.get('/players/:account_id', async (req, res) => {
  const { account_id } = req.params;
  const url = `https://api.opendota.com/api/players/${account_id}`;

  try {
    const response = await axios.get(url);

    // Check if response data is empty or player doesn't exist
    if (!response.data.profile) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);

    // Handling OpenDota specific error responses
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: 'Player not found' });
    } else {
      res.status(500).json({ message: 'Error fetching player data' });
    }
  }
});

// Route to get recent matches
app.get("/api/recent-matches/:accountId", async (req, res) => {
    const { accountId } = req.params;
  
    try {
      const response = await axios.get(`https://api.opendota.com/api/players/${accountId}/recentMatches`);
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching recent matches" });
    }
  });

// // Endpoint to get pro players data
// app.get('/players/proPlayers', async (req, res) => {
//   const url = "https://api.opendota.com/api/proPlayers";

//   try {
//     const response = await axios.get(url);

//     // Check if response contains a non-empty array
//     if (!response.data || response.data.length === 0) {
//       return res.status(404).json({ message: 'No pro players found' });
//     }

//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Error fetching data:', error);

//     // General error handling for the request
//     res.status(500).json({ message: 'Error fetching pro players data' });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
