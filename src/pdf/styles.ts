/**
 * Styles réutilisables pour les documents PDF
 * Basé sur @react-pdf/renderer
 */

import { StyleSheet, Font } from '@react-pdf/renderer';

// Enregistrer des polices personnalisées (optionnel)
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
// });

export const colors = {
  primary: '#8B5CF6', // Purple
  secondary: '#EC4899', // Pink
  background: '#0F172A', // Slate-900
  white: '#FFFFFF',
  gray: {
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  dimensions: {
    identite: '#3B82F6', // Blue
    capacites: '#F97316', // Orange
    appartenance: '#10B981', // Green
    risque: '#EF4444', // Red
    estime: '#8B5CF6', // Purple
  },
};

export const pdfStyles = StyleSheet.create({
  // Layout
  page: {
    padding: 40,
    backgroundColor: colors.white,
    fontFamily: 'Helvetica',
  },

  pageHeader: {
    marginBottom: 30,
    borderBottom: `2px solid ${colors.primary}`,
    paddingBottom: 15,
  },

  pageNumber: {
    position: 'absolute',
    top: 20,
    right: 40,
    fontSize: 10,
    color: colors.gray[500],
  },

  // Typography
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },

  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: 12,
    marginTop: 20,
  },

  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[700],
    marginBottom: 8,
  },

  body: {
    fontSize: 12,
    lineHeight: 1.6,
    color: colors.gray[700],
  },

  bodySmall: {
    fontSize: 10,
    lineHeight: 1.5,
    color: colors.gray[600],
  },

  italic: {
    fontStyle: 'italic',
    color: colors.gray[600],
  },

  bold: {
    fontWeight: 'bold',
  },

  // Cards
  card: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginLeft: 8,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },

  statBox: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 10,
    color: colors.gray[600],
    textAlign: 'center',
  },

  // Progress bars
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 4,
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Scores
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  scoreLabel: {
    fontSize: 12,
    color: colors.gray[700],
    flex: 1,
  },

  scoreValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginLeft: 10,
    minWidth: 40,
    textAlign: 'right',
  },

  // Before/After comparison
  comparisonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  comparisonBox: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
  },

  beforeBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },

  afterBox: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },

  comparisonLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  comparisonText: {
    fontSize: 10,
    fontStyle: 'italic',
    lineHeight: 1.4,
  },

  // Quote/Callout
  quote: {
    backgroundColor: colors.gray[100],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 15,
    marginVertical: 15,
    borderRadius: 4,
  },

  quoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.gray[700],
    lineHeight: 1.5,
    textAlign: 'center',
  },

  quoteAuthor: {
    fontSize: 10,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: 8,
  },

  // Lists
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },

  listItemBullet: {
    width: 20,
    fontSize: 12,
    color: colors.primary,
  },

  listItemText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.5,
    color: colors.gray[700],
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  gridItem: {
    flex: 1,
    minWidth: '45%',
  },

  // Dimension-specific colors
  dimensionIdentite: {
    color: colors.dimensions.identite,
  },
  dimensionCapacites: {
    color: colors.dimensions.capacites,
  },
  dimensionAppartenance: {
    color: colors.dimensions.appartenance,
  },
  dimensionRisque: {
    color: colors.dimensions.risque,
  },
  dimensionEstime: {
    color: colors.dimensions.estime,
  },
});

export default pdfStyles;
