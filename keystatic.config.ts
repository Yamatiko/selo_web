// Keystatic's tooling (the Vite plugin and the injected /keystatic routes) resolves
// `keystatic.config` from the project root, so this file must live here. The real
// schema lives in the isolated `cms/` layer.
export { default } from './cms/keystatic.config';
