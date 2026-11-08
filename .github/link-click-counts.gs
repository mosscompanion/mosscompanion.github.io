/** @OnlyCurrentDoc */

const LINKS = new Map([
  ['home', 'Made by MOSS homepage'],
  ['essa-play', 'MOSS ESSA on Google Play'],
  ['essa-web', 'MOSS ESSA web app'],
  ['companion-play', 'MOSS Companion on Google Play'],
  ['countdown-play', 'MOSS Countdown on Google Play'],
  ['lists-play', 'MOSS Lists on Google Play'],
]);

function doPost(event) {
  const id = event?.postData?.contents;
  if (!LINKS.has(id)) return ContentService.createTextOutput('Unknown link');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const properties = PropertiesService.getScriptProperties();
    const count = Number(properties.getProperty(id) || 0);
    properties.setProperty(id, String(count + 1));
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('OK');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('MOSS links')
    .addItem('Refresh click totals', 'refreshClickTotals')
    .addToUi();
}

function refreshClickTotals() {
  const workbook = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = workbook.getSheetByName('Click totals') || workbook.insertSheet('Click totals');
  const counts = PropertiesService.getScriptProperties().getProperties();
  const rows = [['Link', 'Clicks']];
  for (const [id, name] of LINKS) rows.push([name, Number(counts[id] || 0)]);
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
}
