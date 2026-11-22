// Grained-paper background.
// Two fixed layers of the Paper Shaders "paper texture" (https://github.com/paper-design/shaders, Apache-2.0):
//   .paper     sits under the content and darkens the page colour with fibres (multiply)
//   .paper-ink sits over the content and lifts it with the same grain (screen)
// The page colour itself comes from styles.css, so the site keeps its own palette.
// If WebGL or the CDN is unavailable, the layers stay empty and the plain background shows.
import {
  ShaderMount,
  paperTextureFragmentShader,
  getShaderColorFromString,
  getShaderNoiseTexture,
  ShaderFitOptions,
} from 'https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.0.80/+esm';

// 1x1 transparent PNG: the texture is drawn without a source image
const EMPTY_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const texture = {
  contrast: 0.3,
  roughness: 0.45,
  fiber: 0.3,
  fiberSize: 0.25,
  crumples: 0.03,
  crumpleSize: 0.4,
  folds: 0,
  foldCount: 1,
  fade: 0,
  drops: 0.03,
  seed: 5.8,
  scale: 0.55,
  fit: 'cover',
};

async function toImage(src) {
  if (src instanceof HTMLImageElement) {
    await src.decode();
    return src;
  }
  const img = new Image();
  img.src = src;
  await img.decode();
  return img;
}

async function mount(className, colorBack, colorFront) {
  const el = document.createElement('div');
  el.className = className;
  el.setAttribute('aria-hidden', 'true');
  document.body.prepend(el);

  const [noise, empty] = await Promise.all([
    toImage(getShaderNoiseTexture()),
    toImage(EMPTY_PIXEL),
  ]);

  new ShaderMount(
    el,
    paperTextureFragmentShader,
    {
      u_image: empty,
      u_noiseTexture: noise,
      u_colorFront: getShaderColorFromString(colorFront),
      u_colorBack: getShaderColorFromString(colorBack),
      u_contrast: texture.contrast,
      u_roughness: texture.roughness,
      u_fiber: texture.fiber,
      u_fiberSize: texture.fiberSize,
      u_crumples: texture.crumples,
      u_crumpleSize: texture.crumpleSize,
      u_foldCount: texture.foldCount,
      u_folds: texture.folds,
      u_fade: texture.fade,
      u_drops: texture.drops,
      u_seed: texture.seed,
      u_fit: ShaderFitOptions[texture.fit],
      u_scale: texture.scale,
      u_rotation: 0,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 0,
      u_worldHeight: 0,
    },
    undefined,
    0,
    0,
    undefined,
    undefined,
    ['u_image']
  );
}

try {
  await Promise.all([
    mount('paper', '#ffffff', '#b8b8b6'),
    mount('paper-ink', '#000000', '#4d4d4d'),
  ]);
} catch (err) {
  console.warn('Paper background unavailable:', err);
}
