# STRIKE Workout PWA — Complete Setup Guide

---

## Overview

The app has two parts:
1. **The PWA** — hosted on GitHub Pages (free, permanent HTTPS)
2. **Google Apps Script** — a tiny backend that reads/writes your Google Sheet

---

## STEP 1 — Set Up Your Google Sheet

1. Open your existing **Workouts** Google Sheet
2. Note the **Spreadsheet ID** from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/`**`1yFxK-56muOlLVlw1OV6h-5dHxTHOkvpK_iBIf-vxxRQ`**`/edit`
   - Your ID: `1yFxK-56muOlLVlw1OV6h-5dHxTHOkvpK_iBIf-vxxRQ`

The Apps Script will **automatically create a "Log" tab** in this sheet the first time you log a session. No manual setup needed.

---

## STEP 2 — Deploy the Google Apps Script

This is the backend that connects the app to your sheet.

### 2a. Open Apps Script
1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code in the editor

### 2b. Paste the code
1. Open the file `apps-script.js` from this package
2. Copy **all** of it
3. Paste it into the Apps Script editor

### 2c. Add your Sheet ID
Find this line at the top:
```javascript
const SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
```
Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Sheet ID:
```javascript
const SHEET_ID = '1yFxK-56muOlLVlw1OV6h-5dHxTHOkvpK_iBIf-vxxRQ';
```

### 2d. Deploy as Web App
1. Click **Deploy → New deployment**
2. Click the gear icon ⚙ next to "Type" → select **Web app**
3. Set:
   - **Description:** STRIKE Workout Logger
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Click **Authorize access** → choose your Google account → Allow
6. Copy the **Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfyc.../exec
   ```
   **Save this URL — you'll need it in Step 4.**

> ⚠️ Every time you edit the Apps Script, you must create a **New Deployment** (not update) for changes to take effect.

---

## STEP 3 — Host the PWA on GitHub Pages

### 3a. Create a GitHub repo
1. Go to [github.com](https://github.com) → **New repository**
2. Name it: `strike-workout` (or anything you like)
3. Set to **Public**
4. Click **Create repository**

### 3b. Upload the files
You need to upload these 5 files:
- `index.html`
- `sw.js`
- `manifest.json`
- `icon-192.png`
- `icon-512.png`

**Option A — Via GitHub website (easiest):**
1. On your new repo page, click **uploading an existing file**
2. Drag all 5 files into the upload area
3. Click **Commit changes**

**Option B — Via Git (if you have it installed):**
```bash
git clone https://github.com/YOUR_USERNAME/strike-workout.git
cd strike-workout
# Copy all 5 files into this folder
git add .
git commit -m "Initial deployment"
git push
```

### 3c. Enable GitHub Pages
1. In your repo, go to **Settings → Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)**
4. Click **Save**
5. Wait ~60 seconds, then your app is live at:
   ```
   https://YOUR_USERNAME.github.io/strike-workout/
   ```

---

## STEP 4 — Connect the App to Google Sheets

1. Open your app URL in **Safari (iOS)** or **Chrome (Android)**
2. Tap the **⚙️ Setup** tab
3. Paste your Apps Script Web App URL from Step 2d
4. Tap **Save & Connect**
5. Tap **Test Connection** — you should see "✓ Connected"

---

## STEP 5 — Install on Your Phone

### iPhone (Safari only):
1. Open the app URL in **Safari**
2. Tap the **Share** button (box with arrow)
3. Scroll down → **Add to Home Screen**
4. Tap **Add**

### Android (Chrome):
1. Open the app URL in **Chrome**
2. Tap **⋮ menu**
3. Tap **Add to Home Screen** or **Install app**

---

## How the App Works

### Workout Generation
- Tapping **⚡ Generate Today's Workout** picks:
  - **3 of 7** Mobility exercises
  - **2 of 12** Plyometrics exercises
  - **3 of 11** Shadow Boxing exercises
- **Priority logic:** Exercises done least frequently in the last 30 days are chosen first
- **Full coverage guarantee:** Exercises never done always get priority over ones already practiced

### Logging
- After your workout, tap **✓ Log This Session**
- This writes a row to the **Log** tab in your Google Sheet with the date and all exercises
- The app reads this log on every open to recalculate frequencies

### History
- The **📋 History** tab shows your last 30 sessions pulled live from Google Sheets

### Frequency Chart
- The **📊 Frequency** tab shows bar charts for all exercises in all 3 categories

---

## Updating the App

To push updates to the PWA:
1. Edit the files locally
2. Upload the changed files to GitHub (replace existing)
3. GitHub Pages auto-deploys within ~60 seconds

To update the Apps Script:
1. Edit in the Apps Script editor
2. Click **Deploy → New deployment** (always new, not update)
3. Replace the URL in the app's Setup tab with the new URL

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Connection failed" | Check Apps Script URL in Setup tab; redeploy script |
| App not updating | Hard refresh: hold Shift + reload, or clear site data |
| Can't install on iPhone | Must use Safari (not Chrome) on iOS |
| Logs not appearing | Make sure "Execute as: Me" and "Access: Anyone" in deployment |
| CORS error | Redeploy the Apps Script as a new deployment |
