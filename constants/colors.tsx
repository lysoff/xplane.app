import * as tailwindConfig from "@/tailwind.config";

type ColorShade = "DEFAULT" | "100" | "200";

interface TailwindExtension {
  black: Record<ColorShade, string>;
  gray: Record<"100", string>;
  primary: string;
  secondary: Record<ColorShade, string>;
}

export const colors = tailwindConfig.theme?.extend
  ?.colors as unknown as TailwindExtension;
