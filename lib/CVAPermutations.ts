import { cva } from "class-variance-authority";

const mockConfig = {
  variants: {
    size: {
      sm: "sm",
      md: "md",
      lg: "lg",
    },
    intent: {
      primary: ["primary"],
      danger: ["danger"],
    },
    outlined: {
      true: "outlined",
      false: "not-outlined",
    },
  },
};

type ClassValue = Parameters<typeof cva>[0];
type Config<T> = NonNullable<Parameters<typeof cva<T>>[1]>;

// Does this compute too much eagerly? Should I compute permutations on usage instead of on creation?
// Config isn't exported by CVA but julius was a saint and helped me with getting the types working.
export const makePermutations = <T>(config: Config<T>) => {
  const { variants, defaultVariants, compoundVariants } = config;

  if (!variants) {
    console.warn("Can't make permutations without variants", config);
    return [];
  }

  const variantKeys = Object.keys(variants);
  const options = variantKeys.map((key) => Object.keys(variants[key]));

  const keyOptions = variantKeys.map((key, index) =>
    options[index].map((option) => ({ [key]: option }))
  );

  return keyOptions.reduce(
    (acc, keyOption) =>
      acc.flatMap((accOption) =>
        keyOption.map((option) => ({ ...accOption, ...option }))
      ),
    [{}]
  );
};

/*
  Wrapper around CVA that exposes all possible variant permutations
  
  @param base Base classes added to all variants
  @param config Config object from CVA
  @returns [return from CVA, Permutations]
  
  @example
  const [variants, permutations] = CVAWithPerms("...", {
  variants: {
   size: {
     sm: "...",
     md: "...",
   },
  }});
 */
export const CVAWithPerms = <T>(base: ClassValue, config: Config<T>) => {
  if (!config) {
    console.warn(
      "Can't make permutations without config, be sure to pass the second argument"
    );
    return [cva(base, config), null] as const;
  }

  return [cva(base, config), config ? makePermutations(config) : null] as const;
};

// This is here to test the types, don't worry about it.
const [Button, ButtonPerms] = CVAWithPerms("button", mockConfig);
//       ^?
const Button2 = cva("button", mockConfig);
//        ^?
