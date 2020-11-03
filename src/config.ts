import fs from 'fs'

interface DriveConfig {
  baseUrl: string;
  basePath: string;
}

export interface Config {
  drive: DriveConfig;
}

export function loadConfig(): Promise<Config> {
  const p = fs.promises.readFile('config/system.json', 'utf8').then((data) => JSON.parse(data) as Config)
  p.catch((error) => { console.log("Error parsing system"); console.log(error) })
  return p
}