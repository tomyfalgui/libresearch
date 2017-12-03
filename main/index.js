// Native
const { format } = require('url')

// Packages
const { BrowserWindow, app, ipcMain, Menu } = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const { resolve } = require('app-root-path')
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const { v4: uuid } = require('uuid')
const path = require('path')

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  const devPath = 'http://localhost:8000/start'

  const prodPath = format({
    pathname: resolve('renderer/out/start/index.html'),
    protocol: 'file:',
    slashes: true
  })

  const url = isDev ? devPath : prodPath
  mainWindow.loadURL(url)
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

const template = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() {
          require('electron').shell.openExternal('https://electron.atom.io')
        }
      }
    ]
  }
]
if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })

  // Edit menu
  template[1].submenu.push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
    }
  )

  // Window menu
  template[3].submenu = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  ]
}

const menu = Menu.buildFromTemplate(template)
!isDev && Menu.setApplicationMenu(menu)

const pathh = isDev
  ? path.join(app.getAppPath(), 'db')
  : path.join(app.getPath('appData'), 'db')
const db = new PouchDB(pathh)
var url = 'http://localhost:5984/mydb'
var opts = { live: true, retry: true }

db.replicate.from(url).on('complete', function(info) {
  db
    .sync(url, opts)
    .on('change', info => {
      console.log('change:' + info)
    })
    .on('paused', paused => {
      console.log('paused' + paused)
    })
    .on('error', err => {
      console.log('error:' + err)
    })
    .on('complete', _ => {
      console.log('completed:')
    })
    .on('active', _ => {
      console.log('Active:')
    })
    .on('denied', err => {
      console.log('Denied:' + err)
    })
})

ipcMain.on('updateorsave:data', async (e, arg1) => {
  const result = (await db.find({
    selector: { LRN: arg1, exited: null, updated: false, total_time: null }
  })).docs
  if (result.length) {
    const [first] = result
    const onlyOne = (await db.find({
      selector: {
        _id: first._id,
        exited: null,
        updated: false,
        total_time: null
      }
    })).docs
    const { LRN } = onlyOne[0]
    const exited = Date.now()

    await db.put({
      _id: onlyOne[0]._id,
      _rev: onlyOne[0]._rev,
      entered: onlyOne[0].entered,
      LRN: onlyOne[0].LRN,
      exited,
      updated: true,
      total_time: exited - onlyOne[0].entered,
      date: onlyOne[0].date
    })
  } else {
    await db.put({
      _id: uuid(),
      LRN: arg1,
      entered: Date.now(),
      exited: null,
      updated: false,
      total_time: null,
      date: new Date().toDateString()
    })
  }

  /* ENTERED CODE */

  db
    .sync(url, opts)
    .on('change', info => {
      console.log('change:' + info)
    })
    .on('paused', paused => {
      console.log('paused' + paused)
    })
    .on('error', err => {
      console.log('error:' + err)
    })
    .on('complete', _ => {
      console.log('completed:')
    })
    .on('active', _ => {
      console.log('Active:')
    })
    .on('denied', err => {
      console.log('Denied:' + err)
    })
})

ipcMain.on('delete:data', async (e, arg1) => {
  db.destroy()
  //db.sync('db', 'http://localhost:5984/mydb')
})

global.getData = async function() {
  var result = await db.allDocs({
    include_docs: true,
    attachments: true
  })
  return result
}
