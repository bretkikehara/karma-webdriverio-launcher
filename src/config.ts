export type RemoteConfig = { [key: string]: any };
export type ReporterConfig = { [key: string]: any };

export function parseRemoteConfig(args: any): RemoteConfig {
  return {
    hostname: 'localhost',
    port: 4444,
    path: '/wd/hub',
    ...args,
  };
}

export function parseReporterConfig(args: any): ReporterConfig {
  const o: RemoteConfig = {};
  if (args && typeof args === "object" && !Array.isArray(args)) {
    Object.keys(args).forEach((key: string) => {
      if (typeof args[key] === 'function') {
        o[key] = args[key];
      }
    });
  }
  return o;
}
