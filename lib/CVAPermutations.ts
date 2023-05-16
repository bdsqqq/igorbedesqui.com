import { cva, type VariantProps } from "class-variance-authority";

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
        true: "...",
        false: "...",
      }

    },
  
  defaultVariants: {
    size: "md",
    intent: "gray",
    outlined: "false",
  },

  compoundVariants: [
    {
      outlined: "true",
      intent: "primary",
      class: "...",
    },
  ]
};

type Options<T> = NonNullable<Parameters<typeof cva<T>>[1]>;

export const makePermuations = <T>(input: Options<T>) => {
  const {variants, defaultVariants, compoundVariants} = input;

  if (!variants) {
    // throw new Error("No variants found");
    console.warn("Can't make permutations without variants", input);
    return [];
  }
  
  const variantKeys = Object.keys(variants);
  const options = variantKeys.map((key) => {
    return Object.keys(variants[key])
  })

  const optionTuplesWithKeys = variantKeys.map((key, index) => {
    return options[index].map((option) => {
      return [key, option]
    })
  })

  const keyOptions = optionTuplesWithKeys.map((keyOptions) => {
    return keyOptions.map(([key, option]) => {
      return Object.fromEntries([[key, option]])
    })
  })

  const permutations = keyOptions.reduce((acc, keyOption) => {
    return acc.flatMap((accOption) => {
      return keyOption.map((keyOption) => {
        return {...accOption, ...keyOption}
      })
    })
  }, [{}])

  return permutations
};

// use this to expose permutations without much change to the API surface of CVA.
// Does this compute too much eagerly? Should I compute permutations on usage instead of on creation?
// Config isn't exported by CVA but julius was a saint and helped me with getting the types working.
export const CVAWithPermutations = <T extends Options<any>>(input: T) => {
  return [cva("", input), input ? makePermuations(input) : null];
};