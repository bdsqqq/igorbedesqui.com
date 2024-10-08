# Major updates

- [x] Migrate Stitches -> tailwind
- [x] Ditch i18n in favor of english-only. Too much effort for a small demographic and I already do everything english-first anyways.
- [x] Use MDX as the basis for content. ~~Need to experiment with how it integrates with i18n before committing.~~
  - [x] Got MDX working with my components and i18n, see #26
  - [x] Instead of MD owning metadata, what if metadata owned MD? this way I can have typesafety without defining a module in a .d.ts
    - [x] By using [mdx remote](https://github.com/hashicorp/next-mdx-remote), I can have md content as strings instead of files, meaning that in a TS file, I could define metadata + multiple md pieces of content and consume those anywhere. This can allow me to define <Band /> in a ts file and pass the markdown content as a child instead of having it in the .md file itself. This will also solve the problem where the markdown content of a popover needed to be in a separate file to be parsed and used in a .MDX.
- [x] Redesign landing page
  - [x] hero section, there's too little information above the fold. Something like what [patrick](https://www.patrickaltair.com/) does could work.
  - [x] With the content direction I'm thinking on taking (more misc writting eg: redstone engineering, failure in interviews, component implementations) the landing page—maybe the whole site actually—will need restructuring. I like what [paco](https://paco.me/)'s "writting" session combined with the featured projects in the landing page. What [James](https://jm.sv/) does with his "work" and "~~work~~" is also interesting. Also, the way [Manuel](https://manuelmoreale.com/) puts navigation links in the copy itself is very interesting (and way more achievable if I actually move to MDX).
- [ ] Project page "about this project" section as an accordion. I like having it fixed so it's accessible at any poing but with the tools there it feels a bit too much.
- [ ] Redesign site "Container", see what [James](https://jm.sv/) does, I like the layered feeling his site has, especially the smol borders horizontally and how it integrates well with a progress bar at the top.
- [ ] resume as .md (Basically free if I actually move to MDX lol)
  - [ ] option to download it as pdf generated by the .md (I mean, the browser print API can go a long way)

# might be cool

- [ ] Implement an input for "how did you end up here?" in 404 page, list previous answers there.

# Minor fixes

- [x] Footer doesn't align with the content in project pages, fix the padding of one of them.
- [ ] StyledLink should be able to break words if they're too long, links tend to have bigass hashes with no spaces or dashes
- [ ] Update favicon
- [x] Hero section overlay is bein applied to the entire div instead of just over the image
- [x] [Pedro Duarte](https://ped.ro) has a grainy overlay like mine but his is made with an SVG instead of a repeating image, meaning it's easier to customize and scales infinitely by default. Should probably yoink it
