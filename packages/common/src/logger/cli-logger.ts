import chalk from "chalk"

import { Spinner } from "./spinner"
import { Logger, LoggerParams } from "./types"

type LogGroupState = {
  spinner: Spinner
  childStates: string[]
  steps: Record<string, Spinner>
}

export class CliLogger implements Logger {
  private logGroups: Record<string, LogGroupState> = {}

  log(params: LoggerParams): void {
    const { log, type, group, stream, step } = params
    if (!group) {
      console.log(`[${type}]: ${log}`)
      return
    }

    if (!this.logGroups[group]) {
      this.logGroups[group] = {
        spinner: new Spinner({ name: "dots" }).start("", {
          withPrefix: `[${group}]`
        }),
        childStates: [],
        steps: {}
      }
    }

    const logGroup = this.logGroups[group]

    if (stream) {
      logGroup.spinner.setText(`${log}`)
    } else {
      if (type === "start") {
        logGroup.spinner.setText(`${log}`)
        logGroup.childStates.push(log)
      } else {
        if (step) {
          if (!logGroup.steps[step]) {
            logGroup.steps[step] = new Spinner({ name: "dots" }).start(
              `${chalk.greenBright("  ➜ ")} ${step}`
            )
            logGroup.steps[step].complete(`${chalk.greenBright("  ➜ ")} ${step}`)
            delete logGroup.steps[step]
          }
        } else {
          logGroup.spinner.setText(`${log}`)
        }

        if (type === "success") {
          logGroup.spinner.succeed()
          logGroup.childStates.pop()

          if (logGroup.childStates.length === 0) {
            logGroup.spinner.succeed(`Completed`)
            delete this.logGroups[group]
          }
        } else if (type === "error") {
          logGroup.spinner.failed()
          logGroup.childStates.pop()

          if (logGroup.childStates.length === 0) {
            logGroup.spinner.failed(`Failed`)
            delete this.logGroups[group]
          }
        }
      }
    }
  }

  end(): void {
    Object.keys(this.logGroups).forEach(group => {
      this.logGroups[group].spinner.succeed(`[${group}] Completed`)
      Object.values(this.logGroups[group].steps).forEach(stepSpinner => {
        stepSpinner.succeed()
      })
      delete this.logGroups[group]
    })
  }
}
