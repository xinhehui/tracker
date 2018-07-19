type platforms = 'ios' | 'android' | 'web'

export default interface config {
  url: String,
  site: String,
  platform: [k in keyof platforms],    //平台名称
  brand: String,
  deviceId: String,
  app_version: String,
}

export interface ErrorTracker {
  config: config
}

