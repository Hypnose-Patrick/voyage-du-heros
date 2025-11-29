# CLAUDE.MD - Project Guide for Claude Code

## Project Overview

**Voyage du Héros** is an interactive React web application that guides job seekers through a transformative professional journey based on Joseph Campbell's Hero's Journey monomyth. The application features 12 stations across 3 phases of transformation, with PNL (NLP) coaching integration and ICARE profile assessment.

### Key Information
- **Author**: Patrick Beiner (patrick@pnl-formation.com)
- **Version**: 1.0.0
- **License**: MIT
- **Repository**: https://github.com/Hypnose-Patrick/voyage-du-heros

## Tech Stack

### Core Technologies
- **React 18.3.1** - Frontend framework
- **Vite 5.4.0** - Build tool and dev server
- **Framer Motion 11.0.0** - Animation library
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Zustand 5.0.8** - State management

### Additional Tools
- **Supabase** - Backend database and authentication
- **@react-pdf/renderer 4.3.1** - PDF generation
- **LocalStorage** - Client-side progress persistence

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Project Structure

```
voyage-du-heros/
├── src/
│   ├── components/           # React components
│   │   ├── ParcoursHeros.jsx # Main dashboard and navigation
│   │   ├── Station.tsx       # Individual station component
│   │   ├── icare/            # ICARE profile components
│   │   └── ...
│   ├── data/
│   │   ├── stationsData.tsx  # 12 stations configuration
│   │   └── ...
│   ├── lib/                  # Utilities and helpers
│   │   └── supabase.js       # Supabase client configuration
│   ├── store/                # Zustand state management
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # React entry point
│   └── index.css             # Tailwind and global styles
├── docs/                     # Documentation files
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── SUPABASE_SETUP.md
│   ├── station-*-*.md        # Station content and exercises
│   └── quiz-station-*.md     # Quiz questions
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
└── postcss.config.js         # PostCSS configuration
```

## Key Features

### The 12 Stations Journey
The application is structured around 12 stations organized in 3 phases:

**Phase 1: Le Départ (Departure)** - Stations 1-5
- Station 1: Le Monde Ordinaire (Ordinary World)
- Station 2: L'Appel à l'Aventure (Call to Adventure)
- Station 3: Le Refus de l'Appel (Refusal of the Call)
- Station 4: La Rencontre avec le Mentor (Meeting the Mentor)
- Station 5: Le Franchissement du Seuil (Crossing the Threshold)

**Phase 2: L'Initiation (Initiation)** - Stations 6-9
- Station 6: Les Épreuves, Alliés et Ennemis (Tests, Allies, and Enemies)
- Station 7: L'Approche de la Caverne (Approach to the Inmost Cave)
- Station 8: L'Épreuve Suprême (Ordeal)
- Station 9: La Récompense (Reward)

**Phase 3: Le Retour (Return)** - Stations 10-12
- Station 10: Le Chemin du Retour (Road Back)
- Station 11: La Résurrection (Resurrection)
- Station 12: Le Retour avec l'Élixir (Return with Elixir)

### Three Exploration Levels
- **Explorateur Rapide** (Quick Explorer): 5 min/station, 3 questions
- **Chercheur Curieux** (Curious Seeker): 15 min/station, 5 questions
- **Plongeur Profond** (Deep Diver): 30 min/station, 7 questions

### ICARE Profile Integration
The application includes an ICARE profile assessment system that evaluates:
- **I**ntuition vs Logique
- **C**réativité vs Structure
- **A**utonome vs Équipe
- **R**isque vs Sécurité
- **E**motion vs Raison

## Development Commands

