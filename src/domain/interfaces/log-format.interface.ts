export interface LogFormat {
  Source: 'controller' | 'service' | 'handler' | 'repository';
  SourceName: string;
  filter?: 'userInputs' | 'fetalError' | 'unknown' | 'infrastructure';
  exception?: object;
  developerComment?: string;
  shortMsg?: string;
}
