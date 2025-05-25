module.exports = {
  appId: 'com.fibble.llmidi',
  productName: 'llmidi',
  directories: {
    output: 'release/${version}'
  },
  files: [
    'dist-electron',
    'dist'
  ],
  mac: {
    artifactName: '${productName}-${version}-${arch}.${ext}',
    category: 'public.app-category.music',
    icon: 'build/icon.icns'
  },
  win: {
    artifactName: '${productName}-${version}-${arch}.${ext}',
    target: [
      {
        target: 'nsis',
        arch: ['x64', 'ia32']
      }
    ],
    icon: 'build/icon.ico'
  },
  linux: {
    artifactName: '${productName}-${version}-${arch}.${ext}',
    target: [
      {
        target: 'AppImage',
        arch: ['x64']
      },
      {
        target: 'deb',
        arch: ['x64']
      }
    ],
    category: 'Audio',
    icon: 'build/icon.png'
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false
  }
}
