export enum PlatformType {
  PC = 'PC',
  OfficeOnline = 'OfficeOnline',
  Mac = 'Mac',
  iOS = 'iOS',
  Android = 'Android',
  Universal = 'Universal',
}

export function getPlatform(): PlatformType {
  return (((window as any).Office &&
    (window as any).Office.context &&
    (window as any).Office.context.platform) ||
    PlatformType.OfficeOnline) as PlatformType;
}
