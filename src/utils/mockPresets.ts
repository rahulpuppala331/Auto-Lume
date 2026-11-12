import { PresetVehicle, VideoInputSource } from '../types';

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
}

export const PRESET_VEHICLES: PresetVehicle[] = [
  {
    id: 'dl7cq1939',
    name: 'Hyundai Creta (DL 7CQ 1939)',
    plate: 'DL7CQ1939',
    formattedPlate: 'DL 7CQ 1939',
    vehicle: 'Hyundai Creta (Black SUV)',
    challenge: 'Real car photo with Delhi HSRP number plate.',
    challengeType: 'clear',
    realPlateBBox: { x: 33, y: 68, width: 34, height: 13 },
    defaultParams: {
      blurRadius: 3,
      cannyLow: 45,
      cannyHigh: 130,
      thresholdMode: 'otsu',
      dilationIters: 1,
    },
    svgDataUrl: '/assets/aistudio/Screenshot_2026-11-01_212645_9343c5cd.png',
  },
  {
    id: 'ts09ab1234',
    name: 'Honda City (Telangana) - Clear Day',
    plate: 'TS09AB1234',
    formattedPlate: 'TS 09 AB 1234',
    vehicle: 'Honda City ZX i-VTEC (White Sedan)',
    challenge: 'High contrast standard daylight conditions with clear HSRP typography.',
    challengeType: 'clear',
    realPlateBBox: { x: 33, y: 68, width: 34, height: 13 },
    defaultParams: {
      blurRadius: 3,
      cannyLow: 45,
      cannyHigh: 130,
      thresholdMode: 'otsu',
      dilationIters: 1,
    },
    svgDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="60%" stop-color="#bae6fd"/>
            <stop offset="100%" stop-color="#e0f2fe"/>
          </linearGradient>
          <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <linearGradient id="carGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="70%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#94a3b8"/>
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0284c7" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#082f49" stop-opacity="0.95"/>
          </linearGradient>
          <linearGradient id="grilleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
          <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.5"/>
          </filter>
        </defs>

        <!-- Environment Background -->
        <rect width="800" height="300" fill="url(#skyGrad)"/>
        <path d="M 0 300 L 800 300 L 800 500 L 0 500 Z" fill="url(#roadGrad)"/>
        <line x1="400" y1="360" x2="400" y2="500" stroke="#fbbf24" stroke-width="8" stroke-dasharray="30 20"/>
        
        <!-- Distant City Outline -->
        <path d="M 50 300 L 50 240 L 90 240 L 90 300 L 130 300 L 130 220 L 170 220 L 170 300 L 630 300 L 630 250 L 680 250 L 680 300 L 750 300 L 750 230 L 790 230 L 790 300 Z" fill="#93c5fd" opacity="0.4"/>

        <!-- Vehicle Body Front View -->
        <!-- Shadow beneath car -->
        <ellipse cx="400" cy="455" rx="280" ry="22" fill="#000" opacity="0.6"/>

        <!-- Wheels -->
        <rect x="150" y="380" width="70" height="65" rx="12" fill="#090d16"/>
        <rect x="580" y="380" width="70" height="65" rx="12" fill="#090d16"/>

        <!-- Main Cabin & Roof -->
        <path d="M 230 160 Q 400 140 570 160 L 610 240 L 190 240 Z" fill="url(#carGrad)" filter="url(#shadow)"/>
        <!-- Windshield -->
        <path d="M 245 170 Q 400 155 555 170 L 585 235 L 215 235 Z" fill="url(#glassGrad)"/>
        <!-- Rearview mirrors -->
        <ellipse cx="170" cy="235" rx="25" ry="14" fill="#e2e8f0"/>
        <ellipse cx="630" cy="235" rx="25" ry="14" fill="#e2e8f0"/>

        <!-- Main Body Hood & Bumper -->
        <path d="M 170 235 Q 400 230 630 235 L 660 380 Q 400 405 140 380 Z" fill="url(#carGrad)" filter="url(#shadow)"/>

        <!-- Headlights -->
        <path d="M 160 255 L 250 260 L 235 285 L 155 275 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
        <path d="M 640 255 L 550 260 L 565 285 L 645 275 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>

        <!-- Front Grille -->
        <path d="M 270 270 L 530 270 L 515 330 L 285 330 Z" fill="url(#grilleGrad)" stroke="#64748b" stroke-width="3"/>
        <circle cx="400" cy="295" r="14" fill="none" stroke="#e2e8f0" stroke-width="3"/>

        <!-- Lower Bumper Grille & Plate Recess -->
        <rect x="250" y="335" width="300" height="75" rx="8" fill="#0f172a"/>

        <!-- LICENSE PLATE (ALPR TARGET) -->
        <g id="licensePlate" transform="translate(265, 342)">
          <!-- Plate Base (White HSRP) -->
          <rect x="0" y="0" width="270" height="62" rx="5" fill="#ffffff" stroke="#1e293b" stroke-width="3" filter="url(#shadow)"/>
          <!-- IND Blue strip -->
          <rect x="2" y="2" width="28" height="58" rx="3" fill="#1e3a8a"/>
          <!-- India Chakra circle & IND text -->
          <circle cx="16" cy="20" r="7" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="16" y="44" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">IND</text>
          
          <!-- Hologram sticker dot top left -->
          <circle cx="40" cy="14" r="3.5" fill="#0284c7" opacity="0.6"/>

          <!-- Plate Characters -->
          <text x="150" y="42" font-family="'JetBrains Mono', sans-serif, monospace" font-size="34" font-weight="900" fill="#020617" letter-spacing="4" text-anchor="middle">TS 09 AB 1234</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'dl01ca4021',
    name: 'Tata Harrier (Delhi) - Night & Headlight Glare',
    plate: 'DL01CA4021',
    formattedPlate: 'DL 01 CA 4021',
    vehicle: 'Tata Harrier Dark Edition (Black SUV)',
    challenge: 'Night ambiance with intense headlight glare and specular reflection on plate border.',
    challengeType: 'low_light',
    realPlateBBox: { x: 34, y: 70, width: 32, height: 12 },
    defaultParams: {
      blurRadius: 5,
      cannyLow: 60,
      cannyHigh: 160,
      thresholdMode: 'adaptive',
      dilationIters: 2,
    },
    svgDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
        <defs>
          <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#020617"/>
            <stop offset="100%" stop-color="#090d16"/>
          </linearGradient>
          <radialGradient id="glareLeft" cx="20%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
            <stop offset="30%" stop-color="#ffffff" stop-opacity="0.6"/>
            <stop offset="80%" stop-color="#38bdf8" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="glareRight" cx="80%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
            <stop offset="30%" stop-color="#ffffff" stop-opacity="0.6"/>
            <stop offset="80%" stop-color="#38bdf8" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Dark Background -->
        <rect width="800" height="500" fill="url(#nightSky)"/>
        
        <!-- Dark Road -->
        <path d="M 0 320 L 800 320 L 800 500 L 0 500 Z" fill="#050811"/>
        <line x1="400" y1="360" x2="400" y2="500" stroke="#fef08a" stroke-width="4" stroke-opacity="0.3" stroke-dasharray="25 25"/>

        <!-- Dark SUV Body Silhouette -->
        <path d="M 200 170 Q 400 150 600 170 L 640 240 L 160 240 Z" fill="#0b1120"/>
        <path d="M 215 180 Q 400 165 585 180 L 610 235 L 190 235 Z" fill="#030712"/>

        <path d="M 140 240 Q 400 235 660 240 L 685 390 Q 400 415 115 390 Z" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>

        <!-- DRL LED Strips -->
        <path d="M 145 255 L 245 255" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
        <path d="M 655 255 L 555 255" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>

        <!-- Intense Projector Headlights (Glare source) -->
        <ellipse cx="180" cy="300" rx="25" ry="18" fill="#ffffff"/>
        <ellipse cx="620" cy="300" rx="25" ry="18" fill="#ffffff"/>
        <!-- Glare Cones -->
        <ellipse cx="140" cy="320" rx="140" ry="90" fill="url(#glareLeft)"/>
        <ellipse cx="660" cy="320" rx="140" ry="90" fill="url(#glareRight)"/>

        <!-- Grille & Recess -->
        <rect x="250" y="270" width="300" height="60" rx="6" fill="#020617" stroke="#1e293b"/>
        <rect x="260" y="340" width="280" height="75" rx="8" fill="#050914" stroke="#334155"/>

        <!-- NUMBER PLATE (Illuminated in headlight beam) -->
        <g id="licensePlate" transform="translate(275, 348)">
          <!-- Plate Base -->
          <rect x="0" y="0" width="250" height="58" rx="4" fill="#f8fafc" stroke="#334155" stroke-width="3"/>
          <rect x="2" y="2" width="26" height="54" rx="2" fill="#1d4ed8"/>
          <text x="15" y="42" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">IND</text>

          <!-- Text -->
          <text x="140" y="40" font-family="'JetBrains Mono', monospace" font-size="32" font-weight="900" fill="#020617" letter-spacing="3" text-anchor="middle">DL 01 CA 4021</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'mh12pk8899',
    name: 'Hyundai i20 (Maharashtra) - Rain & Mud [STOLEN / WANTED]',
    plate: 'MH12PK8899',
    formattedPlate: 'MH 12 PK 8899',
    vehicle: 'Hyundai i20 Asta Turbo (Red Hatchback)',
    challenge: 'Water droplet streaks, wet asphalt, mud spatter on lower bumper edge. Flagged in Hotlist.',
    challengeType: 'rain',
    realPlateBBox: { x: 33, y: 69, width: 34, height: 13 },
    defaultParams: {
      blurRadius: 5,
      cannyLow: 35,
      cannyHigh: 110,
      thresholdMode: 'adaptive',
      dilationIters: 2,
    },
    svgDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
        <defs>
          <linearGradient id="stormGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#334155"/>
          </linearGradient>
          <linearGradient id="redCar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#dc2626"/>
            <stop offset="60%" stop-color="#b91c1c"/>
            <stop offset="100%" stop-color="#7f1d1d"/>
          </linearGradient>
          <pattern id="rainPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="5" y1="0" x2="0" y2="25" stroke="#93c5fd" stroke-width="1.5" stroke-opacity="0.6"/>
            <line x1="25" y1="5" x2="20" y2="35" stroke="#93c5fd" stroke-width="1.2" stroke-opacity="0.5"/>
          </pattern>
        </defs>

        <rect width="800" height="500" fill="url(#stormGrad)"/>
        
        <!-- Wet reflection ground -->
        <path d="M 0 310 L 800 310 L 800 500 L 0 500 Z" fill="#0f172a"/>
        <ellipse cx="400" cy="460" rx="300" ry="25" fill="#ef4444" opacity="0.25"/>

        <!-- Rain streaks overlay -->
        <rect width="800" height="500" fill="url(#rainPattern)"/>

        <!-- Red Hatchback Body -->
        <path d="M 220 180 Q 400 160 580 180 L 610 245 L 190 245 Z" fill="url(#redCar)"/>
        <path d="M 235 190 Q 400 175 565 190 L 590 240 L 210 240 Z" fill="#0f172a" opacity="0.9"/>
        <!-- Wipers -->
        <line x1="280" y1="230" x2="380" y2="200" stroke="#000" stroke-width="4"/>
        <line x1="430" y1="230" x2="530" y2="200" stroke="#000" stroke-width="4"/>

        <path d="M 160 245 Q 400 240 640 245 L 670 385 Q 400 410 130 385 Z" fill="url(#redCar)"/>

        <!-- Foggy wet headlights -->
        <ellipse cx="190" cy="275" rx="35" ry="18" fill="#fef08a" opacity="0.8"/>
        <ellipse cx="610" cy="275" rx="35" ry="18" fill="#fef08a" opacity="0.8"/>

        <!-- Grille -->
        <path d="M 260 280 L 540 280 L 520 340 L 280 340 Z" fill="#111827"/>
        <rect x="250" y="342" width="300" height="72" rx="6" fill="#090d16"/>

        <!-- Mud splatters -->
        <circle cx="270" cy="390" r="12" fill="#78350f" opacity="0.7"/>
        <circle cx="285" cy="405" r="8" fill="#78350f" opacity="0.6"/>
        <circle cx="535" cy="395" r="14" fill="#78350f" opacity="0.65"/>

        <!-- NUMBER PLATE (With faint mud droplets & rain streak) -->
        <g id="licensePlate" transform="translate(265, 348)">
          <rect x="0" y="0" width="270" height="60" rx="4" fill="#ffffff" stroke="#1f2937" stroke-width="3"/>
          <rect x="2" y="2" width="26" height="56" rx="2" fill="#1e3a8a"/>
          <text x="15" y="42" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">IND</text>

          <!-- Mud speck on plate border -->
          <ellipse cx="25" cy="50" rx="6" ry="4" fill="#78350f" opacity="0.7"/>
          <ellipse cx="250" cy="12" rx="8" ry="5" fill="#78350f" opacity="0.5"/>

          <!-- Plate Text -->
          <text x="145" y="41" font-family="'JetBrains Mono', monospace" font-size="33" font-weight="900" fill="#090d16" letter-spacing="3" text-anchor="middle">MH 12 PK 8899</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'ka03mg7712',
    name: 'Nexon EV (Karnataka) - Electric Green Plate',
    plate: 'KA03MG7712',
    formattedPlate: 'KA 03 MG 7712',
    vehicle: 'Tata Nexon EV Empowered+ (Teal SUV)',
    challenge: 'Green license plate background with white lettering for zero-emission Electric Vehicles.',
    challengeType: 'ev',
    realPlateBBox: { x: 33, y: 69, width: 34, height: 13 },
    defaultParams: {
      blurRadius: 3,
      cannyLow: 40,
      cannyHigh: 120,
      thresholdMode: 'otsu',
      dilationIters: 1,
    },
    svgDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
        <defs>
          <linearGradient id="evSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#047857"/>
            <stop offset="50%" stop-color="#10b981"/>
            <stop offset="100%" stop-color="#d1fae5"/>
          </linearGradient>
          <linearGradient id="tealBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0d9488"/>
            <stop offset="70%" stop-color="#115e59"/>
            <stop offset="100%" stop-color="#134e4a"/>
          </linearGradient>
        </defs>

        <rect width="800" height="300" fill="url(#evSky)"/>
        <rect x="0" y="300" width="800" height="200" fill="#1e293b"/>
        
        <!-- EV Charging Station Silhouette -->
        <rect x="80" y="210" width="50" height="90" rx="8" fill="#10b981"/>
        <text x="105" y="260" font-family="'JetBrains Mono', monospace" font-size="20" fill="#ffffff" text-anchor="middle">⚡</text>

        <!-- Teal Car Body -->
        <path d="M 210 165 Q 400 145 590 165 L 620 235 L 180 235 Z" fill="url(#tealBody)"/>
        <path d="M 225 175 Q 400 160 575 175 L 600 230 L 200 230 Z" fill="#042f2e"/>
        <path d="M 150 235 Q 400 230 650 235 L 680 380 Q 400 405 120 380 Z" fill="url(#tealBody)"/>

        <!-- High-tech blue EV accents -->
        <line x1="220" y1="260" x2="580" y2="260" stroke="#38bdf8" stroke-width="4"/>

        <!-- Plate Recess -->
        <rect x="250" y="340" width="300" height="72" rx="8" fill="#022c22"/>

        <!-- GREEN EV LICENSE PLATE -->
        <g id="licensePlate" transform="translate(265, 346)">
          <!-- Plate Base in Green -->
          <rect x="0" y="0" width="270" height="60" rx="5" fill="#15803d" stroke="#166534" stroke-width="3"/>
          <rect x="2" y="2" width="26" height="56" rx="2" fill="#1e3a8a"/>
          <text x="15" y="42" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">IND</text>

          <!-- White Text for EV plate -->
          <text x="145" y="42" font-family="'JetBrains Mono', monospace" font-size="33" font-weight="900" fill="#ffffff" letter-spacing="3" text-anchor="middle">KA 03 MG 7712</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'ca7xyz892',
    name: 'Ford Mustang (California) - US Format',
    plate: '7XYZ892',
    formattedPlate: '7XYZ892',
    vehicle: 'Ford Mustang Mach-E (Rapid Red SUV)',
    challenge: 'US plate format (1:2 aspect ratio) with cursive state script on header and sticker tabs.',
    challengeType: 'angled',
    realPlateBBox: { x: 36, y: 70, width: 28, height: 14 },
    defaultParams: {
      blurRadius: 3,
      cannyLow: 45,
      cannyHigh: 135,
      thresholdMode: 'otsu',
      dilationIters: 1,
    },
    svgDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
        <defs>
          <linearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f97316"/>
            <stop offset="50%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#fed7aa"/>
          </linearGradient>
          <linearGradient id="mustangRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#dc2626"/>
            <stop offset="100%" stop-color="#991b1b"/>
          </linearGradient>
        </defs>

        <rect width="800" height="310" fill="url(#sunsetGrad)"/>
        <!-- Palm Trees -->
        <path d="M 80 310 Q 90 200 120 120 M 120 120 Q 90 100 60 110 M 120 120 Q 140 90 160 100 M 120 120 Q 150 130 180 140" stroke="#78350f" stroke-width="5" fill="none"/>
        <path d="M 720 310 Q 710 200 680 120 M 680 120 Q 650 100 620 110 M 680 120 Q 700 90 730 100 M 680 120 Q 710 130 740 140" stroke="#78350f" stroke-width="5" fill="none"/>

        <rect x="0" y="310" width="800" height="190" fill="#334155"/>

        <!-- Car Body -->
        <path d="M 220 180 Q 400 160 580 180 L 610 240 L 190 240 Z" fill="url(#mustangRed)"/>
        <path d="M 235 190 Q 400 175 565 190 L 585 235 L 215 235 Z" fill="#0f172a"/>
        <path d="M 160 240 Q 400 235 640 240 L 665 385 Q 400 410 135 385 Z" fill="url(#mustangRed)"/>

        <!-- US Plate Recess -->
        <rect x="285" y="345" width="230" height="75" rx="8" fill="#18181b"/>

        <!-- CALIFORNIA LICENSE PLATE (Standard 12" x 6") -->
        <g id="licensePlate" transform="translate(295, 350)">
          <rect x="0" y="0" width="210" height="65" rx="5" fill="#fdfefe" stroke="#cbd5e1" stroke-width="2"/>
          <!-- Red California script on top -->
          <text x="105" y="16" font-family="'Brush Script MT', 'Outfit', cursive, sans-serif" font-size="14" font-weight="700" fill="#dc2626" text-anchor="middle">California</text>
          
          <!-- Month sticker left & Year sticker right -->
          <rect x="12" y="8" width="16" height="10" rx="1" fill="#0284c7"/>
          <text x="20" y="16" font-family="sans-serif" font-size="7" font-weight="700" fill="#fff" text-anchor="middle">JUN</text>
          <rect x="182" y="8" width="16" height="10" rx="1" fill="#ea580c"/>
          <text x="190" y="16" font-family="sans-serif" font-size="7" font-weight="700" fill="#fff" text-anchor="middle">27</text>

          <!-- US Plate Characters -->
          <text x="105" y="50" font-family="'JetBrains Mono', monospace" font-size="34" font-weight="900" fill="#1e3a8a" letter-spacing="4" text-anchor="middle">7XYZ892</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'b1234ab',
    name: 'Volkswagen Golf (Europe) - Euro-Band Format',
    plate: 'B1234AB',
    formattedPlate: 'B 1234 AB',
    vehicle: 'Volkswagen Golf TSI (Silver Hatchback)',
    challenge: 'Long European format (520mm x 110mm) with blue Euro-band strip and DIN 1451 font.',
    challengeType: 'clear',
    realPlateBBox: { x: 32, y: 70, width: 36, height: 12 },
    defaultParams: {
      blurRadius: 3,
      cannyLow: 40,
      cannyHigh: 125,
      thresholdMode: 'otsu',
      dilationIters: 1,
    },
    svgDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
        <defs>
          <linearGradient id="silverGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f1f5f9"/>
            <stop offset="60%" stop-color="#cbd5e1"/>
            <stop offset="100%" stop-color="#94a3b8"/>
          </linearGradient>
        </defs>

        <rect width="800" height="300" fill="#64748b"/>
        <rect x="0" y="300" width="800" height="200" fill="#1e293b"/>

        <path d="M 210 170 Q 400 150 590 170 L 620 240 L 180 240 Z" fill="url(#silverGrad)"/>
        <path d="M 230 180 Q 400 165 570 180 L 595 235 L 205 235 Z" fill="#0f172a"/>
        <path d="M 150 240 Q 400 235 650 240 L 675 385 Q 400 410 125 385 Z" fill="url(#silverGrad)"/>

        <!-- European plate holder -->
        <rect x="250" y="345" width="300" height="65" rx="5" fill="#0f172a" stroke="#334155"/>

        <!-- EURO LONG LICENSE PLATE -->
        <g id="licensePlate" transform="translate(258, 350)">
          <rect x="0" y="0" width="284" height="55" rx="4" fill="#ffffff" stroke="#000000" stroke-width="2.5"/>
          <!-- Euro Blue Band on Left -->
          <rect x="1.5" y="1.5" width="28" height="52" rx="2" fill="#003399"/>
          <!-- 12 stars circle (simplified 6 stars) -->
          <circle cx="15.5" cy="18" r="7" fill="none" stroke="#ffcc00" stroke-width="1.5" stroke-dasharray="2 2"/>
          <!-- Country code 'D' -->
          <text x="15.5" y="42" font-family="'JetBrains Mono', sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">D</text>

          <!-- German state seal sticker dots -->
          <circle cx="68" cy="27" r="6" fill="#f59e0b"/>
          <circle cx="86" cy="27" r="7" fill="#3b82f6"/>

          <!-- Plate Text -->
          <text x="175" y="38" font-family="'JetBrains Mono', monospace" font-size="30" font-weight="900" fill="#000000" letter-spacing="4" text-anchor="middle">B 1234 AB</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'ap28bk5050',
    name: 'Toyota Innova (Andhra Pradesh) - Overhead CCTV',
    plate: 'AP28BK5050',
    formattedPlate: 'AP 28 BK 5050',
    vehicle: 'Toyota Innova Crysta (Silver MPV)',
    challenge: 'High-angle overhead surveillance camera mounted at 45° angle with oblique perspective.',
    challengeType: 'angled',
    realPlateBBox: { x: 34, y: 72, width: 32, height: 12 },
    defaultParams: {
      blurRadius: 4,
      cannyLow: 40,
      cannyHigh: 120,
      thresholdMode: 'otsu',
      dilationIters: 1,
    },
    svgDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
        <rect width="800" height="500" fill="#1e293b"/>
        <!-- Road lane markings -->
        <path d="M 100 0 L 0 500 L 800 500 L 700 0 Z" fill="#0f172a"/>
        <line x1="400" y1="0" x2="400" y2="500" stroke="#f59e0b" stroke-width="6" stroke-dasharray="25 20"/>
        
        <!-- Overhead CCTV camera timestamp overlay watermark -->
        <rect x="20" y="20" width="340" height="35" rx="5" fill="#020617" opacity="0.85"/>
        <text x="35" y="44" font-family="'JetBrains Mono', monospace" font-size="13" fill="#10b981" font-weight="700">CAM-04 ORR-EAST • REC [LIVE]</text>

        <!-- MPV Car Body from High-Angle Perspective -->
        <ellipse cx="400" cy="420" rx="240" ry="25" fill="#000" opacity="0.6"/>
        <path d="M 220 190 Q 400 170 580 190 L 630 360 Q 400 395 170 360 Z" fill="#94a3b8"/>
        <path d="M 240 200 Q 400 185 560 200 L 590 270 L 210 270 Z" fill="#0f172a"/>

        <!-- License Plate -->
        <g id="licensePlate" transform="translate(275, 335)">
          <rect x="0" y="0" width="250" height="58" rx="4" fill="#ffffff" stroke="#000" stroke-width="2.5"/>
          <rect x="2" y="2" width="26" height="54" rx="2" fill="#1e3a8a"/>
          <text x="15" y="38" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">IND</text>
          <text x="140" y="40" font-family="'JetBrains Mono', monospace" font-size="30" font-weight="900" fill="#020617" letter-spacing="3" text-anchor="middle">AP 28 BK 5050</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'tn07de9988',
    name: 'Maruti Brezza (Tamil Nadu) - Rear Angle View',
    plate: 'TN07DE9988',
    formattedPlate: 'TN 07 DE 9988',
    vehicle: 'Maruti Vitara Brezza (Blue Compact SUV)',
    challenge: 'Rear bumper plate recess under tailgate with slight shadow gradients.',
    challengeType: 'clear',
    realPlateBBox: { x: 33, y: 66, width: 34, height: 13 },
    defaultParams: {
      blurRadius: 3,
      cannyLow: 45,
      cannyHigh: 130,
      thresholdMode: 'otsu',
      dilationIters: 1,
    },
    svgDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
        <rect width="800" height="300" fill="#475569"/>
        <rect x="0" y="300" width="800" height="200" fill="#1e293b"/>

        <!-- Rear Tailgate View -->
        <path d="M 210 170 Q 400 150 590 170 L 630 360 Q 400 395 170 360 Z" fill="#1e40af"/>
        <path d="M 230 180 Q 400 165 570 180 L 590 250 L 210 250 Z" fill="#0f172a"/>

        <!-- Red Taillights -->
        <rect x="180" y="260" width="70" height="30" rx="6" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
        <rect x="550" y="260" width="70" height="30" rx="6" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>

        <!-- License Plate -->
        <g id="licensePlate" transform="translate(265, 325)">
          <rect x="0" y="0" width="270" height="60" rx="4" fill="#ffffff" stroke="#000" stroke-width="2.5"/>
          <rect x="2" y="2" width="26" height="56" rx="2" fill="#1e3a8a"/>
          <text x="15" y="40" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">IND</text>
          <text x="145" y="42" font-family="'JetBrains Mono', monospace" font-size="32" font-weight="900" fill="#090d16" letter-spacing="3" text-anchor="middle">TN 07 DE 9988</text>
        </g>
      </svg>
    `),
  },
];

export const SAMPLE_VIDEO_FEEDS: VideoInputSource[] = [
  {
    id: 'video-highway',
    title: 'Highway CCTV Traffic Junction (Multi-Vehicle ANPR)',
    description: 'Surveillance stream capturing 4 continuous vehicles across lanes 1-3 with varying speeds and lighting conditions.',
    durationSec: 12,
    fps: 30,
    platesInVideo: [
      {
        startSec: 0,
        endSec: 3,
        plate: 'TS09AB1234',
        formattedPlate: 'TS 09 AB 1234',
        vehicle: 'Honda City (White Sedan)',
        bboxAtStart: { x: 38, y: 76, width: 24, height: 10 },
        bboxAtEnd: { x: 32, y: 64, width: 36, height: 16 },
        challenge: 'Clear daylight approach at 72 km/h',
      },
      {
        startSec: 3.1,
        endSec: 6,
        plate: 'MH12PK8899',
        formattedPlate: 'MH 12 PK 8899',
        vehicle: 'Hyundai i20 (Red Hatchback) [STOLEN FLAG]',
        bboxAtStart: { x: 28, y: 78, width: 25, height: 10 },
        bboxAtEnd: { x: 22, y: 62, width: 38, height: 16 },
        challenge: 'Wet pavement reflection and rain streaks',
      },
      {
        startSec: 6.1,
        endSec: 9,
        plate: 'DL01CA4021',
        formattedPlate: 'DL 01 CA 4021',
        vehicle: 'Tata Harrier (Dark SUV)',
        bboxAtStart: { x: 44, y: 75, width: 22, height: 9 },
        bboxAtEnd: { x: 36, y: 65, width: 34, height: 15 },
        challenge: 'Low-light transition with LED DRL glare',
      },
      {
        startSec: 9.1,
        endSec: 12,
        plate: 'KA03MG7712',
        formattedPlate: 'KA 03 MG 7712',
        vehicle: 'Tata Nexon EV (Teal SUV)',
        bboxAtStart: { x: 35, y: 77, width: 23, height: 10 },
        bboxAtEnd: { x: 30, y: 66, width: 35, height: 15 },
        challenge: 'Green high-contrast EV plate identification',
      },
    ],
  },
  {
    id: 'video-parking',
    title: 'Smart Parking Barrier Gate Camera Stream',
    description: 'Entry gate camera capturing approaching vehicle decelerating to a stop at the boom barrier.',
    durationSec: 8,
    fps: 30,
    platesInVideo: [
      {
        startSec: 0,
        endSec: 8,
        plate: 'TS09AB1234',
        formattedPlate: 'TS 09 AB 1234',
        vehicle: 'Honda City ZX (White Sedan)',
        bboxAtStart: { x: 36, y: 72, width: 28, height: 12 },
        bboxAtEnd: { x: 33, y: 68, width: 34, height: 14 },
        challenge: 'Stationary barrier approach with ticket trigger',
      },
    ],
  },
  {
    id: 'video-toll',
    title: 'FASTag Express Highway Toll Lane Video',
    description: 'High-speed drive-through lane tracking vehicle passing under overhead RFID & ANPR gantry.',
    durationSec: 8,
    fps: 30,
    platesInVideo: [
      {
        startSec: 0,
        endSec: 8,
        plate: 'KA03MG7712',
        formattedPlate: 'KA 03 MG 7712',
        vehicle: 'Tata Nexon EV Empowered+',
        bboxAtStart: { x: 40, y: 74, width: 22, height: 10 },
        bboxAtEnd: { x: 31, y: 65, width: 38, height: 16 },
        challenge: 'Overhead angle with rapid motion blur mitigation',
      },
    ],
  },
];

