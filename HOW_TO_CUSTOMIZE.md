# How to Customize the Birthday Card 🎨

All your customizations for images and music are in **one file**: `index.html`.
You can open `index.html` in any text editor to make these changes.

---

### 🖼️ 1. How to Change the Profile Image

Search for the profile image around **Line 92** in `index.html`.
It looks like this:
```html
<img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=85" alt="Leyla" class="prof-card__img" ... />
```
**Change it:** Replace the `https://...` link with your own image URL. If you have an image file (e.g., `leyla.jpg`) saved in the same folder, change it to:
```html
<img src="leyla.jpg" alt="Leyla" class="prof-card__img" ... />
```

---

### 🎬 2. How to Change the Movie Card Image

Search for the movie image around **Line 193** in `index.html`.
It looks like this:
```html
<img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=700&q=80" class="movie-img" alt="With Love 2026" />
```
**Change it:** Replace the `https://...` link with your own movie poster URL or a local file (e.g., `movie.jpg`):
```html
<img src="movie.jpg" class="movie-img" alt="With Love 2026" />
```

---

### 🎶 3. How to Change the Music/Vibe YouTube Links

The music videos are in the "Pick Your Vibe" section, starting around **Line 153**.
Each vibe card has an `onclick="playVibe(this, 'YOUTUBE_ID')"` attribute.

For example, the first one looks like this:
```html
<div class="vrow" ... onclick="playVibe(this,'jfKfPfyJRdk')">
```

**How to find a YouTube ID:**
If a standard YouTube link is `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
The ID is the part right after `v=`. So here, it is `dQw4w9WgXcQ`.

**Change it:** Find the card you want, and replace the ID inside the quotes.
```html
<!-- Example: Changing it to a new ID -->
<div class="vrow" ... onclick="playVibe(this,'YOUR_NEW_ID_HERE')">
```
*Note: Make sure to keep the single quotes around the ID!*
