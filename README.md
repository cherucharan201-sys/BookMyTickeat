# BookMyTickets

BookMyTickets is a responsive movie-ticket booking demo built with React and Vite. Browse Indian cinema releases from 2026 across several language industries, choose a cinema and showtime, select seats, and view saved tickets.

## Features

- Search movies by title, genre, language, or film industry and filter by language
- View movie details and choose a date, cinema, and showtime
- Find nearby theaters using device location (with permission) or a city/area search
- Browse listed cinemas near Tirupati by default or search another location
- Open PVR INOX to check live showtimes, seats, and complete real bookings there
- Select seats from a visual seating chart with tiered prices
- Save demo tickets to MongoDB and review them under **My tickets**
- Create an account with email, phone number, and password, then log in with either email or phone
- Send an email alert to the registered email address after a successful login (requires SMTP configuration for real delivery)
- Responsive layouts for desktop and mobile

> **Booking:** The PVR INOX link opens its official booking site where users can check current availability and complete bookings. This app does not connect to PVR's booking API or confirm tickets itself. Its 2026 movie catalog and OpenStreetMap venue list are samples/map data; saved demo tickets are stored in MongoDB but do not reserve cinema seats or collect payment.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

The login and registration API also needs MongoDB and the backend running:

```bash
npm run dev:server
```

The server connects to `mongodb://127.0.0.1:27017/darshan` by default; set `MONGO_URI` to use another MongoDB connection. Passwords for new registrations are stored as scrypt hashes. Existing accounts with plain-text passwords are upgraded to hashes after a successful login.

Users must be logged in to save and view tickets. The API stores demo tickets and revocable seven-day sessions in MongoDB. Existing tickets saved in browser storage before this update are not migrated automatically.

Login email alerts use the configured email transport (`EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS`, or `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`). Without SMTP settings, development uses an Ethereal preview and does not deliver email to the account. SMS login alerts are not configured; they require an SMS provider account and credentials.

## Validation

```bash
npm run build
npm run lint
```

## Project structure

```text
src/
  components/   Shared navigation, footer, and movie cards
  data/         Sample movie catalog and date helpers
  services/     Theater lookup and authenticated movie-ticket API
  pages/        Home, movie catalog, details, seat booking, and saved tickets
  routes/       Application routes
```
