export function codecPresent(codec) {
  return Boolean(codec) && codec !== 'none' && codec !== 'unknown';
}

export function formatHasVideo(format) {
  return codecPresent(format?.vcodec);
}

export function formatHasAudio(format) {
  return codecPresent(format?.acodec);
}

export function isProgressiveFormat(format) {
  return formatHasVideo(format) && formatHasAudio(format);
}

export function formatFileSize(bytes) {
  if (!bytes || Number(bytes) <= 0) return 'Size may vary';
  const mb = Number(bytes) / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  if (mb >= 1) return `${Math.round(mb)} MB`;
  return `${Math.max(1, Math.round(mb))} MB`;
}

export function pickBestFormatAtHeight(formats, height) {
  return formats
    .filter((f) => f.height === height)
    .sort(
      (a, b) =>
        (b.filesize || b.filesize_approx || 0) - (a.filesize || a.filesize_approx || 0),
    )[0];
}

export function pickBestAudioStream(rawFormats) {
  return (
    rawFormats
      .filter((f) => f.url && formatHasAudio(f) && !formatHasVideo(f))
      .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0] || null
  );
}

export function pickBestVideoOnlyStream(rawFormats) {
  return rawFormats
    .filter(
      (f) =>
        f.url &&
        formatHasVideo(f) &&
        !formatHasAudio(f) &&
        (f.ext === 'mp4' || f.ext === 'webm') &&
        f.height,
    )
    .sort((a, b) => (b.height || 0) - (a.height || 0));
}

export function pickProgressiveStreams(rawFormats) {
  return rawFormats.filter(
    (f) =>
      f.url &&
      isProgressiveFormat(f) &&
      (f.ext === 'mp4' || f.ext === 'webm') &&
      f.height,
  );
}

/**
 * Build a normalized public format object for API responses.
 */
export function buildPublicFormat({
  quality,
  videoFormat,
  audioFormat = null,
  needsMerge = false,
  formatId,
  sourceUrl,
  title,
  platform,
  buildDownloadPath,
}) {
  const merge = Boolean(needsMerge);
  const progressive = !merge && isProgressiveFormat(videoFormat);
  const hasVideo = formatHasVideo(videoFormat);
  const hasAudio = progressive;
  const outputExt = merge ? 'mp4' : videoFormat?.ext === 'webm' ? 'webm' : 'mp4';

  const sizeBytes = merge
    ? (videoFormat?.filesize || videoFormat?.filesize_approx || 0) +
      (audioFormat?.filesize || audioFormat?.filesize_approx || 0)
    : videoFormat?.filesize || videoFormat?.filesize_approx;

  const entry = {
    quality,
    format: outputExt === 'webm' ? 'webm' : 'mp4',
    extension: outputExt,
    size: formatFileSize(sizeBytes),
    filesize: sizeBytes || null,
    videoCodec: codecPresent(videoFormat?.vcodec) ? videoFormat.vcodec : null,
    audioCodec: progressive
      ? videoFormat?.acodec || null
      : codecPresent(audioFormat?.acodec)
        ? audioFormat.acodec
        : null,
    hasVideo,
    hasAudio,
    isProgressive: progressive,
    needsMerge: merge,
    audioMergeSupported: merge,
    formatId: String(formatId),
    downloadUrl: buildDownloadPath({
      videoUrl: sourceUrl,
      formatId: String(formatId),
      title,
      ext: outputExt,
      platform,
      needsMerge: merge,
    }),
  };

  if (!progressive && !merge && hasVideo) {
    entry.audioNote = 'Audio not available for this video.';
    entry.audioIncluded = false;
  } else if (progressive) {
    entry.audioIncluded = true;
  } else if (merge) {
    entry.audioIncluded = false;
  }

  return entry;
}
