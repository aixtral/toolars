export function getCaptureOptions(entry) {
  const deviceScaleFactor = getDeviceScaleFactor(entry);

  return {
    viewport: {
      width: entry.viewport.width,
      height: entry.viewport.height
    },
    deviceScaleFactor
  };
}

export function getDeviceScaleFactor(entry) {
  return entry.formFactor === "mobile" ? 2 : 1;
}

export function getExpectedFirstViewportSize(entry) {
  const deviceScaleFactor = getDeviceScaleFactor(entry);

  return {
    width: entry.viewport.width * deviceScaleFactor,
    height: entry.viewport.height * deviceScaleFactor
  };
}
