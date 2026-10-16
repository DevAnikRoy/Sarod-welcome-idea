# শরতের চিঠি — personalized Durga Puja invitations

Next.js / TypeScript / GSAP. Real licensed kash, Durga-idol, and clay-lamp photographs; a layered 3D envelope; responsive Bengali invitation cards.

## Run locally

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Use `/create` to create an invitation, `/manage` to manage cards, and `/credits` for photo attribution and privacy information.

## Test with several people on the same Wi-Fi

```powershell
npm run build
npm run start:lan
```

Open `http://YOUR_COMPUTER_WIFI_IP:3001` on each device. The machine must stay on, and the network must allow that connection. Use the Wi-Fi address on the creator's device too, so copied links have a reachable host. Do not share `127.0.0.1` or `localhost` links to another phone. No firewall configuration is changed by this project.

## What works

- Each visitor can enter their own name, optional portrait, recipient, message, event name, venue, date, and time.
- Square portrait cropping with zoom and horizontal/vertical positioning; no portrait placeholder when omitted.
- Live preview, explicit public-link consent, then server-side card creation.
- Independent random public invitation links, copy/native-share with manual-copy fallback on HTTP devices.
- Separate secret management links, browser-local card list, deletion with a confirmation step.
- Server-side upload size/type/decode limits, JPEG re-encoding and metadata removal; no uploaded SVG/HTML execution.
- Five simultaneous independent creations verified by `scripts/verify-api.mjs`. The test removes only its own generated cards.
- Locally hosted optimized WebP festival photos, real sources credited on `/credits` and in `design/asset-sources.md`.
- Scroll-controlled envelope on desktop; unpinned scrolling on mobile; direct open button and reduced-motion fallback.

## Storage and hosting

Cards and re-encoded portraits are stored together in individual files in `data/cards/` (gitignored). Random IDs avoid concurrent writes to a shared JSON file. Only a SHA-256 hash of the owner token is stored server-side. The raw secret is returned once and stored in the owner's browser. There is no public card index.

`CARD_DATA_DIR` can point to a persistent writable directory. Back up that directory privately; never serve it as public assets. Deleting a card deletes its file and portrait. A server-wide 30-attempt/hour creation limit is intended for this small-group installation, not an anonymous high-traffic service.

For internet-wide sharing, deploy this Node app with HTTPS and persistent disk (a VPS or persistent-volume host). An ephemeral/serverless filesystem will lose cards; migrate `lib/store.ts` to a hosted database/object store before using that deployment model. This work does not create a public deployment or require cloud credentials. Google Fonts are external; all festival photos are local. The site does not claim that localhost links work over the internet.

## Validation

```powershell
npm run build
# With a production server running on 3002:
$env:TEST_BASE='http://127.0.0.1:3002'
node scripts/verify-api.mjs
```

Test coverage: five simultaneous cards, independent text, public page loading, portrait resizing, no private fields in public JSON, malformed-image rejection, missing-field rejection, cross-origin POST rejection, owner-token validation, deleted-page/photo 404s. Browser checks cover desktop, tablet and mobile widths, loaded photos, the direct-open action, form preview and creation.
