/*!
 * Copyright (c) 2018 by The Main-TS Project Developers.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Cancelable } from "funfix-exec"
import { IO } from "funfix-effect"

/**
 * Default stop signals used by main function to cancel upstream task
 */
export const DEFAULT_STOP_SIGNALS: NodeJS.Signals[] = [
  "SIGINT",
  "SIGQUIT",
  "SIGTERM"
]

/**
 * Bind process signals handler to given cancelable
 * @param stopSignals NodeJS.Signals signals to cancel On
 */
export const cancelOn = (...stopSignals: NodeJS.Signals[]) =>
  <T extends Cancelable>(task: T): T => {
  stopSignals.forEach(signal => {
    process.on(signal, () => {
      task.cancel()
    })
  })

  return task
}

/**
 * Wrap given task with process signals handling
 * @param stopSignals
 */
export const main = (stopSignals: NodeJS.Signals[] = DEFAULT_STOP_SIGNALS) =>
                 <T>(task: IO<T>): IO<T> =>
  IO.deferFutureAction((s) => cancelOn(...stopSignals)(task.run(s)))

/**
 * Export main as default
 */
export default main
