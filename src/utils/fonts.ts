export async function ensureFontLoaded(
  family: string,
  sizePx: number,
  weight: string = 'normal',
  style: string = 'normal',
  timeoutMs: number = 1500
): Promise<void> {
  try {
    // CSS Font Loading API
    const docFonts: any = (document as any).fonts;
    if (!docFonts || typeof docFonts.load !== 'function' || typeof docFonts.check !== 'function') return;
    const desc = `${style} ${weight} ${Math.round(sizePx)}px ${family}`;
    if (docFonts.check(desc)) return; // already loaded
    const p = docFonts.load(desc);
    await Promise.race([
      p,
      new Promise<void>((resolve) => setTimeout(resolve, timeoutMs))
    ]);
  } catch {
    // best-effort; ignore
  }
}

