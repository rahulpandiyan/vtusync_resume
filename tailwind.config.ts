import type { Config } from "tailwindcss";

const config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: ["'DM Sans'", "var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			blob: {
  				'0%': {
  					transform: 'translate(0px, 0px) scale(1)'
  				},
  				'33%': {
  					transform: 'translate(30px, -50px) scale(1.1)'
  				},
  				'66%': {
  					transform: 'translate(-20px, 20px) scale(0.9)'
  				},
  				'100%': {
  					transform: 'translate(0px, 0px) scale(1)'
  				}
  			},
  			'loading-dot': {
  				'0%': {
  					opacity: '0.2',
  					transform: 'translateX(-2px) scale(0.8)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'translateX(0px) scale(1.2)'
  				},
  				'100%': {
  					opacity: '0.2',
  					transform: 'translateX(2px) scale(0.8)'
  				}
  			},
  			'scale-check': {
  				'0%': {
  					transform: 'scale(0)'
  				},
  				'50%': {
  					transform: 'scale(1.2)'
  				},
  				'100%': {
  					transform: 'scale(1)'
  				}
  			},
  			'border-glow': {
  				'0%, 100%': {
  					opacity: '0.4',
  					transform: 'scale(1)'
  				},
  				'50%': {
  					opacity: '0.8',
  					transform: 'scale(1.01)'
  				}
  			},
  			'float-slow': {
  				'0%, 100%': {
  					transform: 'translateY(0) scale(1)'
  				},
  				'50%': {
  					transform: 'translateY(-10px) scale(1.02)'
  				}
  			},
  			'pulse-slow': {
  				'0%, 100%': {
  					opacity: '0.4'
  				},
  				'50%': {
  					opacity: '0.8'
  				}
  			},
  			'pulse-subtle': {
  				'0%, 100%': {
  					opacity: '0.3',
  					transform: 'scale(1)'
  				},
  				'50%': {
  					opacity: '0.5',
  					transform: 'scale(1.05)'
  				}
  			},
  			'morph': {
  				'0%, 100%': {
  					borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%'
  				},
  				'50%': {
  					borderRadius: '30% 60% 70% 30%/50% 60% 30% 60%'
  				}
  			},
  			'spin-slow': {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(360deg)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			blob: 'blob 7s infinite',
  			'loading-dot': 'loading-dot 1.4s infinite',
  			'scale-check': 'scale-check 0.3s ease-out forwards',
  			'border-glow': 'border-glow 4s ease-in-out infinite',
  			'float-slow': 'float-slow 6s ease-in-out infinite',
  			'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
  			'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
  			'morph': 'morph 8s ease-in-out infinite',
  			'spin-slow': 'spin-slow 20s linear infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
