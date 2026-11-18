# Alzikrayat - Project 3

Ahmad Awad

A website for sharing photos, made with React, Express, Node.js and MongoDB.
Users can register, log in, upload photos, add comments and delete their own photos.
The People page lists members. Each member has a profile with their details and photos.

- `client`: website pages.
- `server`: API and database code.

## Run the project

You need Node.js 22 and MongoDB. Start MongoDB first.
Open a terminal in this folder. For the first setup, run:

```powershell
npm install
```

Copy `server/.env.example` to `server/.env` if you do not have an `.env` file.
In that file, set `MONGODB_URI` to your MongoDB address and `SESSION_SECRET` to a long random value.
The local database address is `mongodb://127.0.0.1:27017/alzikrayat`.

Start the server:

```powershell
npm run server
```

In another terminal, in the same folder, start the client:

```powershell
npm run client
```

Open http://localhost:5173. The server runs on port 5000.
