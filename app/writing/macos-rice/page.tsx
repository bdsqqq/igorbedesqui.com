import Container from "@/components/Container";
import Band from "@/components/Band";

import { macosRice } from "app/writing/metas";

import { MDX } from "@/components/MDX";
import { Blur } from "@/components/ui/Blur";
import type { Metadata } from "next";
import { grid } from "@/components/ui/Grid";

import { makeSeo } from "@/lib/makeSeo";
import { CopyButton } from "@/components/ui/CopyButton";
import { ComponentProps } from "react";
import { cn } from "@/lib/styling";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Border } from "@/components/ui/Border";

export const metadata: Metadata = makeSeo({
  title: `${macosRice.name} - Igor Bedesqui`,
  description: macosRice.description,
  slug: `/writing/${macosRice.urlSlug}`,
  ogText: `*${macosRice.name}*;/n ${macosRice.description}`,
});

// TODO: Turn this into the default CODE component for all MDX things.
// TODO: make this count the lines of it's children and set height accordingly; code will never wrap
const ScrollableCodeWithCopy = (
  props: ComponentProps<"code"> & { heightClassname: string }
) => {
  return (
    <Border>
      <pre className="relative my-2 -mx-4 rounded-sm bg-gray-2 text-sm">
        <ScrollArea className={cn("p-4", props.heightClassname)}>
          <code
            className={cn("rounded bg-gray-2 font-mono", props.className)}
            {...props}
          />
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <CopyButton
          className="absolute top-0 right-0"
          contentToCopy={props.children?.toString() || ""}
        />
      </pre>
    </Border>
  );
};

