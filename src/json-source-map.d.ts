declare module "json-source-map" {
  export type JsonLocation = {
    line: number;
    column: number;
    pos: number;
  };

  export type JsonPointerLocation = {
    key?: JsonLocation;
    value?: JsonLocation;
  };

  export function parse(source: string): {
    data: unknown;
    pointers: Record<string, JsonPointerLocation>;
  };
}
