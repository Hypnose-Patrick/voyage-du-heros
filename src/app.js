// =====================================================
// JobSeek Hero Journey - Main Application
// =====================================================

import { CONFIG } from './config.js';

// =====================================================
// CONSTANTS
// =====================================================

const STAGES = [
    {
        number: 1,
        title: "Station 1 : Votre situation professionnelle actuelle",
        prompt: "Décrivez votre poste actuel (ou dernier poste) et ce qui ne vous convient plus. Soyez concret : missions, environnement, ce qui vous frustre.",
        icareFocus: ["identite"]
    },
    {
        number: 2,
        title: "Station 2 : Pourquoi changer maintenant ?",
        prompt: "Qu'est-ce qui vous pousse à envisager une transition ? Quels sont vos déclencheurs (événement, ras-le-bol, aspiration nouvelle) ?",
        icareFocus: ["identite", "estime"]
    },
    {
        number: 3,
        title: "Station 3 : Vos freins au changement",
        prompt: "Quelles peurs vous empêchent d'agir ? (peur financière, peur du jugement, peur de l'échec, besoin de sécurité...)",
        icareFocus: ["risque", "estime"]
    },
    {
        number: 4,
        title: "Station 4 : Vos ressources disponibles",
        prompt: "Qui peut vous aider ? Quelles compétences possédez-vous déjà ? Quelles formations, réseaux, ou outils avez-vous à disposition ?",
        icareFocus: ["capacites", "appartenance"]
    },
    {
        number: 5,
        title: "Station 5 : Votre premier engagement",
        prompt: "Quel est le premier acte concret que vous allez poser cette semaine ? (mise à jour CV, appel réseau, formation, candidature test...)",
        icareFocus: ["identite", "risque"]
    },
    {
        number: 6,
        title: "Station 6 : Votre écosystème professionnel",
        prompt: "Listez 3 personnes qui vous soutiennent vraiment ET 3 obstacles récurrents (procrastination, perfectionnisme, manque de réseau...)",
        icareFocus: ["capacites", "appartenance", "estime"]
    },
    {
        number: 7,
        title: "Station 7 : Votre stratégie de recherche",
        prompt: "Quel type de poste visez-vous ? Dans quel secteur ? Avec quels critères non-négociables (salaire, lieu, horaires, missions) ?",
        icareFocus: ["identite", "capacites"]
    },
    {
        number: 8,
        title: "Station 8 : Votre plus grande peur professionnelle",
        prompt: "Quelle est LA peur qui vous paralyse le plus ? (syndrome de l'imposteur, peur du rejet, peur de la précarité...) Qu'est-ce qui serait le pire qui pourrait arriver ?",
        icareFocus: ["identite", "risque", "estime"]
    },
    {
        number: 9,
        title: "Station 9 : Vos premiers résultats",
        prompt: "Depuis le début de ce parcours, quels résultats avez-vous obtenus ? (candidatures envoyées, entretiens, nouvelles compétences acquises, confiance retrouvée...)",
        icareFocus: ["identite", "capacites", "appartenance"]
    },
    {
        number: 10,
        title: "Station 10 : Comment tenir sur la durée",
        prompt: "Comment allez-vous maintenir votre motivation si la recherche prend du temps ? Quelles routines mettre en place ?",
        icareFocus: ["risque", "identite"]
    },
    {
        number: 11,
        title: "Station 11 : Votre nouveau positionnement",
        prompt: "En une phrase, qui êtes-vous professionnellement maintenant ? Quel est votre pitch en 30 secondes ?",
        icareFocus: ["identite", "appartenance"]
    },
    {
        number: 12,
        title: "Station 12 : Votre plan d'action 90 jours",
        prompt: "Listez 5 actions concrètes que vous allez mener dans les 90 prochains jours. Soyez précis et mesurable.",
        icareFocus: ["appartenance"]
    }
];

// =====================================================
// STATE MANAGEMENT
// =====================================================

