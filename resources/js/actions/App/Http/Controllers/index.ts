import ClassifiedsController from './ClassifiedsController'
import AgentAuthController from './AgentAuthController'
import AdminAuthController from './AdminAuthController'
import AdminAgentController from './AdminAgentController'
import AdminAdvertisementController from './AdminAdvertisementController'
import AdminCommissionController from './AdminCommissionController'
import AdminReportsController from './AdminReportsController'
import AdminSettingsController from './AdminSettingsController'
import AgentAdController from './AgentAdController'
import OcrController from './OcrController'
const Controllers = {
    ClassifiedsController: Object.assign(ClassifiedsController, ClassifiedsController),
AgentAuthController: Object.assign(AgentAuthController, AgentAuthController),
AdminAuthController: Object.assign(AdminAuthController, AdminAuthController),
AdminAgentController: Object.assign(AdminAgentController, AdminAgentController),
AdminAdvertisementController: Object.assign(AdminAdvertisementController, AdminAdvertisementController),
AdminCommissionController: Object.assign(AdminCommissionController, AdminCommissionController),
AdminReportsController: Object.assign(AdminReportsController, AdminReportsController),
AdminSettingsController: Object.assign(AdminSettingsController, AdminSettingsController),
AgentAdController: Object.assign(AgentAdController, AgentAdController),
OcrController: Object.assign(OcrController, OcrController),
}

export default Controllers