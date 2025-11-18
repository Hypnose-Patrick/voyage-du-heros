/**
 * PAGE 4 PDF - Suite Transformation I.C.A.R.E. + Recommandations
 * Complément de la page 3 avec les dimensions restantes
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

interface Page4PDFProps {
  userName: string;
  totalProgression: number;
  dimensions: DimensionData[];
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

export default function Page4PDF({
  userName,
  totalProgression,
  dimensions,
  recommendations,
}: Page4PDFProps) {
  return (
    <Page size="A4" style={pdfStyles.page}>
      {/* Page Number */}
      <View style={pdfStyles.pageNumber}>
        <Text>PAGE 4/18</Text>
      </View>

      {/* Header */}
      <View style={pdfStyles.pageHeader}>
        <Text style={pdfStyles.h1}>Transformation I.C.A.R.E. (suite)</Text>
      </View>

      {/* Dimensions restantes (3, 4, 5) */}
      {dimensions.slice(2, 5).map((dimension) => (
        <DimensionCard key={dimension.dimension} {...dimension} />
      ))}

      {/* Recommandations */}
      {recommendations.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={pdfStyles.h2}>🎯 Recommandations pour les 6 prochains mois</Text>
          <View style={pdfStyles.grid}>
            {recommendations.slice(0, 6).map((recommendation, index) => (
              <View key={index} style={[pdfStyles.gridItem, { marginBottom: 8 }]}>
                <View style={pdfStyles.listItem}>
                  <Text style={[pdfStyles.listItemBullet, { color: '#10B981' }]}>
                    ✓
                  </Text>
                  <Text style={pdfStyles.listItemText}>{recommendation}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Message final */}
      <View
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: '#F3E8FF',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.primary,
        }}
      >
        <Text style={[pdfStyles.h3, { textAlign: 'center', marginBottom: 8 }]}>
          Félicitations, {userName} ! 🎉
        </Text>
        <Text style={[pdfStyles.body, { textAlign: 'center' }]}>
          Tu as progressé de +{totalProgression}%. Cette transformation témoigne de ton
          engagement et de ta capacité à évoluer. Continue sur cette voie, chaque pas
          compte dans ton voyage héroïque.
        </Text>
      </View>
    </Page>
  );
}

/**
 * Composant carte pour une dimension (version compacte)
 */
function DimensionCard({
  dimension,
  scoreBefore,
  scoreAfter,
  phraseBefore,
  phraseAfter,
}: DimensionData) {
  const progression = scoreAfter - scoreBefore;

  return (
    <View style={[pdfStyles.card, { marginBottom: 10, padding: 12 }]}>
      {/* Header */}
      <View style={pdfStyles.cardHeader}>
        <Text style={{ fontSize: 18 }}>{dimensionIcons[dimension]}</Text>
        <Text style={[pdfStyles.cardTitle, { fontSize: 14 }]}>{dimension}</Text>
        {progression > 0 && (
          <Text
            style={{
              fontSize: 9,
              color: colors.dimensions.appartenance,
              marginLeft: 'auto',
            }}
          >
            +{progression} pts
          </Text>
        )}
      </View>

      {/* Scores inline */}
      <View style={{ flexDirection: 'row', gap: 15, marginBottom: 8 }}>
        <Text style={pdfStyles.bodySmall}>
          Avant: <Text style={pdfStyles.bold}>{scoreBefore}/10</Text>
        </Text>
        <Text style={pdfStyles.bodySmall}>
          Après: <Text style={pdfStyles.bold}>{scoreAfter}/10</Text>
        </Text>
      </View>

      {/* Comparaison AVANT/APRÈS */}
      <View style={pdfStyles.comparisonContainer}>
        <View style={[pdfStyles.comparisonBox, pdfStyles.beforeBox]}>
          <Text style={[pdfStyles.comparisonLabel, { color: '#EF4444' }]}>
            Avant
          </Text>
          <Text style={[pdfStyles.comparisonText, { fontSize: 9 }]}>
            "{phraseBefore}"
          </Text>
        </View>

        <View style={[pdfStyles.comparisonBox, pdfStyles.afterBox]}>
          <Text style={[pdfStyles.comparisonLabel, { color: '#10B981' }]}>
            Après
          </Text>
          <Text style={[pdfStyles.comparisonText, { fontSize: 9 }]}>
            "{phraseAfter}"
          </Text>
        </View>
      </View>
    </View>
  );
}
