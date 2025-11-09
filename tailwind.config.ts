import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map CSS variables to Tailwind colors
        white: 'var(--white-color)',
        black: 'var(--black-color)',
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        tertiary: 'var(--tertiary-color)',
        quaternary: 'var(--quaternary-color)',
        quinary: 'var(--quinary-color)',
        senary: 'var(--senary-color)',
        septenary: 'var(--septenary-color)',
        octonary: 'var(--octonary-color)',
        nonary: 'var(--nonary-color)',
        denary: 'var(--denary-color)',
        eleventh: 'var(--eleventh-color)',
        twelfth: 'var(--twelfth-color)',
        thirteenth: 'var(--thirteenth-color)',
        fourteenth: 'var(--fourteenth-color)',
        fifteenth: 'var(--fifteenth-color)',
        sixteenth: 'var(--sixteenth-color)',
        seventeenth: 'var(--seventeenth-color)',
        eighteenth: 'var(--eighteenth-color)',
        nineteenth: 'var(--nineteenth-color)',
        twentieth: 'var(--twentieth-color)',
        'price-up': 'var(--thirty-first-color)',
        'price-down': 'var(--forty-third-color)',
        'price-ceiling': 'var(--thirty-fourth-color)',
        'price-floor': 'var(--thirty-sixth-color)',
        'price-reference': 'var(--thirty-fifth-color)',
      },
      fontSize: {
        'primary': 'var(--fs-primary)',
        'secondary': 'var(--fs-secondary)',
        'tertiary': 'var(--fs-tertiary)',
        'quaternary': 'var(--fs-quaternary)',
        'quinary': 'var(--fs-quinary)',
        'senary': 'var(--fs-senary)',
        'septenary': 'var(--fs-septenary)',
        'octonary': 'var(--fs-octonary)',
        'nonary': 'var(--fs-nonary)',
      },
      fontWeight: {
        'primary': 'var(--fw-primary)',
        'secondary': 'var(--fw-secondary)',
        'tertiary': 'var(--fw-tertiary)',
        'quaternary': 'var(--fw-quaternary)',
        'quinary': 'var(--fw-quinary)',
        'senary': 'var(--fw-senary)',
        'septenary': 'var(--fw-septenary)',
        'octonary': 'var(--fw-octonary)',
        'nonary': 'var(--fw-nonary)',
      },
      transitionDuration: {
        'primary': 'var(--primary-duration)',
        'secondary': 'var(--secondary-duration)',
        'tertiary': 'var(--tertiary-duration)',
      },
      spacing: {
        'header': 'var(--header-height)',
        'sidebar': 'var(--sidebar-modal-width)',
        'scrollbar': 'var(--scrollbar-width)',
      },
      boxShadow: {
        'primary': 'var(--primary-box-shadow)',
      },
    },
  },
  plugins: [],
} satisfies Config

