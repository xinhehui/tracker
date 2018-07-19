export default interface config {
  url: String,
  name: String,
  concat: Boolean,
  delay: Number,
  maxError: Number,
  sampling: Number
}

export interface ErrorTracker <T>{
  config (config: config): Function,
  use(plugin: Function, arc: T):
}