```bash
# Start development server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

## Important Files

### Configuration Files
- **vite.config.js** - Vite build configuration
- **tailwind.config.js** - Tailwind CSS customization
- **postcss.config.js** - PostCSS plugins configuration
- **.eslintrc.cjs** - ESLint rules (if present)

### Core Application Files
- **src/App.jsx** - Main application component
- **src/components/ParcoursHeros.jsx** - Dashboard and navigation logic
- **src/components/Station.tsx** - Station display component
- **src/data/stationsData.tsx** - Complete 12-station configuration

### Data & State
- **src/lib/supabase.js** - Supabase client setup
- **src/store/** - Zustand state management stores
- **LocalStorage** - Used for progress persistence

### Documentation
- **README.md** - User-facing documentation
- **SCORING_SYSTEM.md** - Scoring algorithm documentation
- **ICARE_INTEGRATION_GUIDE.md** - ICARE profile integration guide
- **docs/SUPABASE_SETUP.md** - Database setup instructions

## Common Tasks

### Adding a New Component
1. Create component file in `src/components/`
2. Use TypeScript (.tsx) for type safety when needed
3. Follow existing naming conventions
4. Import and use in parent components

### Modifying Station Content
- Edit `src/data/stationsData.tsx` for station metadata
- Edit `docs/station-{number}-contenu-pedagogique.md` for educational content
- Edit `docs/station-{number}-exercices-pratiques.md` for exercises
- Edit `docs/quiz-station-{number}-{name}.md` for quiz questions

### Working with Supabase
- Configuration: `src/lib/supabase.js`
- Setup guide: `docs/SUPABASE_SETUP.md`
- Environment variables should be in `.env.local` (not committed)

### Styling Guidelines
- Use Tailwind utility classes
- Custom colors defined in `tailwind.config.js`
- Global styles in `src/index.css`
- Each phase has custom gradient colors

### Animation Patterns
- Use Framer Motion for all animations
- Common patterns:
  - `initial`, `animate`, `exit` props
  - `whileHover`, `whileTap` for interactions
  - `variants` for complex animations

## State Management

### Zustand Stores
The application uses Zustand for state management:
- User progress tracking
- Current station state
- ICARE profile scores
- Saved responses

### LocalStorage
Client-side persistence for:
- User journey progress
- Completed stations
- Quiz responses
- ICARE assessment results

## Testing & Quality

### Before Committing
```bash
# Check linting
npm run lint

# Check formatting
npm run format:check

# Build to ensure no errors
npm run build
```

### Known Issues to Watch For
- White screen on startup (fixed in recent commits)
- Error boundaries in place for error handling
- LocalStorage clearing may reset progress

## Git Workflow

### Branches
- **main** - Production-ready code
- **claude/*** - Feature branches created by Claude Code

### Commit Guidelines
- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Follow conventional commits format when possible

### Pull Requests
- Always create PR before merging to main
- Include description of changes
- Ensure builds pass before merging

## Environment Variables

Required environment variables (create `.env.local`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Performance Considerations

- Lazy load components when possible
- Use React.memo for expensive components
- Optimize images and assets
- Minimize bundle size (check with `npm run build`)

## Accessibility

- Ensure all interactive elements are keyboard accessible
- Use semantic HTML
- Include ARIA labels where needed
- Maintain color contrast ratios

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement approach

## Resources

### Documentation
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [Supabase Documentation](https://supabase.com/docs)

### Project-Specific Guides
- `/docs/IMPLEMENTATION_SUMMARY.md` - Implementation details
- `/docs/SUPABASE_SETUP.md` - Database setup
- `/ICARE_INTEGRATION_GUIDE.md` - ICARE profile system

## Tips for Working with Claude Code

1. **Read before editing**: Always read files before making changes
2. **Test locally**: Run `npm run dev` to test changes
3. **Check builds**: Run `npm run build` to ensure no build errors
4. **Follow patterns**: Maintain consistency with existing code style
5. **Document changes**: Update relevant documentation when needed

## Contact

For questions or issues:
- **Author**: Patrick Beiner
- **Email**: patrick@pnl-formation.com
- **GitHub Issues**: https://github.com/Hypnose-Patrick/voyage-du-heros/issues

---

Last updated: 2025-11-29