let state = {
    user: null,
    session: null,
    credits: 0,
    journey: null,
    icareProfile: {
        identite: 50,
        capacites: 50,
        appartenance: 50,
        risque: 50,
        estime: 50
    },
    currentStage: 1,
    totalXP: 0,
    isRecording: false,
    recognition: null,
    starExperiences: [] // Expériences STAR collectées
};

// =====================================================
// SUPABASE CLIENT
// =====================================================

let supabase;

async function initSupabase() {
    // Dynamically import Supabase
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
}

// =====================================================
// AUTH FUNCTIONS
// =====================================================

async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
        // Redirect to login
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        return false;
    }
    
    state.session = session;
    state.user = session.user;
    return true;
}

async function fetchCredits() {
    const { data, error } = await supabase
        .from('user_subscriptions')
        .select('credits_remaining, plan_type')
        .eq('user_id', state.user.id)
        .single();
    
    if (error) {
        console.error('Error fetching credits:', error);
        return 0;
    }
    
    state.credits = data?.credits_remaining || 0;
    document.getElementById('credits-count').textContent = state.credits;
    return state.credits;
}

// =====================================================
// API FUNCTIONS (n8n webhooks)
// =====================================================

async function callN8N(endpoint, method = 'POST', body = null) {
    // Validate endpoint exists
    if (!endpoint) {
        throw new Error('Endpoint non défini. Vérifiez votre fichier config.js');
    }

    const url = `${CONFIG.N8N_BASE_URL}${endpoint}`;
    const token = state.session?.access_token;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);

        if (response.status === 402) {
            showCreditsModal();
            throw new Error('Insufficient credits');
        }

        if (!response.ok) {
            // Try to parse error response, but handle cases where it's not JSON
            let errorMessage = 'API error';
            try {
                const error = await response.json();
                errorMessage = error.message || errorMessage;
            } catch (jsonError) {
                const textError = await response.text();
                errorMessage = textError || `Erreur HTTP ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        // Check if response has content
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Réponse invalide du serveur (pas de JSON)');
        }

        const text = await response.text();
        if (!text || text.trim() === '') {
            throw new Error('Réponse vide du serveur');
        }

        try {
            return JSON.parse(text);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError, 'Response:', text);
            throw new Error('Réponse JSON invalide du serveur');
        }
    } catch (error) {
        console.error('n8n API Error:', error);
        throw error;
    }
}

async function startJourney() {
    showLoading(true);
    
    try {
        const data = await callN8N(CONFIG.API_ENDPOINTS.START_JOURNEY, 'POST', {
            userId: state.user.id
        });
        
        state.journey = data.journeyId;
        state.currentStage = data.currentStage;
        state.icareProfile = data.icareProfile;
        
        await fetchCredits();
        
        showScreen('journey-screen');
        updateJourneyUI();
        
    } catch (error) {
        showError('Impossible de démarrer le parcours. ' + error.message);
    } finally {
        showLoading(false);
    }
}

async function submitStageAnswer(stageNumber, userInput) {
    showLoading(true);

    try {
        const data = await callN8N(CONFIG.API_ENDPOINTS.SUBMIT_STAGE, 'POST', {
            journeyId: state.journey,
            stageNumber,
            userInput
        });

        // Update state
        state.icareProfile = data.newIcareProfile;
        state.currentStage = data.nextStage;
        state.totalXP += 125;

        await fetchCredits();

        // Display AI feedback
        displayAIFeedback(data.narrative, data.insight);

        // Update UI
        updateJourneyUI();

        // Extract STAR experience from narrative (async, non-blocking)
        extractSTARExperience(userInput, stageNumber);

    } catch (error) {
        showError('Erreur lors de la soumission. ' + error.message);
    } finally {
        showLoading(false);
    }
}

async function generateFinalInsights() {
    showLoading(true);
    
    try {
        const data = await callN8N(CONFIG.API_ENDPOINTS.GENERATE_INSIGHTS, 'POST', {
            journeyId: state.journey
        });
        
        displayFinalInsights(data);
        showScreen('insights-screen');
        
    } catch (error) {
        showError('Erreur lors de la génération de la synthèse. ' + error.message);
    } finally {
        showLoading(false);
    }
}

async function loadExistingJourney() {
    showLoading(true);
    
    try {
        const { data, error } = await supabase
            .from('hero_journeys')
            .select(`
                *,
                journey_stages(*),
                icare_profiles(*),
                pro_insights(*)
            `)
            .eq('user_id', state.user.id)
            .eq('status', 'in_progress')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (error || !data) {
            return false;
        }
        
        // Journey exists
        state.journey = data.id;
        state.currentStage = data.current_stage;
        state.totalXP = data.total_xp;
        
        if (data.icare_profiles) {
            state.icareProfile = {
                identite: data.icare_profiles.identite,
                capacites: data.icare_profiles.capacites,
                appartenance: data.icare_profiles.appartenance,
                risque: data.icare_profiles.risque,
                estime: data.icare_profiles.estime
            };
        }
        
        // Check if completed
        if (data.status === 'completed' && data.pro_insights) {
            displayFinalInsights(data.pro_insights);
            showScreen('insights-screen');
        } else {
            showScreen('journey-screen');
            updateJourneyUI();
        }
        
        return true;
        
    } catch (error) {
        console.error('Error loading journey:', error);
        return false;
    } finally {
        showLoading(false);
    }
}

// =====================================================
// UI FUNCTIONS
// =====================================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showLoading(show) {
    const loadingScreen = document.getElementById('loading-screen');
    if (show) {
        loadingScreen.classList.remove('hidden');
    } else {
        loadingScreen.classList.add('hidden');
    }
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-modal').classList.remove('hidden');
}

function closeErrorModal() {
    document.getElementById('error-modal').classList.add('hidden');
}

function showCreditsModal() {
    document.getElementById('credits-modal').classList.remove('hidden');
}

function closeCreditsModal() {
    document.getElementById('credits-modal').classList.add('hidden');
}

function updateJourneyUI() {
    // Update progress
    const progress = ((state.currentStage - 1) / 12) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('current-stage').textContent = state.currentStage;
    
    // Update XP
    document.getElementById('total-xp').textContent = state.totalXP;
    
    // Update ICARE chart
    updateICareChart('icare-chart', state.icareProfile);
    updateICareScores();
    
    // Load current stage
    const stage = STAGES[state.currentStage - 1];
    document.getElementById('stage-title').textContent = stage.title;
    document.getElementById('stage-prompt').textContent = stage.prompt;
    
    // Reset input
    document.getElementById('user-input').value = '';
    document.getElementById('char-count').textContent = '0';
    document.getElementById('submit-answer-btn').disabled = true;
    
    // Hide feedback
    document.getElementById('ai-feedback-container').classList.add('hidden');
    document.getElementById('stage-input-container').style.display = 'block';
}

function updateICareScores() {
    document.getElementById('score-identite').textContent = state.icareProfile.identite;
    document.getElementById('score-capacites').textContent = state.icareProfile.capacites;
    document.getElementById('score-appartenance').textContent = state.icareProfile.appartenance;
    document.getElementById('score-risque').textContent = state.icareProfile.risque;
    document.getElementById('score-estime').textContent = state.icareProfile.estime;
}

function displayAIFeedback(narrative, insight) {
    document.getElementById('ai-narrative').textContent = narrative;
    document.getElementById('ai-insight').textContent = insight;
    
    // Hide input, show feedback
    document.getElementById('stage-input-container').style.display = 'none';
    document.getElementById('ai-feedback-container').classList.remove('hidden');
}

async function displayFinalInsights(insights) {
    // Pitch
    document.getElementById('final-pitch').textContent = insights.pitch;

    // Tagline
    document.getElementById('final-tagline').textContent = insights.tagline;

    // Soft Skills
    const skillsContainer = document.getElementById('final-soft-skills');
    skillsContainer.innerHTML = '';
    const skills = typeof insights.soft_skills === 'string'
        ? JSON.parse(insights.soft_skills)
        : insights.soft_skills;

    skills.forEach(skill => {
        const badge = document.createElement('div');
        badge.className = 'skill-badge';
        badge.textContent = skill;
        skillsContainer.appendChild(badge);
    });

    // Accomplishments
    const accomplishmentsContainer = document.getElementById('final-accomplishments');
    accomplishmentsContainer.innerHTML = '';
    const accomplishments = typeof insights.accomplishments === 'string'
        ? JSON.parse(insights.accomplishments)
        : insights.accomplishments;

    accomplishments.forEach(acc => {
        const item = document.createElement('div');
        item.className = 'accomplishment-item';
        item.innerHTML = `
            <h4>${acc.title}</h4>
            <p>${acc.narrative}</p>
        `;
        accomplishmentsContainer.appendChild(item);
    });

    // Environment
    document.getElementById('final-environment').textContent = insights.environment;

    // Load and display STAR experiences
    await loadSTARExperiences();
    displaySTARExperiences();

    // Final ICARE chart
    updateICareChart('final-icare-chart', state.icareProfile);
}

// =====================================================
// ICARE RADAR CHART (Canvas)
// =====================================================

function updateICareChart(canvasId, profile) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 5; i++) {
        const r = (radius / 5) * i;
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI * 2 / 5) {
            const x = centerX + r * Math.cos(angle - Math.PI / 2);
            const y = centerY + r * Math.sin(angle - Math.PI / 2);
            if (angle === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // Draw axes
    const labels = ['Identité', 'Capacités', 'Appartenance', 'Risque', 'Estime'];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
        );
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.stroke();
    }
    
    // Draw data
    const values = [
        profile.identite,
        profile.capacites,
        profile.appartenance,
        profile.risque,
        profile.estime
    ];
    
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
        const value = values[i] / 100; // Normalize to 0-1
        const x = centerX + radius * value * Math.cos(angle);
        const y = centerY + radius * value * Math.sin(angle);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw points
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
        const value = values[i] / 100;
        const x = centerX + radius * value * Math.cos(angle);
        const y = centerY + radius * value * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// =====================================================
// STAR EXTRACTION
// =====================================================

async function extractSTARExperience(narrative, stageNumber = null) {
    try {
        console.log('🌟 Extraction STAR en cours...', {narrative: narrative.substring(0, 50) + '...'});

        const data = await callN8N(CONFIG.API_ENDPOINTS.EXTRACT_STAR, 'POST', {
            userId: state.user.id,
            narrative: narrative,
            stationNum: stageNumber
        });

        if (data.success && data.experience) {
            // Ajouter l'expérience au state local
            state.starExperiences.push(data.experience);

            // Sauvegarder dans Supabase
            await saveSTARToSupabase(data.experience);

            // Afficher une notification subtile
            showSTARNotification(data.experience.title);

            console.log('✅ Expérience STAR extraite:', data.experience.title);
        }

    } catch (error) {
        // Ne pas bloquer l'utilisateur si l'extraction échoue
        console.warn('⚠️ Extraction STAR échouée (non bloquant):', error.message);
    }
}

async function saveSTARToSupabase(experience) {
    try {
        const { data, error } = await supabase
            .from('star_experiences')
            .insert([{
                user_id: state.user.id,
                journey_id: state.journey,
                stage_number: experience.sourceStationNum,
                source_type: experience.sourceType || 'journey',
                narrative_original: experience.narrativeOriginal,
                title: experience.title,
                situation: experience.situation,
                task: experience.task,
                action: experience.action,
                result: experience.result,
                competencies: experience.competencies || []
            }])
            .select()
            .single();

        if (error) {
            console.error('Erreur sauvegarde STAR:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde STAR:', error);
        throw error;
    }
}

async function loadSTARExperiences() {
    try {
        const { data, error } = await supabase
            .from('star_experiences')
            .select('*')
            .eq('user_id', state.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        state.starExperiences = data || [];
        return data;
    } catch (error) {
        console.error('Erreur chargement STAR:', error);
        return [];
    }
}

function showSTARNotification(title) {
    const notification = document.createElement('div');
    notification.className = 'star-notification';
    notification.innerHTML = `
        <div class="star-notification-content">
            <span class="star-icon">⭐</span>
            <span class="star-text">Expérience extraite: <strong>${title}</strong></span>
        </div>
    `;
    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 100);

    // Retrait après 4 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function displaySTARExperiences() {
    const container = document.getElementById('star-experiences-container');
    if (!container || state.starExperiences.length === 0) return;

    container.innerHTML = state.starExperiences.map((exp, index) => `
        <div class="star-card" data-star-id="${exp.id || index}">
            <div class="star-card-header">
                <h4 class="star-title">${exp.title}</h4>
                <span class="star-badge">STAR</span>
            </div>
            <div class="star-card-body">
                <div class="star-section">
                    <strong class="star-label">📍 Situation:</strong>
                    <p>${exp.situation}</p>
                </div>
                <div class="star-section">
                    <strong class="star-label">🎯 Tâche:</strong>
                    <p>${exp.task}</p>
                </div>
                <div class="star-section">
                    <strong class="star-label">⚡ Action:</strong>
                    <p>${exp.action}</p>
                </div>
                <div class="star-section">
                    <strong class="star-label">🏆 Résultat:</strong>
                    <p>${exp.result}</p>
                </div>
                ${exp.competencies && exp.competencies.length > 0 ? `
                    <div class="star-competencies">
                        ${exp.competencies.map(comp => `
                            <span class="competency-badge">${comp}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// =====================================================
// SPEECH RECOGNITION
// =====================================================

function initSpeechRecognition() {
    // Check browser compatibility
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser');
        // Hide voice button if not supported
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.style.display = 'none';
        }
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';

    recognition.onstart = () => {
        state.isRecording = true;
        updateVoiceUI(true);
        console.log('Voice recognition started');
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        // Update textarea with transcription
        const userInput = document.getElementById('user-input');
        const existingText = userInput.value;

        // Only update if we have final transcript
        if (finalTranscript) {
            userInput.value = existingText + finalTranscript;
            finalTranscript = '';

            // Trigger input event to update character count
            userInput.dispatchEvent(new Event('input'));
        }

        // Update status text with interim results
        if (interimTranscript) {
            document.getElementById('voice-status-text').textContent = `En écoute: "${interimTranscript}"`;
        } else {
            document.getElementById('voice-status-text').textContent = 'En écoute...';
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);

        let errorMessage = 'Erreur de reconnaissance vocale';

        switch (event.error) {
            case 'no-speech':
                errorMessage = 'Aucune parole détectée';
                break;
            case 'audio-capture':
                errorMessage = 'Microphone non disponible';
                break;
            case 'not-allowed':
                errorMessage = 'Permission microphone refusée';
                break;
            case 'network':
                errorMessage = 'Erreur réseau';
                break;
        }

        document.getElementById('voice-status-text').textContent = errorMessage;

        // Auto-stop after error
        setTimeout(() => {
            stopVoiceRecognition();
        }, 2000);
    };

    recognition.onend = () => {
        state.isRecording = false;
        updateVoiceUI(false);
        console.log('Voice recognition ended');
    };

    return recognition;
}

function toggleVoiceRecognition() {
    if (!state.recognition) {
        state.recognition = initSpeechRecognition();
        if (!state.recognition) {
            showError('La reconnaissance vocale n\'est pas disponible sur ce navigateur. Veuillez utiliser Chrome, Edge ou Safari.');
            return;
        }
    }

    if (state.isRecording) {
        stopVoiceRecognition();
    } else {
        startVoiceRecognition();
    }
}

function startVoiceRecognition() {
    try {
        state.recognition.start();
    } catch (error) {
        console.error('Error starting recognition:', error);
        showError('Impossible de démarrer la reconnaissance vocale. Vérifiez les permissions du microphone.');
    }
}

function stopVoiceRecognition() {
    if (state.recognition && state.isRecording) {
        state.recognition.stop();
    }
}

function updateVoiceUI(isRecording) {
    const voiceBtn = document.getElementById('voice-btn');
    const voiceStatus = document.getElementById('voice-status');

    if (isRecording) {
        voiceBtn.classList.add('recording');
        voiceStatus.classList.remove('hidden');
    } else {
        voiceBtn.classList.remove('recording');
        voiceStatus.classList.add('hidden');
    }
}

// =====================================================
// EVENT LISTENERS
// =====================================================

function setupEventListeners() {
    // Start journey button
    document.getElementById('start-journey-btn').addEventListener('click', startJourney);

    // Resume journey button
    document.getElementById('resume-journey-btn').addEventListener('click', async () => {
        await loadExistingJourney();
    });

    // User input character count
    const userInput = document.getElementById('user-input');
    const charCount = document.getElementById('char-count');
    const submitBtn = document.getElementById('submit-answer-btn');

    userInput.addEventListener('input', () => {
        const length = userInput.value.trim().length;
        charCount.textContent = length;
        submitBtn.disabled = length < 50;
    });

    // Voice recognition button
    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceRecognition);
    }

    // Submit answer
    submitBtn.addEventListener('click', async () => {
        const input = userInput.value.trim();
        if (input.length < 50) return;

        // Stop voice recognition if active
        stopVoiceRecognition();

        await submitStageAnswer(state.currentStage, input);
    });

    // Next stage button
    document.getElementById('next-stage-btn').addEventListener('click', () => {
        // Stop voice recognition when moving to next stage
        stopVoiceRecognition();

        if (state.currentStage >= 12) {
            // Generate final insights
            generateFinalInsights();
        } else {
            state.currentStage++;
            updateJourneyUI();
        }
    });

    // Download PDF
    document.getElementById('download-pdf-btn').addEventListener('click', () => {
        window.print();
    });

    // Restart journey
    document.getElementById('restart-journey-btn').addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir recommencer un nouveau parcours ?')) {
            stopVoiceRecognition();
            showScreen('welcome-screen');
        }
    });
}

