// jest.setup.js
import { TextEncoder, TextDecoder } from 'util';

// Provide global TextEncoder and TextDecoder for JSDOM
if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
}
