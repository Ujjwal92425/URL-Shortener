import { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleShorten = async () => {
    const res = await axios.post("http://localhost:5000/shorten", { originalUrl });
    setShortUrl(`http://localhost:5000/${res.data.shortUrl}`);
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4">URL Shortener</Typography>
      <TextField
        fullWidth
        label="Enter URL"
        variant="outlined"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        style={{ marginTop: "20px" }}
      />
      <Button variant="contained" color="primary" onClick={handleShorten} style={{ marginTop: "20px" }}>
        Shorten URL
      </Button>
      {shortUrl && (
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Shortened URL: <a href={shortUrl}>{shortUrl}</a>
        </Typography>
      )}
    </Container>
  );
}

export default App;
