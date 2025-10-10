export const THEMES = (() => {
    const toKebab = (s) => s.replace(/([A-Z])/g, '-$1').toLowerCase();

    const palettes = [
        {
            name: 'indigo-blue',
            light: {
                bodyFrom: '224, 231, 255',       // indigo-100
                bodyTo: '219, 234, 254',         // blue-100
                cardFrom: '238, 242, 255',       // indigo-50
                cardTo: '239, 246, 255',         // blue-50
                textFrom: '129, 140, 248',       // indigo-400
                textTo: '96, 165, 250',          // blue-400
                buttonFrom: '129, 140, 248',     // indigo-400
                buttonTo: '96, 165, 250',        // blue-400
                buttonText: '255, 255, 255',     // white
                placeholderFrom: '165, 180, 252',// indigo-300
                placeholderTo: '147, 197, 253',   // blue-300
                offFrom: '199, 210, 254',       // indigo-200
                offTo: '191, 219, 254'           // blue-200
            },
            dark: {
                bodyFrom: '38, 38, 38',         // neutral-800
                bodyTo: '64, 64, 64',           // neutral-700
                cardFrom: '31, 31, 31',         // neutral-900
                cardTo: '38, 38, 38',           // neutral-800
                textFrom: '229, 231, 235',       // gray-200
                textTo: '209, 213, 219',         // gray-300
                buttonFrom: '129, 140, 248',    // Lighter: indigo-400 (was 500)
                buttonTo: '96, 165, 250',        // Lighter: blue-400 (was 500)
                buttonText: '255, 255, 255',
                placeholderFrom: '165, 180, 252',// indigo-300 (kept as is)
                placeholderTo: '147, 197, 253',  // blue-300 (kept as is)
                offFrom: '129, 140, 248',        // Lighter: indigo-400 (was 500)
                offTo: '96, 165, 250'            // Lighter: blue-400 (was 500)
            }
        },

        {
            name: 'green-lime',
            light: {
                bodyFrom: '240, 253, 244',       // green-50
                bodyTo: '247, 254, 231',         // lime-50
                cardFrom: '245, 252, 245',
                cardTo: '252, 255, 231',
                textFrom: '34, 197, 94',         // green-500
                textTo: '132, 204, 22',          // lime-500
                buttonFrom: '34, 197, 94',
                buttonTo: '132, 204, 22',
                buttonText: '255, 255, 255',
                placeholderFrom: '134, 239, 172',// green-300 (approx)
                placeholderTo: '190, 242, 112',   // lime-300 (approx)
                offFrom: '167, 243, 152',        // green-200
                offTo: '217, 249, 157'           // lime-200
            },
            dark: {
                bodyFrom: '30, 30, 30',
                bodyTo: '50, 50, 50',
                cardFrom: '22, 22, 22',
                cardTo: '30, 30, 30',
                textFrom: '229, 231, 235',
                textTo: '209, 213, 219',
                buttonFrom: '34, 197, 94',       // Lighter: green-500 (was 600)
                buttonTo: '132, 204, 22',        // Lighter: lime-500 (was 600)
                buttonText: '255, 255, 255',
                placeholderFrom: '134, 239, 172',// green-300 (kept as is)
                placeholderTo: '190, 242, 112',  // lime-300 (kept as is)
                offFrom: '34, 197, 94',          // Lighter: green-500 (was 600)
                offTo: '132, 204, 22'            // Lighter: lime-500 (was 600)
            }
        },

        {
            name: 'red-orange',
            light: {
                bodyFrom: '255, 241, 241',       // red-50
                bodyTo: '255, 247, 237',         // orange-50
                cardFrom: '255, 245, 245',
                cardTo: '255, 249, 240',
                textFrom: '248, 113, 113',       // red-400
                textTo: '249, 115, 22',          // orange-500
                buttonFrom: '248, 113, 113',
                buttonTo: '249, 115, 22',
                buttonText: '255, 255, 255',
                placeholderFrom: '252, 165, 165',// red-300
                placeholderTo: '253, 186, 116',   // orange-300
                offFrom: '254, 202, 202',        // red-200
                offTo: '254, 215, 170'           // orange-200
            },
            dark: {
                bodyFrom: '32, 32, 32',
                bodyTo: '54, 54, 54',
                cardFrom: '20, 20, 20',
                cardTo: '30, 30, 30',
                textFrom: '229, 231, 235',
                textTo: '209, 213, 219',
                buttonFrom: '248, 113, 113',     // Lighter: red-400 (was 600)
                buttonTo: '249, 115, 22',        // Lighter: orange-500 (was 600)
                buttonText: '255, 255, 255',
                placeholderFrom: '252, 165, 165',// red-300 (kept as is)
                placeholderTo: '253, 186, 116',  // orange-300 (kept as is)
                offFrom: '248, 113, 113',        // Lighter: red-400 (was 600)
                offTo: '249, 115, 22'            // Lighter: orange-500 (was 600)
            }
        },

        {
            name: 'teal-yellow',
            light: {
                bodyFrom: '236, 254, 250',       // teal-50 (approx)
                bodyTo: '255, 251, 235',         // yellow-50
                cardFrom: '245, 254, 251',
                cardTo: '255, 253, 236',
                textFrom: '20, 184, 166',        // teal-500
                textTo: '234, 179, 8',           // yellow-500
                buttonFrom: '20, 184, 166',
                buttonTo: '234, 179, 8',
                buttonText: '255, 255, 255',
                placeholderFrom: '99, 211, 199',  // teal-300 (approx)
                placeholderTo: '253, 224, 71',    // yellow-300
                offFrom: '153, 230, 217',        // teal-200
                offTo: '253, 230, 138'           // yellow-200
            },
            dark: {
                bodyFrom: '34, 34, 34',
                bodyTo: '60, 60, 60',
                cardFrom: '28, 28, 28',
                cardTo: '34, 34, 34',
                textFrom: '229, 231, 235',
                textTo: '209, 213, 219',
                buttonFrom: '20, 184, 166',      // Lighter: teal-500 (was 600)
                buttonTo: '234, 179, 8',         // Lighter: yellow-500 (was 600)
                buttonText: '255, 255, 255',
                placeholderFrom: '99, 211, 199', // teal-300 (kept as is)
                placeholderTo: '253, 224, 71',   // yellow-300 (kept as is)
                offFrom: '20, 184, 166',         // Lighter: teal-500 (was 600)
                offTo: '234, 179, 8'             // Lighter: yellow-500 (was 600)
            }
        },

        {
            name: 'blue-cyan',
            light: {
                bodyFrom: '239, 246, 255',       // blue-50-ish
                bodyTo: '236, 254, 255',         // cyan-50-ish
                cardFrom: '243, 248, 255',
                cardTo: '240, 254, 255',
                textFrom: '96, 165, 250',        // blue-400
                textTo: '34, 211, 238',          // cyan-400 (approx)
                buttonFrom: '96, 165, 250',
                buttonTo: '34, 211, 238',
                buttonText: '255, 255, 255',
                placeholderFrom: '147, 197, 253',// blue-300
                placeholderTo: '125, 211, 252',   // cyan-300
                offFrom: '191, 219, 254',        // blue-200
                offTo: '165, 243, 252'           // cyan-200
            },
            dark: {
                bodyFrom: '30, 30, 30',
                bodyTo: '58, 58, 58',
                cardFrom: '20, 20, 20',
                cardTo: '30, 30, 30',
                textFrom: '229, 231, 235',
                textTo: '209, 213, 219',
                buttonFrom: '96, 165, 250',      // Lighter: blue-400 (was 500)
                buttonTo: '34, 211, 238',        // Lighter: cyan-400 (was 500-600)
                buttonText: '255, 255, 255',
                placeholderFrom: '147, 197, 253',// blue-300 (kept as is)
                placeholderTo: '125, 211, 252',  // cyan-300 (kept as is)
                offFrom: '96, 165, 250',         // Lighter: blue-400 (was 500)
                offTo: '34, 211, 238'            // Lighter: cyan-400 (was 500-600)
            }
        },

        {
            name: 'fuchsia-pink',
            light: {
                bodyFrom: '245, 230, 240',       // Darker: was fuchsia-50
                bodyTo: '245, 230, 240',         // Darker: was pink-50
                cardFrom: '248, 238, 243',       // Darker
                cardTo: '248, 238, 243',         // Darker
                textFrom: '192, 61, 209',        // Darker: fuchsia-600/700 (was 400)
                textTo: '219, 39, 119',          // Darker: pink-600/700 (was 400)
                buttonFrom: '192, 61, 209',      // Darker: same as textFrom
                buttonTo: '219, 39, 119',        // Darker: same as textTo
                buttonText: '255, 255, 255',
                placeholderFrom: '207, 120, 224',// Darker: fuchsia-500 (was 300)
                placeholderTo: '229, 107, 166',   // Darker: pink-500 (was 300)
                offFrom: '228, 140, 245',        // Darker: fuchsia-400 (was 200)
                offTo: '238, 165, 200'           // Darker: pink-400 (was 200)
            },
            dark: {
                bodyFrom: '38, 38, 38',
                bodyTo: '64, 64, 64',
                cardFrom: '31, 31, 31',
                cardTo: '38, 38, 38',
                textFrom: '255, 255, 255',
                textTo: '243, 244, 246',         // pink-400 (kept as is)
                buttonFrom: '232, 121, 249',
                buttonTo: '244, 114, 182',
                buttonText: '255, 255, 255',
                placeholderFrom: '240, 171, 252',// fuchsia-300 (kept as is)
                placeholderTo: '249, 168, 212',  // pink-300 (kept as is)
                offFrom: '244, 185, 255',
                offTo: '251, 207, 232'
            }
        },
    ];

    const STORAGE_KEY = 'app_theme_v1';

    let current = { palette: palettes[0].name, mode: 'light' };

    function applyPalette(paletteName, mode = 'light') {
        const palette = palettes.find(p => p.name === paletteName);
        if (!palette) {
            console.error('[THEME] palette not found:', paletteName);
            return false;
        }
        const vars = palette[mode] ?? palette.light;
        Object.entries(vars).forEach(([key, value]) => {
            const cssVar = `--${toKebab(key)}`; // e.g. --body-from
            document.documentElement.style.setProperty(cssVar, value);
        });

        if (mode === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');

        current = { palette: paletteName, mode };
        return true;
    }

    function saveTheme(paletteName = current.palette, mode = current.mode) {
        const payload = { palette: paletteName, mode };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }

    function loadTheme() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            applyPalette(current.palette, current.mode);
            return current;
        }
        try {
            const parsed = JSON.parse(raw);
            const applied = applyPalette(parsed.palette, parsed.mode);
            if (applied) current = { palette: parsed.palette, mode: parsed.mode };
            return current;
        } catch (err) {
            console.warn('[THEME] invalid stored theme, resetting to default');
            applyPalette(current.palette, current.mode);
            return current;
        }
    }

    function setTheme(paletteName, mode = 'light', persist = true) {
        const ok = applyPalette(paletteName, mode);
        if (!ok) return false;
        if (persist) saveTheme(paletteName, mode);
        return true;
    }

    function getPalettes() {
        return palettes.map(p => ({ name: p.name }));
    }

    function getCurrent() {
        return Object.assign({}, current);
    }

    return {
        palettes,
        applyPalette,
        setTheme,
        loadTheme,
        saveTheme,
        getPalettes,
        getCurrent
    };
})();