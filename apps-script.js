// ============================================================
// STRIKE Workout Logger — Google Apps Script
// Deploy as Web App: Execute as "Me", Access "Anyone"
// ============================================================

const SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // ← Replace with your Sheet ID
const LOG_SHEET_NAME = 'Log';

// Column headers for the Log sheet
const HEADERS = [
  'Date', 'Timestamp',
  'Mobility_1', 'Mobility_2', 'Mobility_3',
  'Plyo_1', 'Plyo_2',
  'Shadow_1', 'Shadow_2', 'Shadow_3',
  'Completed', 'Notes'
];

function doGet(e) {
  const action = e.parameter.action || 'getLogs';

  if (action === 'getLogs') {
    return getLogs();
  } else if (action === 'ping') {
    return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
  }

  return jsonResponse({ error: 'Unknown action' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action || 'logSession';

    if (action === 'logSession') {
      return logSession(body);
    }

    return jsonResponse({ error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// ── GET all log rows from last 90 days ──────────────────────
function getLogs() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(LOG_SHEET_NAME);

  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(LOG_SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return jsonResponse({ logs: [], headers: HEADERS });
  }

  const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);

  const logs = data
    .filter(row => row[0] && new Date(row[0]) >= cutoff)
    .map(row => ({
      date: formatDate(row[0]),
      timestamp: row[1],
      mobility: [row[2], row[3], row[4]].filter(Boolean),
      plyo: [row[5], row[6]].filter(Boolean),
      shadow: [row[7], row[8], row[9]].filter(Boolean),
      completed: row[10],
      notes: row[11]
    }));

  return jsonResponse({ logs });
}

// ── POST log a new session ───────────────────────────────────
function logSession(body) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(LOG_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(LOG_SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  const now = new Date();
  const row = [
    formatDate(now),                    // Date
    now.toISOString(),                  // Timestamp
    body.mobility?.[0] || '',           // Mobility_1
    body.mobility?.[1] || '',           // Mobility_2
    body.mobility?.[2] || '',           // Mobility_3
    body.plyo?.[0] || '',               // Plyo_1
    body.plyo?.[1] || '',               // Plyo_2
    body.shadow?.[0] || '',             // Shadow_1
    body.shadow?.[1] || '',             // Shadow_2
    body.shadow?.[2] || '',             // Shadow_3
    body.completed ? 'YES' : 'NO',      // Completed
    body.notes || ''                    // Notes
  ];

  sheet.appendRow(row);

  // Auto-format date column
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1).setNumberFormat('yyyy-mm-dd');

  return jsonResponse({ status: 'logged', date: formatDate(now) });
}

// ── Helpers ──────────────────────────────────────────────────
function formatDate(d) {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
