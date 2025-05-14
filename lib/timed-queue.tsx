interface TimedJob {
  callback: Function
  time: number
}

export class TimedQueue {
  private queue: Array<TimedJob> = []
  private tHandle: any = null
  private done: boolean = true

  constructor() {}

  addTask(job: TimedJob): number {
    if (!this.done) throw new Error("Job is under process")
    return this.queue.push(job)
  }

  removeTask(job: TimedJob) {
    if (!this.done) throw new Error("Job is under process")
    let index = this.queue.indexOf(job)
    if (index == -1) throw new Error("Job not found")
    this.queue.splice(index, 1)
  }

  getQueueLength(): number {
    return this.queue.length
  }

  start() {
    if (!this.done) throw new Error("Job already started")
    if (this.queue.length == 0) throw new Error("Job Queue is empty")
    this.done = false
    this.next()
  }

  private next() {
    if (this.queue.length == 0) {
      this.done = true
      return
    }
    let job: TimedJob = this.queue.shift() as TimedJob
    this.tHandle = setTimeout(() => {
      job.callback.call(null)
      this.next()
    }, job.time)
  }

  stop() {
    if (this.done) throw new Error("Queue is not started")
    clearTimeout(this.tHandle)
    this.done = true
  }

  reset() {
    clearTimeout(this.tHandle)
    this.tHandle = null
    this.done = true
    if (this.queue.length > 0) this.queue.splice(0, this.queue.length)
  }
}