export default async function Rice() {
  return (
    <Container
      key="rice"
      backable
      backMessage={macosRice.backMessage}
      backAnchor="/writing"
    >
      <Band id="01" gridless>
        <div className={grid()}>
          <div className="col-start-1 col-end-5 space-y-4 md:col-start-2 md:col-end-8 lg:col-start-5 lg:col-end-13">
            <MDX
              components={{
                Blur: (props) => <Blur {...props} />,
                blockquote: (props) => (
                  <blockquote
                    className="-indent-4 text-3xl text-gray-12 sm:-indent-6 sm:text-5xl"
                    {...props}
                  />
                ),
                strong: (props) => <span className="text-gray-12" {...props} />,
                em: (props) => (
                  <em className="italic text-gray-10" {...props} />
                ),
              }}
            >
              {`
# Why...?
About a year ago, youtube recommended me a video titled "[Improved AwesomeWM rice (With UI!)](https://www.youtube.com/watch?v=XyPs54eV99g&t=19s)", The minimal aesthetic and exageratted animations got me hooked, in a few hours I got way too deep into the Unix Ricing rabbithole, exploring window managers, aesthetic CLI tools, and color themes. 

Having witnessed the greatness of [r/unixporn](https://www.reddit.com/r/unixporn/) I felt empty, how could I experience the greatness of an OS tailor made by me, for me, if I'm trapped in MacOS land? ... The same way one would in any other environment: With google, and a tiny bit of obcession.

# Ok, but actually, why?

The goal with my setup is to have a digital space that reflects my philosophy on any workpace, physical or digital: Have simple tools, always at a hand's reach, but never in the way. And make it pretty enough that you're happy to come back to it every single day.

Aesthetics are cool and do play a role in driving my customizations, but the most impactful things in my setup are the ones that make using my tools better for me. Most of my favorite edits hide features away; Thanks to command palettes, either in the form of Raycast or one provided by the app itself, and keyboard shortcuts, I can always reach for what I need, when I need it.

# Show me the setup already!

Fine! First off, this is how my setup looks right now:
![Screenshot of customized MacOS Desktop. The colors in VSCode, Obsidian, and the btop system monitor running in a terminal match the Vesper color palette](/images/macos-rice/setup_1.jpg)

![Screenshot of customized MacOS Desktop. The colors in Linear, Spotify, Raycast, Discord, and VSCode match the Vesper color palette](/images/macos-rice/setup_2.jpg)

Most apps have the same custom color scheme, I tile windows through [Raycast's Window Management Extension](https://www.raycast.com/extensions/window-management), and have keybindings for about everything thanks to [Raycast's Hotkeys](https://manual.raycast.com/command-aliases-and-hotkeys).

I shared my progress on applying the custom theme to each app on [Twitter](https://twitter.com/search?q=from:@bedesqui%20vesper&src=typed_query) bit by bit, and this week, [2 posts about my setup](https://twitter.com/search?q=(fine%20%20OR%20twitter%20OR%20weekly%20OR%20reminder)%20(from:bedesqui)%20min_faves:500%20-filter:replies&src=typed_query&f=top) got over 360K impressions combined. With this many eyes on it, a few people asked for a guide on how to do it themselves, and it's surprisingly simpler than it seems.
# How can I replicate it?

## Window Management

The bulk of my setup consists of setting colors, but the most important part for my workflow is actually the window management aspect of it. Luckily it's simply leveraging Raycast's defaults with custom hotkeys for a few commands. If you don't have installed Raycast yet(Why?), you can get it by running \`brew install --cask raycast\`, or follow the instructions in [their site](https://www.raycast.com/).

and you're pretty much done, the Window Management Extension has everything I use, and if you want my exact keybindings (and the _aesthetic_ gap between windows), you can copy the following settings:

![Screenshot of Raycast settings for Window Manager extension. The hotkeys are as follows: Almost maximize = control + option + command + arrow up; Bottom Left Quarter = control + option + command + h; Bottom Left Sixth = control + option + Shift + command + h; Bottom Right Quarter = control + option + command + j; Bottom Right Sixth = control + option + Shift + command + j; Left Half = control + option + command + arrow left; Make Larger = control + option + Shift + command + arrow up; Make Smaller = control + option + Shift + command + arrow down; Reasonable Size = control + option + command + arrow down; Right Half = control + option + command + arrow right; Top Left Quarter = control + option + command + y; Top Left Sixth = control + option + Shift + command + Y; Top Right Quarter = control + option + command + u; Top Right Sixth = control + option + Shift + command + u. Window Management settings are: Gap = Tiny(8px); Cycling: Cycle ½, ⅔, ⅓; Advanced, Respect Stage Manager: off.](/images/macos-rice/raycast_wm.jpg)

If you fancy a tiling window manager closer to what you'd find on Linux land, give [yabai](https://github.com/koekeishiya/yabai/) a try. And if you like snapping apps to the corners of screens like on Windows try [Rectangle](https://rectangleapp.com/).
## Apps

Customizing apps is a mixed bag, some like VSCode, and most terminals allow extensive customization by default, others, like spotify or discord require use of third-party modifications, and others, like linear and raycast, allow for a bit of customization that often is just enough for me.

In no particular order, lets tackle how to customize each app:

### VSCode
VSCode enables you to go DEEP with customizations, and this is a common trait of Applications made with Electron as we'll see later.

On the surface, picking a theme, and icon pack will do a lot of heavy lifting; My prefered combination is [Vesper](https://marketplace.visualstudio.com/items?itemName=raunofreiberg.vesper) with [Chalice icons](https://marketplace.visualstudio.com/items?itemName=artlaman.chalice-icon-theme).
You can either install them from the VSCode Extension Marketplace or use the following commands:
`}
            </MDX>
            <ScrollableCodeWithCopy heightClassname="h-24">
              {`code --install-extension artlaman.chalice-icon-theme \n\ncode --install-extension raunofreiberg.vesper `}
            </ScrollableCodeWithCopy>
            <MDX>
              {`
Aditionally, the [Apc Customize UI++](https://marketplace.visualstudio.com/items?itemName=drcika.apc-extension) Extension enables you to apply styles to the app as with no limits, if it's something the VSCode devs could do, you can do. I use it to change the App font, making it the same as the editor, but seen others do way crazier things. You can install it from the marketplace or run the following command:
`}
            </MDX>
            <ScrollableCodeWithCopy heightClassname="h-13">
              {`sh code --install-extension drcika.apc-extension`}
            </ScrollableCodeWithCopy>
            <MDX>
              {`
going deeper, VSCode allows you to do extensive customizations through the \`settings.json\` file, to open it you can type "Open User Settings (JSON)" in your command palette. My current config is the following:
`}
            </MDX>
            <ScrollableCodeWithCopy heightClassname="h-96">
              {`{
    // vscode meta stuff
    "workbench.startupEditor": "none",
    "editor.accessibilitySupport": "off",
  
    // text editing stuff
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.linkedEditing": true,
    "editor.inlineSuggest.enabled": true,
    "editor.unicodeHighlight.nonBasicASCII": false,
  
    // ui stuff
    //    font
    "editor.fontFamily": "Geist Mono, Berkeley Mono, monospace",
    "editor.fontSize": 14,
    "editor.lineHeight": 1.42857, // makes font size 14 have line height of ~20px
    "apc.font.family": "Geist Mono", // apply font to ALL the UI, requires APC extension
  
    //   cursor
    "editor.cursorBlinking": "smooth", // smol cursor animation, looks nice
    "editor.cursorSmoothCaretAnimation": "on", // move cursor smoothly
  
    //    window
    //     title bar
    "window.title": "\${dirty}neovim\${separator}\${activeEditorShort}",
  
    //     top bar
    "workbench.editor.showTabs": "none", // hide tabs
    "breadcrumbs.enabled": false, // hides breadcrumb path at top of window
    "window.commandCenter": false, // hides command center at the top of the window. Use cmd+shift+p instead
    "workbench.layoutControl.enabled": false, // hides those little squares on the top right of the window
    "workbench.editor.editorActionsLocation": "hidden", // hides the "format" and ellipsis buttons on the top right of the window
  
    //     minimap
    "editor.minimap.renderCharacters": false, // make minimap blockish (low level of detail)
    "editor.hideCursorInOverviewRuler": true, // don't highlight current line in scrollbar
    "editor.minimap.autohide": true, // shows minimap only on hover
  
    //     sidebar
    "workbench.activityBar.location": "hidden", // hide sidebar icons, use cmd+b to toggle open
    "workbench.sideBar.location": "right", // puts sidebar on the right, less disruptive (doesn't shift code if text wrap is disabled) when opening with cmd+b
  
    //     bottom bar
    "workbench.statusBar.visible": false, // hide bottom bar
  
    //     editor
    "editor.stickyScroll.enabled": true, // keep block name fixed at top when scrolling
    "gitlens.mode.active": "zen", // toggle with command palette, zen mode hides gitlens stuff for when you don't need it
    "editor.wordWrap": "on", // wrap text instead of scrolling horizontally
  
    //   Theme
    "workbench.iconTheme": "chalice-icon-theme",
    "workbench.colorTheme": "Vesper",
    //     Overrides vesper theme start
    "workbench.colorCustomizations": {
      "editorGutter.addedBackground": "#A0A0A0",
      "editorGutter.deletedBackground": "#A0A0A0",
      "editorGutter.modifiedBackground": "#A0A0A0"
    },
    "editor.tokenColorCustomizations": {
      "textMateRules": [
        // remove peppermint flavor
        {
          "name": "String, Symbols, Inherited Class",
          "scope": [
            "string",
            "constant.other.symbol",
            "constant.other.key",
            "meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js"
          ],
          "settings": {
            "foreground": "#A0A0A0"
          }
        },
        {
          "name": "CSS ID's",
          "scope": [
            "source.sass keyword.control",
            "meta.attribute-selector.scss"
          ],
          "settings": {
            "foreground": "#ffffff"
          }
        },
        {
          "name": "Inserted",
          "scope": ["markup.inserted"],
          "settings": {
            "foreground": "#ffffff"
          }
        }
      ]
    },
    //     Overrides vesper theme end
  
    // git stuff
    "git.openRepositoryInParentFolders": "always",
    "git.autofetch": true,
    "git.confirmNoVerifyCommit": false,
    "git.confirmSync": false,
    "git.ignoreMissingGitWarning": true,
    "gitlens.gitCommands.skipConfirmations": [
      "fetch:command",
      "stash-push:command",
      "switch:command",
      "push:command"
    ],
    "gitlens.hovers.currentLine.over": "line",
  
    // js tooling stuff
    "typescript.preferences.importModuleSpecifier": "non-relative", // prefer aliases when importing
    "eslint.options": {
      "extensions": [".js", ".jsx", ".mdx", ".ts", ".tsx"]
    },
    "eslint.validate": [
      "mdx",
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact"
    ],
    "tailwindCSS.experimental.classRegex": [
      // enables tailwind autocomplete for specified functions
      ["cva\\\\(([^)]*)\\\\)", "[\\"'\`]([^\\"'\`]*).*?[\\"'\`]"],
      ["cn\\\\(([^)]*)\\\\)", "[\\"'\`]([^\\"'\`]*).*?[\\"'\`]"],
      ["cx\\\\(([^)]*)\\\\)", "[\\"'\`]([^\\"'\`]*).*?[\\"'\`]"]
    ],
  }`}
            </ScrollableCodeWithCopy>
            <MDX>
              {`

I commented each section and left notes on what every config does. Mostly, I'm removing stuff! With the command palette and keybindings I find the most value in the editor by coding with no clutter, then reaching for each tool as I need it.

### Raycast

Raycast Pro gives you themes! To match VSCode I made two versions of vesper for it, [Vesper dark](https://themes.ray.so?version=1&name=Vesper%20dark%20only%20orange&author=Igor%20Bedesqui&authorUsername=bdsqqq&colors=%23101010,%23101010,%23F2F2F2,%23FFFFFF,%23FFFFFF,%23FFC799,%23FFC799,%23FFC799,%23FFC799,%23FFC799,%23FFC799,%23FFC799&appearance=dark&addToRaycast) and [Vesper dark only orange](https://themes.ray.so?version=1&name=Vesper%20dark%20only%20orange&author=Igor%20Bedesqui&authorUsername=bdsqqq&colors=%23101010,%23101010,%23F2F2F2,%23FFFFFF,%23FFFFFF,%23FFC799,%23FFC799,%23FFC799,%23FFC799,%23FFC799,%23FFC799,%23FFC799&appearance=dark&addToRaycast). The only orange version overrides ALL support colors with the accent orange from Vesper, I've been using it with no issues for a while, but hope your favorite extension doesn't rely on color alone to signify things!

### Linear

Linear does such a delightful job at enabling color customization, in Settings, go to "Preferences", select the "Custom" Interface Theme option, and paste \`#101010,#FFFFFF,#101010,#A0A0A0,#FFC799,#000000\` in the "All colors" field. Other than that I do collapse most of the sidebars and rely mostly on the cmd+k menu, but that's not exportable through a file.

### Spotify

Spotify doesn't surface significant customization at all, but the Open Source does! Using [Spicetify](https://github.com/spicetify) you can change anything in the spotify UI. 
You can install it with the following commands:

`}
            </MDX>
            <ScrollableCodeWithCopy heightClassname="h-24">
              {`curl -fsSL https://raw.githubusercontent.com/spicetify/spicetify-marketplace/main/resources/install.sh | sh\n\ncurl -fsSL https://raw.githubusercontent.com/spicetify/spicetify-marketplace/main/resources/install.sh | sh`}
            </ScrollableCodeWithCopy>
            <MDX>
              {`
For guidance on installation and usage, see the [Spicetify Docs](https://spicetify.app/docs/getting-started)

Using the Spicetify CLI, you'll be able to apply a "Theme" to your spotify, You can find my theme in the [spicetify-vesper-theme](https://github.com/bdsqqq/spicetify-vesper-theme/tree/main) github repo. To use my theme, clone the repo into a folder in \`spicetify/Themes/\` (mine is in \`~/.config/spicetify/Themes/Vesper\`), and update the \`"current_theme"\` Setting in \`/spicetify/config-xpui.ini\`.

### Discord

Similar to Spotify, my Discord setup requires a third party application, [Better Discord](https://betterdiscord.app/) enables extensive customization through CSS, similar to the aforementioned APC extension for VSCode. For instalation guidance, see the [Better Discord documentation](https://docs.betterdiscord.app/users/getting-started/installation). 

You can find my theme in the [better-discord-vesper-theme](https://github.com/bdsqqq/better-discord-vesper-theme) github repo. To use my theme, copy the content of the repo into the \`BetterDiscord/themes\` folder, you can open it from the Discord UI in Settings > Better Discord > Themes > "Open Themes Folder" after setting up Better Discord.

### Terminal
The cool thing about terminals is that themes are often very portable, I daily drive [HyperTerm](hyper.is) because alacritty didn't let me use different padding from the top and bottom of the window. As you might've learned from previous items, electron based things are great for customization.

For my colors I use some Vesper colors on top of the [Mellow nvim theme](https://github.com/mellow-theme/mellow.nvim/tree/main) :`}
            </MDX>

            <ScrollableCodeWithCopy heightClassname="h-96">
              {`colors: {
      // Basic
      bg: "#101010",
      fg: "#ffffff",
      bg_dark: "#101010",
      // Normal
      black: "#101010",
      red: "#f5a191",
      green: "#90b99f",
      yellow: "#e6b99d",
      blue: "#aca1cf",
      magenta: "#e29eca",
      cyan: "#ea83a5",
      white: "#A0A0A0",
      // Bright
      lightBlack: "#282828",
      lightRed: "#ff8080",
      lightGreen: "#99FFE4",
      lightYellow: "#FFC799",
      lightBlue: "#b9aeda",
      lightMagenta: "#ecaad6",
      lightCyan: "#f591b2",
      lightWhite: "#ffffff",
      // Grays
      gray01: "#101010",
      gray02: "#1C1C1C",
      gray03: "#282828",
      gray04: "#57575f",
      gray05: "#7E7E7E",
      gray06: "#A0A0A0",
      gray07: "#ffffff",
      // Special
      none: "NONE",
    }`}
            </ScrollableCodeWithCopy>

            <MDX>
              {`
If you use the [Warp terminal](https://www.warp.dev/), you can get the theme straight from my [github repo](https://github.com/bdsqqq/warp-term-vesper-theme/tree/main). And if you use the default MacOS terminal the simple version that changes background, text color, and caret color in [this gist](https://gist.github.com/bdsqqq/73e4c30f920fbcfc4502751ff4bd2307) might be enough to the the right look.

I also use [fig](https://fig.io/) for autocomplete in the terminal, the theme for it is available in [my fork of the fig themes repo](https://github.com/bdsqqq/themes/blob/main/themes/vesper-dark.json) (and come on fig maintainers, it has been 5 months since I made the [PR to include vesper in the default themes](https://github.com/withfig/themes/pull/30)).

### Obsidian

In Obsidian, I use the [Simple Theme](https://github.com/kepano/obsidian-minimal) with a couple overrides using the [Style Settings](https://github.com/mgmeyers/obsidian-style-settings) plugin. 
You can get my overrides by copying the following JSON into the \`Settings > Community Plugins > Style Settings > "Import"\` field.`}
            </MDX>

            <ScrollableCodeWithCopy heightClassname="h-96">
              {`{
  "minimal-advanced@@styled-scrollbars": false,
  "minimal-style@@tag-radius": "4px",
  "minimal-style@@tag-border-width": "0",
  "minimal-style@@base@@dark": "#282828",
  "minimal-style@@bg1@@dark": "#101010",
  "minimal-style@@bg2@@dark": "#101010",
  "minimal-style@@ui1@@dark": "#282828",
  "minimal-style@@ax1@@dark": "#FFC799",
  "minimal-style@@sp1@@dark": "#000000",
  "minimal-style@@ax3@@dark": "#FFC799",
  "minimal-style@@tag-color@@dark": "#8B8B8B94",
  "minimal-style@@tx1@@dark": "#B4B4B4",
  "minimal-style@@tx2@@dark": "#7B7B7B",
  "minimal-style@@tx3@@dark": "#6E6E6E",
  "minimal-style@@hl1@@dark": "#FFFFFF25",
  "minimal-style@@window-title-off": false,
  "minimal-style@@frame-background@@dark": "#101010",
  "minimal-style@@frame-icon-color@@dark": "#101010",
  "minimal-style@@titlebar-text-color-focused@@dark": "#101010",
  "minimal-style@@titlebar-text-color@@dark": "#101010",
  "minimal-style@@tabs-style": "tabs-underline",
  "minimal-style@@workspace-background-translucent@@dark": "#101010"
}`}
            </ScrollableCodeWithCopy>

            <MDX>
              {`
### Physical setup??
Ah, and the Vesper mania wouldn't be complete if I didn't make the LEDs in my keyboard and mouse match the orange(or white sometimes; black and white is too nice to pass).

![Keyboard and mouse in the dark, both with LED lights shining in an orange color that matches the Vesper theme's orange](/images/macos-rice/keyboard.jpg)

# Afterword

Putting this all together makes me realise how much work this took, it was spread out through months so I didn't even realise it. I hope this inspires you to make your workspace your own, be it through silly colors or by relentlessly hiding clutter, the most important part is crafting something youself, for yourself.

            `}
            </MDX>
          </div>
        </div>
      </Band>
    </Container>
  );
}
