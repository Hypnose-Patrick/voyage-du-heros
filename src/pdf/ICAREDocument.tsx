/**
 * Document PDF complet pour le profil I.C.A.R.E.
 * Assemble toutes les pages du rapport
 */

import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, colors } from './styles';
import Page3PDF from './Page3PDF';
import Page4PDF from './Page4PDF';

interface DimensionData {
  dimension: string;
  icon: string;
  scoreBefore: number;
  scoreAfter: number;
  phraseBefore: string;
  phraseAfter: string;
  color: string;
}

interface ICAREDocumentProps {
  userName: string;
  journeyDuration: string;
  totalProgression: number;
  dimensions: DimensionData[];
  insights: string[];
  recommendations: string[];
}

export default function ICAREDocument({
  userName,
  journeyDuration,
  totalProgression,
  dimensions,
  insights,
  recommendations,
}: ICAREDocumentProps) {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Document
      title={`Profil I.C.A.R.E. - ${userName}`}
      author="Voyage du Héros"
      subject="Profil de Transformation Professionnelle"
      keywords="ICARE, transformation, développement professionnel"
      creator="Voyage du Héros Platform"
    >
      {/* Page de garde */}
      <Page size="A4" style={pdfStyles.page}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 48, color: colors.primary, marginBottom: 20 }}>
            🌟
          </Text>

          <Text
            style={{
              fontSize: 36,
              fontWeight: 'bold',
              color: colors.primary,
              marginBottom: 10,
              textAlign: 'center',
            }}
          >
            Profil de Transformation
          </Text>

          <Text
            style={{
              fontSize: 24,
              color: colors.gray[700],
              marginBottom: 40,
              textAlign: 'center',
            }}
          >
            I.C.A.R.E.
          </Text>

          <View
            style={{
              width: '80%',
              height: 2,
              backgroundColor: colors.primary,
              marginBottom: 40,
            }}
          />

          <Text
            style={{
              fontSize: 18,
              color: colors.gray[800],
              marginBottom: 10,
            }}
          >
            {userName}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: colors.gray[600],
              marginBottom: 5,
            }}
          >
            Parcours complété en {journeyDuration}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: colors.gray[600],
            }}
          >
            Généré le {currentDate}
          </Text>

          <View
            style={{
              marginTop: 60,
              padding: 20,
              backgroundColor: colors.gray[100],
              borderRadius: 8,
              width: '80%',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.gray[700],
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              Ce rapport présente ta transformation sur les 5 dimensions I.C.A.R.E. :
              Identité, Capacités, Appartenance, Risque et Estime.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View
          style={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            right: 40,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 10, color: colors.gray[500] }}>
            Voyage du Héros - Plateforme de Transformation Professionnelle
          </Text>
        </View>
      </Page>

      {/* Page 2 - Introduction I.C.A.R.E. */}
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.pageNumber}>
          <Text>PAGE 2/18</Text>
        </View>

        <View style={pdfStyles.pageHeader}>
          <Text style={pdfStyles.h1}>Comprendre I.C.A.R.E.</Text>
        </View>

        <Text style={[pdfStyles.body, { marginBottom: 20 }]}>
          Le modèle I.C.A.R.E. identifie les 5 dimensions fondamentales qui peuvent
          bloquer ou propulser ton développement professionnel :
        </Text>

        {/* Explication des dimensions */}
        <DimensionExplanation
          icon="🎭"
          title="I - Identité"
          description="Qui suis-je au-delà de mes rôles ? Cette dimension mesure ta capacité à te définir indépendamment de ton statut professionnel."
          color={colors.dimensions.identite}
        />

        <DimensionExplanation
          icon="🎯"
          title="C - Capacités"
          description="Quelles sont mes vraies compétences ? Cette dimension évalue ta confiance en tes capacités et ta capacité à reconnaître tes forces."
          color={colors.dimensions.capacites}
        />

        <DimensionExplanation
          icon="🤝"
          title="A - Appartenance"
          description="Où est ma place dans le monde ? Cette dimension mesure ton sentiment d'appartenance et ta capacité à créer des liens authentiques."
          color={colors.dimensions.appartenance}
        />

        <DimensionExplanation
          icon="🚀"
          title="R - Risque"
          description="Qu'ose-je entreprendre maintenant ? Cette dimension évalue ta capacité à prendre des risques calculés et à sortir de ta zone de confort."
          color={colors.dimensions.risque}
        />

        <DimensionExplanation
          icon="💎"
          title="E - Estime"
          description="Quelle est ma valeur intrinsèque ? Cette dimension mesure ton estime personnelle indépendamment de tes performances."
          color={colors.dimensions.estime}
        />

        <View style={[pdfStyles.quote, { marginTop: 20 }]}>
          <Text style={pdfStyles.quoteText}>
            Ces 5 dimensions sont interconnectées. Travailler sur l'une d'entre elles
            améliore naturellement les autres, créant une spirale positive de
            transformation.
          </Text>
        </View>
      </Page>

      {/* Page 3 - Transformation I.C.A.R.E. */}
      <Page3PDF
        userName={userName}
        journeyDuration={journeyDuration}
        totalProgression={totalProgression}
        dimensions={dimensions}
        insights={insights}
        recommendations={recommendations}
      />

      {/* Page 4 - Suite + Recommandations */}
      <Page4PDF
        userName={userName}
        totalProgression={totalProgression}
        dimensions={dimensions}
        recommendations={recommendations}
      />
    </Document>
  );
}

/**
 * Composant d'explication d'une dimension
 */
interface DimensionExplanationProps {
  icon: string;
  title: string;
  description: string;
  color: string;
}

function DimensionExplanation({
  icon,
  title,
  description,
  color,
}: DimensionExplanationProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 15,
        padding: 12,
        backgroundColor: colors.gray[100],
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: color,
      }}
    >
      <Text style={{ fontSize: 24, marginRight: 12 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[pdfStyles.h3, { marginBottom: 4, fontSize: 14 }]}>
          {title}
        </Text>
        <Text style={pdfStyles.bodySmall}>{description}</Text>
      </View>
    </View>
  );
}
