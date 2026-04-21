import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { 
  Employe, 
  DemandeConge, 
  DemandeDocument, 
  StatistiquesRH 
} from '@/types'

// Instance Axios configurée
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur requêtes - ajout token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('rh-token') 
      : null
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Intercepteur réponses - gestion erreurs
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || 'Une erreur est survenue'
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('rh-token')
        window.location.href = '/connexion'
      }
    }
    
    return Promise.reject(new Error(message))
  }
)

// ============ Services API ============

// Employés
export const serviceEmployes = {
  recupererTous: () => api.get<Employe[]>('/employes'),
  recupererParId: (id: string) => api.get<Employe>(`/employes/${id}`),
  creer: (donnees: Omit<Employe, 'id'>) => api.post<Employe>('/employes', donnees),
  modifier: (id: string, donnees: Partial<Employe>) => 
    api.patch<Employe>(`/employes/${id}`, donnees),
  supprimer: (id: string) => api.delete(`/employes/${id}`),
}

// Demandes de congés
export const serviceConges = {
  recupererTous: () => api.get<DemandeConge[]>('/conges'),
  recupererParEmploye: (employeId: string) => 
    api.get<DemandeConge[]>(`/conges/employe/${employeId}`),
  creer: (donnees: Omit<DemandeConge, 'id' | 'dateCreation' | 'statut'>) => 
    api.post<DemandeConge>('/conges', donnees),
  approuver: (id: string, commentaire?: string) => 
    api.patch<DemandeConge>(`/conges/${id}/approuver`, { commentaire }),
  refuser: (id: string, commentaire: string) => 
    api.patch<DemandeConge>(`/conges/${id}/refuser`, { commentaire }),
  annuler: (id: string) => api.patch<DemandeConge>(`/conges/${id}/annuler`),
}

// Demandes de documents
export const serviceDocuments = {
  recupererTous: () => api.get<DemandeDocument[]>('/documents'),
  recupererParEmploye: (employeId: string) => 
    api.get<DemandeDocument[]>(`/documents/employe/${employeId}`),
  creer: (donnees: Omit<DemandeDocument, 'id' | 'dateCreation' | 'statut'>) => 
    api.post<DemandeDocument>('/documents', donnees),
  traiter: (id: string, fichierUrl?: string) => 
    api.patch<DemandeDocument>(`/documents/${id}/traiter`, { fichierUrl }),
  refuser: (id: string, commentaire: string) => 
    api.patch<DemandeDocument>(`/documents/${id}/refuser`, { commentaire }),
}

// Statistiques
export const serviceStatistiques = {
  recupererTableauBord: () => api.get<StatistiquesRH>('/statistiques/tableau-bord'),
  recupererAbsenteisme: (periode: string) => 
    api.get<{ date: string; taux: number }[]>(`/statistiques/absenteisme?periode=${periode}`),
  recupererCongesPeriode: (debut: string, fin: string) => 
    api.get<DemandeConge[]>(`/statistiques/conges?debut=${debut}&fin=${fin}`),
}

// Authentification
export const serviceAuth = {
  connexion: (email: string, motDePasse: string) => 
    api.post<{ token: string; utilisateur: Employe }>('/auth/connexion', { email, motDePasse }),
  deconnexion: () => api.post('/auth/deconnexion'),
  profil: () => api.get<Employe>('/auth/profil'),
  modifierMotDePasse: (ancienMdp: string, nouveauMdp: string) => 
    api.patch('/auth/mot-de-passe', { ancienMdp, nouveauMdp }),
}

export default api
