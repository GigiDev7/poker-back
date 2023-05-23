import server from "./app.js";
import "./socket.js";

const PORT = process.env.port || 8000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
