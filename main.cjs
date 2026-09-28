const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 800,
    useContentSize: true, // Let the content dictate exact sizing if possible
    resizable: false, // Tetris is best played with fixed bounds
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Hide the default menu bar
  mainWindow.setMenuBarVisibility(false);

  // In production, load the built static files.
  // In development, you would load http://localhost:5174 but we package the dist folder.
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
