import * as core from '@actions/core'
import {getTool} from './installer'

async function run(): Promise<void> {
  try {
    const version = core.getInput('version', {required: true})
    await getTool(version)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
