<template>
  <Header />
  <div class="player-info-container">
    <div class="player-info">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando informações do jogador...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
      </div>

      <!-- Player Information -->
      <div v-else class="player-content">
        <!-- Header -->
        <div class="player-header">
          <div class="player-avatar">
            <span class="avatar-initial">{{ player.name?.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="player-basic-info">
            <h1 class="player-name">{{ player.name }}</h1>
            <div class="player-status">
              <span :class="['status-badge', player.retired ? 'retired' : 'active']">
                {{ player.retired ? "Aposentado" : "Ativo" }}
              </span>

              <span class="player-position">
                {{ translatePosition(player.mainPosition) }}
              </span>

              <span class="player-position">
                {{ translatePosition(player.subPosition) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <!-- Personal Info Section -->
          <div class="info-section">
            <h3 class="section-title">
              <!-- <span class="section-icon">👤</span> -->
              Informações Pessoais
            </h3>
            <div class="info-cards">
              <div class="info-card">
                <div class="info-label">Data de Nascimento</div>
                <div class="info-value">{{ formatDate(player.age) }}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Altura</div>
                <div class="info-value">{{ player.height }} Metros</div>
              </div>
            </div>
          </div>

          <!-- Stats Section -->
          <div class="info-section stats-section">
            <h3 class="section-title">
              <!-- <span class="section-icon">📊</span> -->
              Estatísticas
            </h3>
            <div class="stats-cards">
              <div class="stat-card total">
                <!-- <div class="stat-icon">🏆</div> -->
                <div class="stat-content">
                  <div class="stat-value">{{ player.points }}</div>
                  <div class="stat-label">Pontos Totais</div>
                </div>
              </div>
              <div class="stat-card">
                <!-- <div class="stat-icon">🚫</div> -->
                <div class="stat-content">
                  <div class="stat-value">{{ player.blockPoints }}</div>
                  <div class="stat-label">Bloqueios</div>
                </div>
              </div>
              <div class="stat-card">
                <!-- <div class="stat-icon">⚡</div> -->
                <div class="stat-content">
                  <div class="stat-value">{{ player.servePoints }}</div>
                  <div class="stat-label">Saques</div>
                </div>
              </div>
              <div class="stat-card">
                <!-- <div class="stat-icon">💥</div> -->
                <div class="stat-content">
                  <div class="stat-value">{{ player.spikePoints }}</div>
                  <div class="stat-label">Ataques</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import PlayerService, { positionTranslations } from "@/api/PlayerService";

const route = useRoute();
const player = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchPlayer = async () => {
  try {
    const id = route.params.id as string;
    const response = await PlayerService.getPlayerById(id);
    player.value = response.data;
  } catch (err) {
    error.value = "Erro ao carregar informações do jogador.";
  } finally {
    loading.value = false;
  }
};

const translatePosition = (position: string | null): string | null => {
  return position ? positionTranslations[position] || position : null;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Não informado";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

onMounted(fetchPlayer);
</script>


<style scoped>
.player-info-container {
  min-height: 100vh;
  background: var(--vt-c-white);
  padding: 2rem 1rem;
}

.player-info {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e1e5e9;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #dc3545;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Player Content */
.player-content {
  padding: 2rem;
}

/* Header Section */
.player-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e9ecef;
}

.player-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(33, 33, 34, 0.3);
  flex-shrink: 0;
}

.avatar-initial {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: bold;
}

.player-basic-info {
  flex: 1;
}

.player-name {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.player-status{
  width: auto;
  display: flex;
  flex-direction: row;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 1rem;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.status-badge.retired {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid #f1b0b7;
}

.player-position{
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #dde0de;
  border: 2px solid #a0a0a0;
  width: auto;
  margin-right: 1rem;

}

/* Stats Grid */
.stats-grid {
  display: grid;
  gap: 2rem;
}

.info-section {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  color: #495057;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
}

.section-icon {
  font-size: 1.5rem;
}

/* Info Cards */
.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.info-label {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 700;
}

/* Position Cards */
.position-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.position-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  border: 2px solid;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.position-card.primary {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(102, 126, 234, 0.05));
}

.position-card.secondary {
  border-color: #764ba2;
  background: linear-gradient(135deg, rgba(118, 75, 162, 0.1), rgba(118, 75, 162, 0.05));
}

.position-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.position-label {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.position-value {
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 700;
}

/* Stats Cards */
.stats-section {
  grid-column: 1 / -1;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card.total {
  border: 2px solid #ffc107;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05));
}

.stat-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  width: 300px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .player-info-container {
    padding: 1rem 0.5rem;
  }
  
  .player-content {
    padding: 1.5rem;
  }
  
  .player-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .player-name {
    font-size: 2rem;
  }
  
  .player-avatar {
    width: 80px;
    height: 80px;
  }
  
  .avatar-initial {
    font-size: 2rem;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
  
  .position-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .player-name {
    font-size: 1.5rem;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}
</style>