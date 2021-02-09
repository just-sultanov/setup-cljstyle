import * as core from '@actions/core'
import * as io from '@actions/io'
import * as tc from '@actions/tool-cache'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

let tempDirectory = process.env['RUNNER_TEMP'] || ''
const IS_WINDOWS = process.platform === 'win32'

if (!tempDirectory) {
  let baseLocation: string
  if (IS_WINDOWS) {
    baseLocation = process.env['USERPROFILE'] || 'C:\\'
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users'
    } else {
      baseLocation = '/home'
    }
  }
  tempDirectory = path.join(baseLocation, 'actions', 'temp')
}

let platform = ''

if (IS_WINDOWS) {
  // platform = 'windows'
  throw new Error(
    'Unfortunately, the Windows platform is not currently supported'
  )
} else {
  if (process.platform === 'darwin') {
    platform = 'macos'
  } else {
    platform = 'linux'
  }
}

export async function getTool(version: string): Promise<void> {
  const toolVersion = getVersion(version)
  let toolPath = tc.find('cljstyle', toolVersion, os.arch())

  if (toolPath) {
    core.debug(`cljstyle found in cache ${toolPath}`)
  } else {
    const url = `https://github.com/greglook/cljstyle/releases/download/${version}/cljstyle_${version}_${platform}.tar.gz`

    core.info(`Downloading cljstyle from ${url}`)

    const archive = await tc.downloadTool(url)
    const tempDir: string = path.join(
      tempDirectory,
      `temp_${Math.floor(Math.random() * 2000000000)}`
    )
    const bin = await unzip(archive, tempDir)

    core.info(`cljstyle extracted to ${tempDir}/${bin}`)

    toolPath = await tc.cacheDir(tempDir, 'cljstyle', toolVersion)
  }

  core.addPath(toolPath)
}

export function getVersion(version: string): string {
  const versionArray = version.split('.')
  const major = versionArray[0]
  const minor = versionArray.length > 1 ? versionArray[1] : '0'
  const patch = versionArray.length > 2 ? versionArray.slice(2).join('-') : '0'
  return `${major}.${minor}.${patch}`
}

async function extract(file: string, destinationFolder: string): Promise<void> {
  const stats = fs.statSync(file)
  if (!stats) {
    throw new Error(`Failed to extract ${file} - it doesn't exist`)
  } else if (stats.isDirectory()) {
    throw new Error(`Failed to extract ${file} - it is a directory`)
  }

  await tc.extractZip(file, destinationFolder)
}

async function unzip(
  repoRoot: string,
  destinationFolder: string
): Promise<string> {
  await io.mkdirP(destinationFolder)

  const toolPath = path.normalize(repoRoot)
  const stats = fs.statSync(toolPath)
  if (stats.isFile()) {
    await extract(toolPath, destinationFolder)
    return fs.readdirSync(destinationFolder)[0]
  } else {
    throw new Error(`${toolPath} is not a file`)
  }
}
