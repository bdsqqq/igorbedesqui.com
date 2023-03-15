export type Meta = {
  shortName: string;
  name: string;
  description: string;
  roles: string[];
  type: string;
  tools: string[];
  date: string;
  urlSlug: string;
  backMessage?: string;
  draft: boolean;
};

export const bebopMeta: Meta = {
  shortName: "bebop",
  name: "Cowboy Bebop web poster",
  description:
    "My entry for, and winner of, the second installment of the WebJam.",
  roles: ["FrontEnd Developer", "UX/UI Designer"],
  type: "Personal",
  tools: [
    "Javascript",
    "TailwindCSS",
    "CSS",
    "Motion One",
    "Vite",
    "Rollup",
    "HTML",
    "Adobe Illustrator",
  ],
  date: "Oct 2021",
  urlSlug: "bebop",
  backMessage: "See you space cowboy...",
  draft: false,
};

export const issMeta: Meta = {
  shortName: "iss",
  name: "Where's the iss?",
  description: "Real time tracking of the International Space Station.",
  roles: ["FrontEnd Developer", "UX/UI Designer"],
  type: "Personal",
  tools: [
    "NextJS",
    "React",
    "Typescript",
    "TailwindCSS",
    "COBE",
    "Tanstack-query",
    "Jotai",
    "Vercel",
  ],
  date: "Feb 2021 ~ Sep 2022",
  urlSlug: "iss",
  backMessage: "Back into orbit",
  draft: false,
};

export const wasmGifMeta: Meta = {
  shortName: "wasmGif",
  name: "Wasm Gif Converter",
  description: "Video to gif conversion without sending any data anywhere.",
  roles: ["FrontEnd Developer", "UX/UI Designer"],
  type: "Personal",
  tools: [
    "NextJS",
    "React",
    "Typescript",
    "Framer Motion",
    "ffmpeg",
    "Web Assembly",
  ],
  date: "Mar 2021",
  urlSlug: "wasmgif",
  backMessage: "",
  draft: false,
};

export const ibmMeta: Meta = {
  shortName: "IBM",
  name: "IBM",
  description: "Creating web experiences for the enterprise of enterprises.",
  roles: ["FullStack Developer"],
  type: "Full time",
  tools: [""],
  date: "2020 ~ 2022",
  urlSlug: "ibm",
  draft: false,
};

export const psykipMeta: Meta = {
  shortName: "the-manual",
  name: "The manual",
  description: "The best way to read The Enchiridion from Epictetus",
  roles: ["FrontEnd Developer", "UX/UI Designer"],
  type: "Personal",
  tools: [
    "Typescript",
    "Astro",
    "SolidJS",
    "TailwindCSS",
    "Partytown",
    "Golang",
    "Vercel",
  ],
  date: "2022",
  urlSlug: "the-manual",
  backMessage: "Back",
  draft: false,
};
