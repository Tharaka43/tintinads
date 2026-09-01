import agents from './agents'
import advertisements from './advertisements'
import commissions from './commissions'
import reports from './reports'
import dashboard from './dashboard'
import settings from './settings'
const api = {
    agents: Object.assign(agents, agents),
advertisements: Object.assign(advertisements, advertisements),
commissions: Object.assign(commissions, commissions),
reports: Object.assign(reports, reports),
dashboard: Object.assign(dashboard, dashboard),
settings: Object.assign(settings, settings),
}

export default api