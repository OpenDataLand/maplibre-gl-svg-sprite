export async function ensureFontLoaded(family, sizePx, weight = 'normal', style = 'normal', timeoutMs = 1500) {
    try {
        // CSS Font Loading API
        const docFonts = document.fonts;
        if (!docFonts || typeof docFonts.load !== 'function' || typeof docFonts.check !== 'function')
            return;
        const desc = `${style} ${weight} ${Math.round(sizePx)}px ${family}`;
        if (docFonts.check(desc))
            return; // already loaded
        const p = docFonts.load(desc);
        await Promise.race([
            p,
            new Promise((resolve) => setTimeout(resolve, timeoutMs))
        ]);
    }
    catch {
        // best-effort; ignore
    }
}
