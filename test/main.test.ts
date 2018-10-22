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

import { expect } from "chai"
import main from "../src/main"
import { TestScheduler } from "funfix-exec"
import { IO } from "funfix-effect"

describe("main", () => {
  it("stops on task cancellation", () => {
    const s = new TestScheduler()
    let eff = 0

    const app = IO
      .of(() => {
        eff = 1
      })
      .delayExecution(100)
      .flatMap(() =>
        IO
          .of(() => {
            eff = 2
          })
          .delayExecution(100)
      )

    // Start the app
    const task = main()(app).run(s)
    // fforward 100ms, execute task1
    s.tick(100)
    // Expect first task executed
    expect(eff).equals(1, "first IO should be executed")
    // Cancel app task
    task.cancel()
    // fforward some more
    s.tick(100)
    // expect second effect not executed
    expect(eff).equals(1, "second IO must be cancelled")
  })

  it("stops on process signal", (done) => {
    const s = new TestScheduler()
    let eff = 0

    const app = IO
      .shift(s)
      .map(() => {
        eff = 1
      })
      .delayExecution(100)

    // Start the app
    main(["SIGUSR1"])(app).run(s)
    // fforward 50ms
    s.tick(50)
    // Expect task not executed yet
    expect(eff).equals(0, "task not executed yet")
    // Cancel app task
    process.kill(process.pid, "SIGUSR1")

    // break async boundary to make sure process signal gets handled before time moves forward for our task
    setTimeout(() => {
      s.tick(500)
      // expect second effect not executed
      expect(eff).equals(0, "task not executed because cancelled")
      done()
    }, 10)
  })
})
