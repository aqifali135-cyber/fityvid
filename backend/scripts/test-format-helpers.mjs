import assert from 'node:assert/strict';
import {
  codecPresent,
  formatHasAudio,
  formatHasVideo,
  isProgressiveFormat,
  buildPublicFormat,
} from '../src/utils/formatHelpers.js';

assert.equal(codecPresent('mp4a.40.2'), true);
assert.equal(codecPresent('none'), false);
assert.equal(codecPresent('unknown'), false);

assert.equal(formatHasVideo({ vcodec: 'avc1.640028' }), true);
assert.equal(formatHasVideo({ vcodec: 'none' }), false);

assert.equal(formatHasAudio({ acodec: 'mp4a.40.2' }), true);
assert.equal(formatHasAudio({ acodec: 'none' }), false);

assert.equal(isProgressiveFormat({ vcodec: 'avc1', acodec: 'mp4a.40.2' }), true);
assert.equal(isProgressiveFormat({ vcodec: 'avc1', acodec: 'none' }), false);

const progressive = buildPublicFormat({
  quality: '720p',
  videoFormat: {
    format_id: '22',
    ext: 'mp4',
    vcodec: 'avc1',
    acodec: 'mp4a.40.2',
    filesize: 50 * 1024 * 1024,
  },
  formatId: '22',
  sourceUrl: 'https://example.com/watch?v=abc',
  title: 'Test',
  platform: 'youtube',
  buildDownloadPath: ({ formatId }) => `/api/download?format=${formatId}`,
});

assert.equal(progressive.hasAudio, true);
assert.equal(progressive.isProgressive, true);
assert.equal(progressive.needsMerge, false);

const merged = buildPublicFormat({
  quality: '1080p',
  videoFormat: {
    format_id: '137',
    ext: 'mp4',
    vcodec: 'avc1',
    acodec: 'none',
    filesize: 80 * 1024 * 1024,
  },
  audioFormat: {
    format_id: '140',
    acodec: 'mp4a.40.2',
    filesize: 3 * 1024 * 1024,
  },
  needsMerge: true,
  formatId: '137+140',
  sourceUrl: 'https://example.com/watch?v=abc',
  title: 'Test',
  platform: 'youtube',
  buildDownloadPath: ({ formatId, needsMerge }) =>
    `/api/download?format=${formatId}&merge=${needsMerge ? '1' : '0'}`,
});

assert.equal(merged.hasAudio, false);
assert.equal(merged.needsMerge, true);
assert.equal(merged.audioMergeSupported, true);
assert.equal(merged.formatId, '137+140');

console.log('format helper tests passed');
