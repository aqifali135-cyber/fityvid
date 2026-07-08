import { useEffect, useMemo, useState } from 'react';
import {
  addTextToImage,
  applySharpen,
  canvasToBlob,
  convertRasterFormat,
  cropImage,
  downloadBlob,
  extractColorPalette,
  formatBytes,
  getImageTool,
  loadImageFromFile,
  makeProfilePicture,
  mirrorImage,
  pngToSvgWrapper,
  resizeImage,
  rotateImage,
  svgFileToPng,
  tryConvertHeicToJpg,
} from '../utils/imageTools';
import './ImageToolsPanel.css';

const ACCEPT_BY_TOOL = {
  'svg-to-png': '.svg,image/svg+xml',
  'heic-to-jpg': '.heic,.heif,image/heic,image/heif,image/*',
  'png-to-jpg': 'image/png,.png',
  'jpg-to-png': 'image/jpeg,.jpg,.jpeg',
  'png-to-svg': 'image/png,.png',
  default: 'image/*,.png,.jpg,.jpeg,.webp,.svg',
};

export default function ImageToolsPanel({ toolId, onClose }) {
  const tool = getImageTool(toolId);
  const [file, setFile] = useState(null);
  const [sourceImage, setSourceImage] = useState(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultBlob, setResultBlob] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [palette, setPalette] = useState([]);
  const [copiedColor, setCopiedColor] = useState('');

  const [profileShape, setProfileShape] = useState('circle');
  const [profileBg, setProfileBg] = useState('#ffffff');
  const [profileBorder, setProfileBorder] = useState(8);
  const [profileSize, setProfileSize] = useState(512);

  const [quality, setQuality] = useState(70);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [keepAspect, setKeepAspect] = useState(true);

  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(300);
  const [cropH, setCropH] = useState(300);
  const [cropRatio, setCropRatio] = useState('free');

  const [textValue, setTextValue] = useState('FityVid');
  const [fontSize, setFontSize] = useState(42);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textX, setTextX] = useState(40);
  const [textY, setTextY] = useState(60);
  const [textBold, setTextBold] = useState(true);

  const [sharpenAmount, setSharpenAmount] = useState(50);
  const [svgSize, setSvgSize] = useState('1024');

  useEffect(() => {
    resetAll();
  }, [toolId]);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [sourceUrl, resultUrl]);

  const accept = ACCEPT_BY_TOOL[toolId] || ACCEPT_BY_TOOL.default;

  const canProcess = useMemo(() => Boolean(sourceImage || file), [sourceImage, file]);

  function resetAll() {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setSourceImage(null);
    setSourceUrl('');
    setResultUrl('');
    setResultBlob(null);
    setError('');
    setStatus('');
    setBusy(false);
    setPalette([]);
    setCopiedColor('');
    setOriginalSize(0);
    setCompressedSize(0);
  }

  async function handleFileChange(event) {
    const next = event.target.files?.[0];
    if (!next) return;

    setError('');
    setStatus('');
    setResultBlob(null);
    setPalette([]);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl('');

    const isHeic = /\.heic$|\.heif$/i.test(next.name) || /heic|heif/i.test(next.type);
    const isSvg = /\.svg$/i.test(next.name) || next.type === 'image/svg+xml';

    if (toolId === 'heic-to-jpg' && !isHeic && !next.type.startsWith('image/')) {
      setError('Please upload a HEIC/HEIF image.');
      return;
    }

    if (toolId === 'svg-to-png' && !isSvg) {
      setError('Please upload an SVG file.');
      return;
    }

    if (toolId === 'png-to-jpg' && !/png/i.test(next.type) && !/\.png$/i.test(next.name)) {
      setError('Please upload a PNG file.');
      return;
    }

    if (toolId === 'jpg-to-png' && !/jpe?g/i.test(next.type) && !/\.jpe?g$/i.test(next.name)) {
      setError('Please upload a JPG/JPEG file.');
      return;
    }

    if (toolId === 'png-to-svg' && !/png/i.test(next.type) && !/\.png$/i.test(next.name)) {
      setError('Please upload a PNG file.');
      return;
    }

    try {
      setBusy(true);
      setFile(next);
      setOriginalSize(next.size);

      if (toolId === 'heic-to-jpg' && isHeic) {
        const blob = await tryConvertHeicToJpg(next);
        if (!blob) {
          setError(
            'HEIC conversion requires browser support. Please use Safari/Chrome with supported HEIC file or convert from mobile first.',
          );
          setBusy(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        setResultBlob(blob);
        setResultUrl(url);
        setCompressedSize(blob.size);
        setStatus('HEIC converted to JPG successfully.');
        setBusy(false);
        return;
      }

      if (toolId === 'svg-to-png' && isSvg) {
        setFile(next);
        setSourceUrl(URL.createObjectURL(next));
        setBusy(false);
        return;
      }

      const image = await loadImageFromFile(next);
      setSourceImage(image);
      setSourceUrl(URL.createObjectURL(next));
      setResizeWidth(image.width);
      setResizeHeight(image.height);
      setCropW(Math.min(300, image.width));
      setCropH(Math.min(300, image.height));
      setBusy(false);
    } catch {
      setError('Unable to load this file. Please choose a valid image.');
      setBusy(false);
    }
  }

  function setProcessed(canvasOrBlob, filenameHint = 'processed.png', type = 'image/png') {
    return (async () => {
      let blob = canvasOrBlob;
      if (!(canvasOrBlob instanceof Blob)) {
        blob = await canvasToBlob(canvasOrBlob, type, type === 'image/jpeg' ? 0.92 : undefined);
      }
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
      setCompressedSize(blob.size);
      setStatus(`Ready: ${filenameHint}`);
      return blob;
    })();
  }

  async function processImage() {
    if (!tool) return;
    setError('');
    setStatus('');
    setBusy(true);

    try {
      if (toolId === 'svg-to-png') {
        if (!file) throw new Error('Please upload an SVG file first.');
        const blob = await svgFileToPng(file, svgSize === 'original' ? 'original' : Number(svgSize));
        await setProcessed(blob, 'svg-converted.png', 'image/png');
        setBusy(false);
        return;
      }

      if (!sourceImage && toolId !== 'heic-to-jpg') {
        throw new Error('Please upload an image first.');
      }

      if (toolId === 'profile-picture') {
        const canvas = makeProfilePicture(sourceImage, {
          shape: profileShape,
          background: profileBg,
          border: Number(profileBorder),
          size: Number(profileSize),
        });
        await setProcessed(canvas, 'profile-picture.png');
      } else if (toolId === 'crop') {
        const canvas = cropImage(sourceImage, cropX, cropY, cropW, cropH);
        await setProcessed(canvas, 'cropped.png');
      } else if (toolId === 'compress') {
        const type = file?.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const { canvas, ctx } = (() => {
          const c = document.createElement('canvas');
          c.width = sourceImage.width;
          c.height = sourceImage.height;
          const context = c.getContext('2d');
          if (type === 'image/jpeg') {
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, c.width, c.height);
          }
          context.drawImage(sourceImage, 0, 0);
          return { canvas: c, ctx: context };
        })();
        void ctx;
        const blob = await canvasToBlob(canvas, type, Math.max(0.1, Number(quality) / 100));
        await setProcessed(blob, `compressed.${type === 'image/png' ? 'png' : 'jpg'}`, type);
      } else if (toolId === 'rotate') {
        // default 90 right if process clicked without direction buttons
        const canvas = rotateImage(sourceImage, 90);
        await setProcessed(canvas, 'rotated.png');
      } else if (toolId === 'resize') {
        const canvas = resizeImage(sourceImage, Number(resizeWidth), Number(resizeHeight));
        await setProcessed(canvas, 'resized.png');
      } else if (toolId === 'add-text') {
        const canvas = addTextToImage(sourceImage, {
          text: textValue,
          fontSize: Number(fontSize),
          color: textColor,
          x: Number(textX),
          y: Number(textY),
          bold: textBold,
        });
        await setProcessed(canvas, 'text-photo.png');
      } else if (toolId === 'sharpen') {
        const canvas = applySharpen(sourceImage, Number(sharpenAmount));
        await setProcessed(canvas, 'sharpened.png');
      } else if (toolId === 'mirror') {
        const canvas = mirrorImage(sourceImage, true, false);
        await setProcessed(canvas, 'mirrored.png');
      } else if (toolId === 'color-palette') {
        const colors = extractColorPalette(sourceImage, 8);
        setPalette(colors);
        setStatus(`Extracted ${colors.length} colors.`);
      } else if (toolId === 'png-to-jpg') {
        const blob = await convertRasterFormat(sourceImage, 'image/jpeg', 0.92, true);
        await setProcessed(blob, 'converted.jpg', 'image/jpeg');
      } else if (toolId === 'jpg-to-png') {
        const blob = await convertRasterFormat(sourceImage, 'image/png');
        await setProcessed(blob, 'converted.png', 'image/png');
      } else if (toolId === 'png-to-svg') {
        const blob = await pngToSvgWrapper(file, sourceImage);
        await setProcessed(blob, 'image.svg', 'image/svg+xml');
        setStatus('This creates an SVG file containing your PNG image.');
      } else if (toolId === 'heic-to-jpg') {
        setError(
          'HEIC conversion requires browser support. Please use Safari/Chrome with supported HEIC file or convert from mobile first.',
        );
      }
    } catch (err) {
      setError(err.message || 'Unable to process this image.');
    } finally {
      setBusy(false);
    }
  }

  async function rotateBy(degrees) {
    if (!sourceImage) return setError('Please upload an image first.');
    setBusy(true);
    try {
      const canvas = rotateImage(sourceImage, degrees);
      await setProcessed(canvas, 'rotated.png');
    } catch {
      setError('Unable to rotate image.');
    } finally {
      setBusy(false);
    }
  }

  async function mirrorBy(horizontal, vertical) {
    if (!sourceImage) return setError('Please upload an image first.');
    setBusy(true);
    try {
      const canvas = mirrorImage(sourceImage, horizontal, vertical);
      await setProcessed(canvas, 'mirrored.png');
    } catch {
      setError('Unable to mirror image.');
    } finally {
      setBusy(false);
    }
  }

  function applyCropRatio(ratio) {
    setCropRatio(ratio);
    if (!sourceImage || ratio === 'free') return;
    const [rw, rh] = ratio.split(':').map(Number);
    const maxW = sourceImage.width;
    const maxH = sourceImage.height;
    let width = maxW;
    let height = Math.round((width * rh) / rw);
    if (height > maxH) {
      height = maxH;
      width = Math.round((height * rw) / rh);
    }
    setCropX(Math.round((maxW - width) / 2));
    setCropY(Math.round((maxH - height) / 2));
    setCropW(width);
    setCropH(height);
  }

  function handleWidthChange(value) {
    const width = Number(value) || 1;
    setResizeWidth(width);
    if (keepAspect && sourceImage) {
      const ratio = sourceImage.height / sourceImage.width;
      setResizeHeight(Math.max(1, Math.round(width * ratio)));
    }
  }

  function handleHeightChange(value) {
    const height = Number(value) || 1;
    setResizeHeight(height);
    if (keepAspect && sourceImage) {
      const ratio = sourceImage.width / sourceImage.height;
      setResizeWidth(Math.max(1, Math.round(height * ratio)));
    }
  }

  function handleDownload() {
    if (!resultBlob) return;
    const ext =
      resultBlob.type === 'image/jpeg'
        ? 'jpg'
        : resultBlob.type === 'image/svg+xml'
          ? 'svg'
          : 'png';
    downloadBlob(resultBlob, `${tool?.id || 'image'}.${ext}`);
    setStatus('Download started.');
  }

  async function copyColor(hex) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(''), 1600);
    } catch {
      /* ignore */
    }
  }

  if (!tool) return null;

  return (
    <section id="image-tools-panel" className="image-tools-panel-section">
      <div className="container">
        <div className="image-tools-panel card">
          <div className="image-tools-panel__head">
            <div>
              <p className="image-tools-panel__eyebrow">Image Tools</p>
              <h2 className="image-tools-panel__title">{tool.title}</h2>
              <p className="image-tools-panel__subtitle">
                Upload an image and process it instantly in your browser. No upload to a server.
              </p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close Tool
            </button>
          </div>

          <div className="image-tools-panel__upload">
            <label className="image-tools-panel__upload-box">
              <input type="file" accept={accept} onChange={handleFileChange} />
              <span className="image-tools-panel__upload-title">Upload image</span>
              <span className="image-tools-panel__upload-hint">
                {file ? file.name : 'Tap or click to choose a file'}
              </span>
            </label>
          </div>

          {toolId === 'png-to-svg' && (
            <p className="image-tools-panel__note">
              This creates an SVG file containing your PNG image.
            </p>
          )}

          <div className="image-tools-panel__controls">{renderControls()}</div>

          <div className="image-tools-panel__actions">
            <button type="button" className="btn btn-primary" onClick={processImage} disabled={!canProcess || busy}>
              {busy ? 'Processing…' : 'Process Image'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetAll}>
              Clear
            </button>
            <button type="button" className="btn btn-outline" onClick={handleDownload} disabled={!resultBlob}>
              Download
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}
          {status && <p className="image-tools-panel__status" role="status">{status}</p>}

          <div className="image-tools-panel__previews">
            <div className="image-tools-panel__preview-card">
              <h3>Original</h3>
              {sourceUrl ? (
                <img src={sourceUrl} alt="Original upload preview" />
              ) : (
                <p className="image-tools-panel__empty">No image uploaded yet.</p>
              )}
              {originalSize > 0 && <p className="image-tools-panel__meta">Size: {formatBytes(originalSize)}</p>}
            </div>
            <div className="image-tools-panel__preview-card">
              <h3>Processed</h3>
              {resultUrl ? (
                toolId === 'png-to-svg' ? (
                  <p className="image-tools-panel__empty">SVG ready for download.</p>
                ) : (
                  <img src={resultUrl} alt="Processed preview" />
                )
              ) : (
                <p className="image-tools-panel__empty">Processed preview will appear here.</p>
              )}
              {compressedSize > 0 && <p className="image-tools-panel__meta">Size: {formatBytes(compressedSize)}</p>}
            </div>
          </div>

          {toolId === 'color-palette' && palette.length > 0 && (
            <div className="image-tools-panel__palette">
              {palette.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className={`image-tools-panel__swatch${copiedColor === hex ? ' is-copied' : ''}`}
                  onClick={() => copyColor(hex)}
                  title="Copy hex"
                >
                  <span className="image-tools-panel__swatch-color" style={{ background: hex }} />
                  <span className="image-tools-panel__swatch-hex">
                    {copiedColor === hex ? 'Copied!' : hex}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  function renderControls() {
    if (toolId === 'profile-picture') {
      return (
        <div className="image-tools-panel__grid">
          <label>
            Shape
            <select value={profileShape} onChange={(e) => setProfileShape(e.target.value)}>
              <option value="circle">Circle</option>
              <option value="rounded">Rounded</option>
              <option value="square">Square</option>
            </select>
          </label>
          <label>
            Background
            <input type="color" value={profileBg} onChange={(e) => setProfileBg(e.target.value)} />
          </label>
          <label>
            Border size
            <input type="number" min="0" max="40" value={profileBorder} onChange={(e) => setProfileBorder(e.target.value)} />
          </label>
          <label>
            Output size
            <select value={profileSize} onChange={(e) => setProfileSize(e.target.value)}>
              <option value="512">512×512</option>
              <option value="1024">1024×1024</option>
            </select>
          </label>
        </div>
      );
    }

    if (toolId === 'compress') {
      return (
        <div className="image-tools-panel__grid">
          <label className="image-tools-panel__span2">
            Quality: {quality}%
            <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(e.target.value)} />
          </label>
        </div>
      );
    }

    if (toolId === 'rotate') {
      return (
        <div className="image-tools-panel__inline-actions">
          <button type="button" className="btn btn-secondary" onClick={() => rotateBy(-90)}>Rotate Left</button>
          <button type="button" className="btn btn-secondary" onClick={() => rotateBy(90)}>Rotate Right</button>
          <button type="button" className="btn btn-secondary" onClick={() => rotateBy(180)}>180°</button>
        </div>
      );
    }

    if (toolId === 'resize') {
      return (
        <div className="image-tools-panel__grid">
          <label>
            Width
            <input type="number" min="1" value={resizeWidth} onChange={(e) => handleWidthChange(e.target.value)} />
          </label>
          <label>
            Height
            <input type="number" min="1" value={resizeHeight} onChange={(e) => handleHeightChange(e.target.value)} />
          </label>
          <label className="image-tools-panel__checkbox">
            <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} />
            Keep aspect ratio
          </label>
        </div>
      );
    }

    if (toolId === 'crop') {
      return (
        <div className="image-tools-panel__grid">
          <label>
            Aspect ratio
            <select value={cropRatio} onChange={(e) => applyCropRatio(e.target.value)}>
              <option value="free">Free</option>
              <option value="1:1">1:1</option>
              <option value="4:5">4:5</option>
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
            </select>
          </label>
          <label>
            X
            <input type="number" min="0" value={cropX} onChange={(e) => setCropX(Number(e.target.value))} />
          </label>
          <label>
            Y
            <input type="number" min="0" value={cropY} onChange={(e) => setCropY(Number(e.target.value))} />
          </label>
          <label>
            Width
            <input type="number" min="1" value={cropW} onChange={(e) => setCropW(Number(e.target.value))} />
          </label>
          <label>
            Height
            <input type="number" min="1" value={cropH} onChange={(e) => setCropH(Number(e.target.value))} />
          </label>
        </div>
      );
    }

    if (toolId === 'add-text') {
      return (
        <div className="image-tools-panel__grid">
          <label className="image-tools-panel__span2">
            Text
            <input type="text" value={textValue} onChange={(e) => setTextValue(e.target.value)} />
          </label>
          <label>
            Font size
            <input type="number" min="10" max="200" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
          </label>
          <label>
            Text color
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
          </label>
          <label>
            Position X
            <input type="number" value={textX} onChange={(e) => setTextX(e.target.value)} />
          </label>
          <label>
            Position Y
            <input type="number" value={textY} onChange={(e) => setTextY(e.target.value)} />
          </label>
          <label className="image-tools-panel__checkbox">
            <input type="checkbox" checked={textBold} onChange={(e) => setTextBold(e.target.checked)} />
            Bold
          </label>
        </div>
      );
    }

    if (toolId === 'sharpen') {
      return (
        <div className="image-tools-panel__grid">
          <label className="image-tools-panel__span2">
            Sharpen amount: {sharpenAmount}
            <input type="range" min="0" max="100" value={sharpenAmount} onChange={(e) => setSharpenAmount(e.target.value)} />
          </label>
        </div>
      );
    }

    if (toolId === 'mirror') {
      return (
        <div className="image-tools-panel__inline-actions">
          <button type="button" className="btn btn-secondary" onClick={() => mirrorBy(true, false)}>Flip Horizontal</button>
          <button type="button" className="btn btn-secondary" onClick={() => mirrorBy(false, true)}>Flip Vertical</button>
          <button type="button" className="btn btn-secondary" onClick={() => mirrorBy(true, true)}>Flip Both</button>
        </div>
      );
    }

    if (toolId === 'svg-to-png') {
      return (
        <div className="image-tools-panel__grid">
          <label>
            Output size
            <select value={svgSize} onChange={(e) => setSvgSize(e.target.value)}>
              <option value="512">512</option>
              <option value="1024">1024</option>
              <option value="original">Original</option>
            </select>
          </label>
        </div>
      );
    }

    if (toolId === 'heic-to-jpg') {
      return (
        <p className="image-tools-panel__note">
          HEIC conversion uses built-in browser decoding when available. If your browser cannot decode HEIC, you will see a clear support message.
        </p>
      );
    }

    return (
      <p className="image-tools-panel__note">
        Upload an image, then click Process Image to generate a preview and download file.
      </p>
    );
  }
}
