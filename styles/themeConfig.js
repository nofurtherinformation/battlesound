export const themeOptions = {
    palette: {
      type: 'light',
      primary: {
        main: '#ffffff',
      },
      secondary: {
        main: '#FFD500',
        contrastText: 'rgba(251,251,251,0.87)',
      },
      background: {
        default: '#004c9a',
        sapphire: '#005BBB',
        paper: '#00366f',
      },
      text: {
        primary: 'rgba(255,255,255,0.87)',
        secondary: '#FFD500',
        hint: 'rgba(255,255,255,0.38)',
        disabled: 'rgba(255,254,254,0.38)',
      },
      divider: 'rgba(249,249,249,0.12)',
    },
    typography: {
      fontFamily: "'Jost', sans-serif",
      h1: {
        fontSize: '8rem',
        color: 'primary',
        fontWeight: 'bold',
        lineHeight: 0.8,
        letterSpacing: -.2,
      },
      h2: {
        fontSize: '3.5rem',
      },
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    color: 'primary',
                    textTransform: 'uppercase',
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 'bold',
                },
                '&:hover': {
                    color: 'secondary'
                }
            },
        },
    }
  };