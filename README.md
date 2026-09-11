# Math for Kids

Hebrew math activities built with React, TypeScript and Vite, packaged for iOS with Capacitor.

## Website

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

`npm run build` checks TypeScript and produces the website in `dist/`.

## Separate interfaces

- `src/App.tsx`, `src/components/`, `src/index.css` and the root `index.html`:
  original website interface, restored from commit `a8252e4`.
- `src/ios/`: independent iOS interface, including its entry point, HTML, CSS,
  components, safe-area layout and number pad.
- `src/store/`, `src/domain/` and `src/data/`: shared game logic and persistence.
- `ios/`: generated native Xcode project, separate from the iOS React interface.

Change iOS presentation only in `src/ios/`. The iOS interface imports shared
game logic but does not import web components or web CSS. Changes to shared
logic intentionally affect both applications and should be checked in both.

Web and iOS have separate Vite entry points, TypeScript checks, Tailwind scans,
and output folders.
Deploy only `dist/` for the website. Capacitor copies only `dist-ios/` into the
native app. `npm run ios:dev` previews the iOS interface on port 5174; safe-area
behavior still needs a simulator or device check.

## iOS development

Install Xcode 26 or newer and an iOS simulator runtime. Open Xcode once to
finish setup. If `xcode-select -p` points to CommandLineTools, select Xcode for
the current terminal:

```sh
export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
```

Build the iOS interface, copy it into the native project, and open Xcode:

```sh
npm run ios:sync
npm run ios:open
```

In Xcode, select the App scheme, choose an iPhone or iPad simulator, and press
Run. Alternatively, `npm run ios:run` builds, syncs, and prompts for a device.
Run `npm run ios:sync` after iOS interface or shared logic changes before running
from Xcode again. `npm run ios:build` builds only the iOS interface, without sync.

The app bundles web assets locally; a running Vite server is not required.
Native dependencies use Swift Package Manager and are resolved by Xcode.
Commit the `ios/` project and `capacitor.config.ts`; generated web assets and
build products are ignored.

For a physical device, select your Apple development team under Signing &
Capabilities and connect the device. The bundle identifier
`com.example.mathforkids` is a development placeholder: choose a final unique
identifier in both `capacitor.config.ts` and the Xcode target before distribution.

## Next milestones

- Verify touch dragging, Hebrew layouts, keyboard behavior and safe areas on devices.
- Add native progress storage and test persistence across relaunches and updates.
- Replace template icons and launch artwork, and prepare privacy disclosures.
- Test with families through TestFlight before App Store submission.

This initial iOS scaffold still uses the website's localStorage persistence;
Safari progress does not automatically transfer into the installed app.
