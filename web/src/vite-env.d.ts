/// <reference types="vite/client" />

// Declare CSS modules so TypeScript doesn't error on side-effect CSS imports
// (required when noUncheckedSideEffectImports is true)
declare module "*.css" {}

// Swiper CSS bare-specifier imports (not matched by *.css wildcard)
declare module "swiper/css" {}
declare module "swiper/css/navigation" {}
declare module "swiper/css/free-mode" {}
declare module "swiper/css/thumbs" {}
declare module "swiper/css/pagination" {}
declare module "swiper/css/scrollbar" {}
