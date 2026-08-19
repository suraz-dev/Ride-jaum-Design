/** React Native adapter for tokens/ridejaunm.tokens.json (the canonical DTCG source). */
export const primitive = {
  color: {
    volt: { 400: '#B4FF39', 500: '#9FE81F', 600: '#7FC40E' },
    cyan: { 400: '#22C9EE', 600: '#0B87A6' },
    graphite: { 50: '#E9EFED', 200: '#A6B6B1', 300: '#7E918C', 500: '#3C4B47', 600: '#2C3835', 700: '#202A27', 800: '#171F1D', 850: '#111716', 900: '#0B0F0E', 950: '#050807' },
    snow: { 0: '#FFFFFF', 50: '#F7F9F8', 300: '#CBD4D1', 600: '#54615D', 900: '#0F1513' },
    semantic: { success: '#2FD07A', warning: '#FFB020', info: '#22C9EE', danger: '#F2603C' },
    sos: { 400: '#FF4D64', 500: '#FF1F3D', 600: '#D80D28', 900: '#3D0209' },
    route: { straight: '#22C9EE', curvy: '#B4FF39', supercurvy: '#C25CFF', alternative: '#5A6D68', detour: '#FFB020', hazard: '#F2603C', lost: '#7E918C' },
  },
  spacing: { 0: 0, 1: 2, 2: 4, 3: 8, 4: 12, 5: 16, 6: 20, 7: 24, 8: 32, 9: 40, 10: 48, 11: 64, 12: 80, 13: 96 },
  radius: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 28, full: 999 },
  size: { targetMin: 48, targetInRide: 56, targetSOS: 88, targetPTT: 72, icon: 24, iconHUD: 32, navBar: 64, appBar: 56, sheetPeek: 120 },
  duration: { instant: 100, fast: 200, base: 320, slow: 600, cinematic: 1200, sosHold: 3000, sosCancel: 10000 },
} as const;

export type ThemeMode = 'night' | 'dayGlare' | 'dusk' | 'blackout';
type Theme = { background: string; surface: string; surfaceElevated: string; text: string; textMuted: string; border: string; interactive: string; information: string; mapGlass: { backgroundColor: string; borderColor: string; blurRadius: number } };
const night: Theme = { background: primitive.color.graphite[900], surface: primitive.color.graphite[850], surfaceElevated: primitive.color.graphite[800], text: primitive.color.graphite[50], textMuted: primitive.color.graphite[200], border: primitive.color.graphite[600], interactive: primitive.color.volt[400], information: primitive.color.cyan[400], mapGlass: { backgroundColor: 'rgba(11,15,14,0.62)', borderColor: 'rgba(255,255,255,0.08)', blurRadius: 24 } };
export const theme: Record<ThemeMode, Theme> = {
  night, dusk: night,
  blackout: { ...night, background: primitive.color.graphite[950], surface: primitive.color.graphite[900] },
  dayGlare: { background: primitive.color.snow[50], surface: primitive.color.snow[0], surfaceElevated: primitive.color.snow[0], text: primitive.color.snow[900], textMuted: primitive.color.snow[600], border: primitive.color.snow[300], interactive: primitive.color.volt[600], information: primitive.color.cyan[600], mapGlass: { backgroundColor: 'rgba(255,255,255,0.96)', borderColor: primitive.color.snow[300], blurRadius: 0 } },
};

export const type = {
  displayHero: { fontFamily: 'Space Grotesk', fontSize: 48, lineHeight: 52, fontWeight: '700', letterSpacing: -0.96 },
  h1: { fontFamily: 'Space Grotesk', fontSize: 32, lineHeight: 38, fontWeight: '700' },
  h2: { fontFamily: 'Space Grotesk', fontSize: 24, lineHeight: 30, fontWeight: '600' },
  h3: { fontFamily: 'Space Grotesk', fontSize: 20, lineHeight: 26, fontWeight: '600' },
  bodyLarge: { fontFamily: 'Inter', fontSize: 17, lineHeight: 26, fontWeight: '400' },
  bodyMedium: { fontFamily: 'Inter', fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodySmall: { fontFamily: 'Inter', fontSize: 13, lineHeight: 20, fontWeight: '400' },
  telemetryXL: { fontFamily: 'Space Grotesk', fontSize: 44, lineHeight: 46, fontWeight: '700', fontVariant: ['tabular-nums'] },
  telemetryLarge: { fontFamily: 'Space Grotesk', fontSize: 32, lineHeight: 34, fontWeight: '700', fontVariant: ['tabular-nums'] },
  npBody: { fontFamily: 'Mukta', fontSize: 15, lineHeight: 24, fontWeight: '400' },
  mono: { fontFamily: 'JetBrains Mono', fontSize: 12, lineHeight: 16, fontWeight: '500', fontVariant: ['tabular-nums'] },
} as const;

export const routePresentation = {
  straight: { label: 'Straight', color: primitive.color.route.straight, lineWidth: 6, lineDasharray: undefined, icon: 'arrow-straight' },
  curvy: { label: 'Curvy', color: primitive.color.route.curvy, lineWidth: 7, lineDasharray: undefined, icon: 'wave-single' },
  supercurvy: { label: 'Supercurvy', color: primitive.color.route.supercurvy, lineWidth: 8, lineDasharray: [3, 2], icon: 'wave-double' },
  alternative: { label: 'Alternative', color: primitive.color.route.alternative, lineWidth: 4, lineDasharray: [2, 2], icon: 'route-alt' },
  hazard: { label: 'Hazard', color: primitive.color.route.hazard, lineWidth: 4, lineDasharray: [2, 2], icon: 'warning' },
  detour: { label: 'Detour', color: primitive.color.route.detour, lineWidth: 4, lineDasharray: [2, 2], icon: 'route-detour' },
  lost: { label: 'Off route', color: primitive.color.route.lost, lineWidth: 4, lineDasharray: [2, 2], icon: 'question' },
} as const;

// SOS deliberately has no normal-theme alias. It is emergency UI only.
export const safety = { sos: { color: primitive.color.sos[500], pressed: primitive.color.sos[600], wash: primitive.color.sos[900], holdMs: primitive.duration.sosHold, cancelWindowMs: primitive.duration.sosCancel, target: primitive.size.targetSOS }, accessibility: { minContrast: 4.5, telemetryContrast: 7, sosContrast: 10, minTarget: primitive.size.targetMin, inRideTarget: primitive.size.targetInRide } } as const;
