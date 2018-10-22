Main-TS
=======

[![Travis](https://img.shields.io/travis/lostintime/main-ts.svg)](https://travis-ci.org/lostintime/main-ts)
[![Coverage Status](https://codecov.io/gh/lostintime/main-ts/coverage.svg?branch=master)](https://codecov.io/gh/lostintime/main-ts?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/lostintime/main-ts.svg)](https://greenkeeper.io/)

A function which cancels given task on specified node [process](https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_signal_events) signals.

```typescript
import main from "@lostintime/main-ts"
import { IO } from "funfix-effect"

main(["SIGUSR1"])(IO.unit().delayResult(50000)).run()
```

## Contribute

> Perfection is Achieved Not When There Is Nothing More to Add, 
> But When There Is Nothing Left to Take Away

Fork, Contribute, Push, Create pull request, Thanks. 