// Make functions global for onclick handlers
window.closeErrorModal = closeErrorModal;
window.closeCreditsModal = closeCreditsModal;

// =====================================================
// INITIALIZATION
// =====================================================

async function init() {
    showLoading(true);

    try {
        // Validate configuration
        if (!CONFIG.API_ENDPOINTS) {
            throw new Error('Configuration incomplète : API_ENDPOINTS manquant. Veuillez copier config.example.js vers config.js et compléter les valeurs.');
        }

        const requiredEndpoints = ['START_JOURNEY', 'SUBMIT_STAGE', 'GENERATE_INSIGHTS', 'EXTRACT_STAR'];
        const missingEndpoints = requiredEndpoints.filter(ep => !CONFIG.API_ENDPOINTS[ep]);

        if (missingEndpoints.length > 0) {
            throw new Error(`Configuration incomplète : endpoints manquants : ${missingEndpoints.join(', ')}`);
        }

        // Initialize Supabase
        await initSupabase();

        // Check authentication
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) return;

        // Fetch credits
        await fetchCredits();

        // Check for existing journey
        const hasJourney = await loadExistingJourney();

        if (!hasJourney) {
            // Show welcome screen
            showScreen('welcome-screen');

            // Check if resume button should be shown
            const { data } = await supabase
                .from('hero_journeys')
                .select('id')
                .eq('user_id', state.user.id)
                .eq('status', 'in_progress')
                .limit(1);

            if (data && data.length > 0) {
                document.getElementById('resume-journey-btn').classList.remove('hidden');
            }
        }

        // Setup event listeners
        setupEventListeners();

        // Show app container
        document.getElementById('app-container').classList.remove('hidden');

    } catch (error) {
        console.error('Initialization error:', error);
        showError('Erreur lors du chargement de l\'application. ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
