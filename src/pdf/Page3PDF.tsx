/**
 * PAGE 3 PDF - Synthèse Transformation I.C.A.R.E.
 * Version PDF de la page I.C.A.R.E. pour export
 */

import { Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, colors } from './styles';
import { ICAREDimension } from '../types/profile';

interface DimensionData {
  dimension: ICAREDimension;
  icon: string;
  scoreBefore: number;
  scoreAfter: number;
  phraseBefore: string;
  phraseAfter: string;
  color: string;
}

interface Page3PDFProps {
  userName: string;
  journeyDuration: string;
  totalProgression: number;
  dimensions: DimensionData[];
  insights: string[];
  recommendations: string[];
}

const dimensionColors: Record<ICAREDimension, string> = {
  Identité: colors.dimensions.identite,
  Capacités: colors.dimensions.capacites,
  Appartenance: colors.dimensions.appartenance,
  Risque: colors.dimensions.risque,
  Estime: colors.dimensions.estime,
};

const dimensionIcons: Record<ICAREDimension, string> = {
  Identité: '🎭',
  Capacités: '🎯',
  Appartenance: '🤝',
  Risque: '🚀',
  Estime: '💎',
};

export default function Page3PDF({
  userName,
  journeyDuration,
  totalProgression,
  dimensions,
  insights,
  recommendations,
}: Page3PDFProps) {
  const avgBefore = dimensions.reduce((sum, d) => sum + d.scoreBefore, 0) / 5;
  const avgAfter = dimensions.reduce((sum, d) => sum + d.scoreAfter, 0) / 5;

  return (
    <Page size="A4" style={pdfStyles.page}>
      {/* Page Number */}
      <View style={pdfStyles.pageNumber}>
        <Text>PAGE 3/18</Text>
      </View>

      {/* Header */}
      <View style={pdfStyles.pageHeader}>
        <Text style={pdfStyles.h1}>Synthèse Transformation I.C.A.R.E.</Text>
        <Text style={pdfStyles.body}>
          Découvre comment tu as évolué sur les 5 dimensions fondamentales de ton
          développement professionnel
        </Text>
      </View>

      {/* Stats globales */}
      <View style={pdfStyles.statsContainer}>
        <View style={pdfStyles.statBox}>
          <Text style={pdfStyles.statValue}>+{totalProgression}%</Text>
          <Text style={pdfStyles.statLabel}>Progression globale</Text>
        </View>

        <View style={pdfStyles.statBox}>
          <Text style={pdfStyles.statValue}>{journeyDuration}</Text>
          <Text style={pdfStyles.statLabel}>Durée du parcours</Text>
        </View>

        <View style={pdfStyles.statBox}>
          <Text style={pdfStyles.statValue}>{avgAfter.toFixed(1)}/10</Text>
          <Text style={pdfStyles.statLabel}>Score moyen actuel</Text>
        </View>
      </View>

      {/* Quote */}
      <View style={pdfStyles.quote}>
        <Text style={pdfStyles.quoteText}>
          "Le voyage du héros n'est pas de conquérir le monde extérieur, mais de
          transformer son monde intérieur."
        </Text>
        <Text style={pdfStyles.quoteAuthor}>- Voyage du Héros</Text>
      </View>

      {/* Dimensions I.C.A.R.E. */}
      <Text style={pdfStyles.h2}>Les 5 Dimensions I.C.A.R.E.</Text>

      {dimensions.slice(0, 2).map((dimension) => (
        <DimensionCard key={dimension.dimension} {...dimension} />
      ))}

      {/* Insights */}
      {insights.length > 0 && (
        <View style={{ marginTop: 15 }}>
          <Text style={pdfStyles.h3}>💡 Insights Personnalisés</Text>
          {insights.slice(0, 3).map((insight, index) => (
            <View key={index} style={pdfStyles.listItem}>
              <Text style={pdfStyles.listItemBullet}>{index + 1}.</Text>
              <Text style={pdfStyles.listItemText}>{insight}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  );
}

/**
 * Composant carte pour une dimension
 */
function DimensionCard({
  dimension,
  scoreBefore,
  scoreAfter,
  phraseBefore,
  phraseAfter,
}: DimensionData) {
  const progression = scoreAfter - scoreBefore;
  const progressionPercent = scoreBefore > 0 ? Math.round((progression / scoreBefore) * 100) : 0;

  return (
    <View style={pdfStyles.card}>
      {/* Header */}
      <View style={pdfStyles.cardHeader}>
        <Text style={{ fontSize: 20 }}>{dimensionIcons[dimension]}</Text>
        <Text style={pdfStyles.cardTitle}>{dimension}</Text>
        {progression > 0 && (
          <Text
            style={{
              fontSize: 10,
              color: colors.dimensions.appartenance,
              marginLeft: 'auto',
            }}
          >
            +{progressionPercent}%
          </Text>
        )}
      </View>

      {/* Scores */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
        {/* Avant */}
        <View style={{ flex: 1 }}>
          <View style={pdfStyles.scoreRow}>
            <Text style={{ fontSize: 9, color: colors.gray[600] }}>AVANT</Text>
            <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
              {scoreBefore}/10
            </Text>
          </View>
          <View style={pdfStyles.progressBarContainer}>
            <View
              style={[
                pdfStyles.progressBarFill,
                {
                  width: `${(scoreBefore / 10) * 100}%`,
                  backgroundColor: colors.gray[400],
                },
              ]}
            />
          </View>
        </View>

        {/* Après */}
        <View style={{ flex: 1 }}>
          <View style={pdfStyles.scoreRow}>
            <Text style={{ fontSize: 9, color: colors.gray[600] }}>APRÈS</Text>
            <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
              {scoreAfter}/10
            </Text>
          </View>
          <View style={pdfStyles.progressBarContainer}>
            <View
              style={[
                pdfStyles.progressBarFill,
                {
                  width: `${(scoreAfter / 10) * 100}%`,
                  backgroundColor: dimensionColors[dimension],
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Comparaison AVANT/APRÈS */}
      <View style={pdfStyles.comparisonContainer}>
        <View style={[pdfStyles.comparisonBox, pdfStyles.beforeBox]}>
          <Text style={[pdfStyles.comparisonLabel, { color: '#EF4444' }]}>
            Avant
          </Text>
          <Text style={pdfStyles.comparisonText}>"{phraseBefore}"</Text>
        </View>

        <View style={[pdfStyles.comparisonBox, pdfStyles.afterBox]}>
          <Text style={[pdfStyles.comparisonLabel, { color: '#10B981' }]}>
            Après
          </Text>
          <Text style={pdfStyles.comparisonText}>"{phraseAfter}"</Text>
        </View>
      </View>
    </View>
  );
}
