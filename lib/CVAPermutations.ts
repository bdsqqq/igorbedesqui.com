import { cva, type VariantProps } from "class-variance-authority";
import { variantOutsideCva as config } from "@/ui/Button"

export const mockVariants2 = cva("", {
  variants: {
    border: {
      true: "border",
    },
    rounded: {
      true: "rounded-md",
    },
  },
  defaultVariants: {
    border: true,
    rounded: true,
  },
});

// use this to expose permutations without much change to the API surface of CVA.
// Does this compute too much eagerly? Should I compute permutations on usage instead of on creation?
// Config isn't exported by CVA but julius was a saint and helped me with getting the types working.


export const mockVariants = { 
    variants: {
      size: {
        sm: "...",
        md: "...",
        lg: "...",
      },
      intent: {
        primary: "...",
        secondary: "...",
        danger: "...",
      },
      outlined: {
        yea: "...",
        nope: "...",
      }
    },
  
  defaultVariants: {
    size: "md",
    intent: "primary",
    outlined: "yea",
  },

  compoundVariants: [
    { outlined: "yea", intent: "primary", css: "..." },
    { outlined: "yea", intent: "secondary", css: "..." },
    { outlined: "yea", intent: "danger", css: "..." },
  ],
};

type ClassValue = Parameters<typeof cva>[0];
type Config<T> = NonNullable<Parameters<typeof cva<T>>[1]>;
type CVAReturn<T> = ReturnType<typeof cva<T>>;

export const makePermutations = <T>(config: Config<T>) => {
const { variants, defaultVariants, compoundVariants } = config;

  if (!variants) {
    console.warn("Can't make permutations without variants", config);
    return [];
  }

  const variantKeys = Object.keys(variants);
  const options = variantKeys.map(key => Object.keys(variants[key]));

  const keyOptions = variantKeys.map((key, index) =>
  options[index].map(option => ({ [key]: option }))
  );
  
  return keyOptions.reduce(
    (acc, keyOption) =>
      acc.flatMap(accOption =>
        keyOption.map(option => ({ ...accOption, ...option }))
      ),
    [{}]
  );
};

// export const CVAWithPerms = <T extends Config<any>>(base: ClassValue, config: T) => {

//   return [cva(base, config) as CVAReturn<T>, config ? makePermutations(config) : null];
// };








export const CVAWithPerms = <T>(base: Parameters<typeof cva<T>>[0], config: Parameters<typeof cva<T>>[1]) => {
  return [cva(base, config), config ? makePermutations(config): null] as const ;
}

const [mockCVA, mockPerm] = CVAWithPerms("", config);
const actualCVA = cva("", config);

mockCVA && mockCVA({
  
});

actualCVA();
// ^?