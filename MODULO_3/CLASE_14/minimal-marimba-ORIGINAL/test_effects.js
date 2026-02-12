// Test script to verify effects modules load correctly
import AudioVisualizer from './js/modules/AudioVisualizer.js';
import ParticleSystem from './js/modules/ParticleSystem.js';
import CustomCursor from './js/modules/CustomCursor.js';
import RippleEffect from './js/modules/RippleEffect.js';
import ParallaxReverb from './js/modules/ParallaxReverb.js';

console.log('✅ All modules loaded successfully');
console.log('AudioVisualizer:', typeof AudioVisualizer);
console.log('ParticleSystem:', typeof ParticleSystem);
console.log('CustomCursor:', typeof CustomCursor);
console.log('RippleEffect:', typeof RippleEffect);
console.log('ParallaxReverb:', typeof ParallaxReverb);
