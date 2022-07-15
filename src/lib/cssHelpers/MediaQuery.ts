import { mediaObserver } from "svelte-media-observer";
import type { MediaQueries } from "svelte-media-observer";

const mediaQueries: MediaQueries<"small" | "medium" | "dark"> = [
  [ "small", "(max-width: 640px)" ],
  [ "medium", "(max-width: 935px)" ],
  [ "dark", "(prefers-color-scheme: dark)" ]
];

export const media = mediaObserver(mediaQueries);
