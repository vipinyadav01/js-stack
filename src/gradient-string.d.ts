declare module "gradient-string" {
  interface Gradient {
    (colors: string[] | string): Gradient;
    multiline(str: string): string;
  }
  const gradient: Gradient & {
    [key: string]: any;
  };
  export default gradient;
}
