# Duo Admin — native Android app

The iPhoneDuoWallpaper.com admin panel as a native Android app: Kotlin + Jetpack
Compose (Material 3), talking to the site's own admin API over HTTPS.

Everything the web panel at `/admin` can do, this app can do — dashboard, bulk
upload straight from the phone's photo library, the wallpaper editor, categories,
collections, devices, the blog, the inbox, ads and site settings.

| | |
| --- | --- |
| Language | Kotlin 2.4 |
| UI | Jetpack Compose, Material 3 |
| Min / target | Android 9 (API 28) / Android 16 (API 36) |
| Networking | `HttpURLConnection` + kotlinx.serialization (no third-party HTTP client) |
| Auth | Supabase access token, refreshed automatically |

---

## Build and install

You need JDK 17 and the Android SDK (platform 36). Android Studio is optional —
the Gradle wrapper is checked in.

```bash
cd android && ./gradlew assembleDebug
```

The APK lands at `android/app/build/outputs/apk/debug/app-debug.apk`.

Install it on a phone plugged in over USB with debugging enabled:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Or copy the APK to the phone and open it — Android will ask once for permission to
install apps from this source.

`android/local.properties` points Gradle at your SDK and is not committed. If it is
missing, create it with `sdk.dir=C:/Users/<you>/AppData/Local/Android/Sdk` (forward
slashes on Windows).

## Signing in

The app ships pointing at `https://iphoneduowallpaper.com`. Use the same email and
password as the web panel — only accounts with an `admin_users` row can sign in.

**Change site address** on the sign-in screen points the app somewhere else, which is
how you test against a dev server: run `npm run dev` on your computer and enter
`http://10.0.2.2:3000` on an emulator, or `http://<your-computer-ip>:3000` on a phone
sharing the same Wi-Fi. Debug builds allow plain HTTP for exactly this; release builds
do not.

## How uploading works

Same shape as the web panel, done on the phone instead of in the browser:

1. Pick up to 30 images with the system photo picker (no storage permission needed).
2. Each one is measured straight away and the card says how it will land on the screens
   it is tagged for — "Soft on Duo Inner", "Crops on 18 Pro Max" — using the same
   `screenFit` rule the website shows visitors (`data/DeviceFit.kt`). An image that was
   never going to fit is caught here rather than after it is published.
3. Settings that apply to the whole batch (status, category, devices, collections,
   source, credit) sit above the images, because they are chosen once.
4. Each image is decoded, then a preview (fits 1080 × 2340) and a 9:16 thumbnail
   (540 × 960) are encoded as WebP, and the dominant colour is averaged from a 16 × 16
   sample — the same numbers `src/lib/admin/image-client.ts` uses.
5. The server issues presigned Cloudflare R2 URLs; the app PUTs the three objects
   directly to R2. The original file is streamed as picked and never re-encoded.
6. The wallpaper row is created through the API, which is what invalidates the site's
   caches.

The queue lives on `AdminViewModel` (`UploadQueue.kt`), not in the screen, so switching
tabs mid-batch no longer cancels the transfer or throws away typed titles. The Upload
tab carries a badge with what is left, and **Stop after this one** ends a batch without
losing what has already been saved.

Large photos are decoded subsampled so a 50 MP picture does not exhaust the heap. The
recorded width and height are always the original ones.

## The admin API

The app talks to `/api/admin/v1/*` in the Next.js app (`src/app/api/admin/v1/`). Those
route handlers call the same Server Actions and Zod schemas the web panel uses, so
validation, slug uniqueness, R2 cleanup and cache invalidation behave identically.

- **Auth** is a Supabase access token in `Authorization: Bearer …`. Cookies are
  deliberately ignored, so a site you happen to be signed into cannot drive these
  endpoints from your browser.
- **Responses** mirror the database rows (snake_case) inside
  `{ ok, data, error?, message? }`. **Request bodies** mirror the Server Action schemas
  (camelCase).
- A 401 makes the app refresh its token once and retry; if that fails it signs out.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth/login` | Email + password → tokens, profile, image/site URLs |
| POST | `/auth/refresh` | Refresh token → new token pair |
| POST | `/auth/logout` | Revoke the session |
| POST | `/auth/forgot` | Send a password-reset link |
| GET / PATCH | `/me` | Profile, inbox badges, team / display name |
| POST | `/me/password` | Change password |
| GET | `/dashboard` | Totals, 30-day series, top, recent, AdSense checklist |
| GET | `/bootstrap` | Category, collection and device pickers |
| GET / POST | `/wallpapers` | List with filters / create |
| GET / PATCH / DELETE | `/wallpapers/[id]` | Read, save, delete one |
| POST | `/wallpapers/[id]/image` | Replace the image |
| POST | `/wallpapers/bulk` | Bulk publish, feature or delete |
| POST | `/uploads` | Presigned R2 URLs (`kind: wallpaper \| cover`) |
| GET / POST | `/taxonomy/[kind]` | Categories, collections, devices |
| POST | `/taxonomy/[kind]/delete` | Delete several |
| GET / POST | `/posts`, GET `/posts/[id]`, POST `/posts/delete` | Blog |
| GET | `/inbox?type=messages\|reports` | Contact messages and content reports |
| POST | `/inbox/messages`, `/inbox/reports` | Change status or delete |
| GET / PUT | `/settings` | Site settings and AdSense settings |

Roles are enforced server-side: the inbox and the settings screens need `owner` or
`admin`, and the app hides them for editors.

## Source layout

```
app/src/main/java/com/iphoneduowallpaper/admin/
  MainActivity.kt        edge-to-edge host for the Compose tree
  AdminViewModel.kt      session, inbox badges, editor pickers
  data/
    Models.kt            API response types
    Requests.kt          request bodies
    ApiClient.kt         HTTP, token refresh, R2 uploads
    AdminRepository.kt   one method per admin operation
    SessionStore.kt      base URL, tokens and profile
    ImagePipeline.kt     decode → preview, thumbnail, dominant colour
    UploadEngine.kt      process + upload + progress
    ThumbLoader.kt       memory and disk cache for R2 images
  ui/
    AdminApp.kt          scaffold, bottom bar, screen switch
    Navigation.kt        screens and the back stack
    Theme.kt             the site's palette as Material 3
    Components.kt        cards, fields, chips, formatting
    Loading.kt           load state and mutation runner
    …Screen.kt           one file per area
```

## Notes

- Debug builds use the application id `com.iphoneduowallpaper.admin.debug`, so they can
  sit alongside a release build.
- Tokens live in app-private `SharedPreferences`, excluded from cloud backup and device
  transfer.
- There is no Play Store release configuration yet; `assembleRelease` would need a
  keystore.
