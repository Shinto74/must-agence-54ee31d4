import AdminLayout from "@/components/admin/AdminLayout";
import DashboardPanel from "@/components/admin/panels/DashboardPanel";
import PaiementsPanel from "@/components/admin/panels/PaiementsPanel";
import DemandesPanel from "@/components/admin/panels/DemandesPanel";
import EquipePanel from "@/components/admin/panels/EquipePanel";
import StatsPanel from "@/components/admin/panels/StatsPanel";
import SettingsPanel from "@/components/admin/panels/SettingsPanel";
import PageAccueilPanel from "@/components/admin/panels/PageAccueilPanel";
import PageArtistePanel from "@/components/admin/panels/PageArtistePanel";
import PageEntreprisePanel from "@/components/admin/panels/PageEntreprisePanel";
import IdentitePanel from "@/components/admin/panels/IdentitePanel";

const Admin = () => (
  <AdminLayout>
    {(tab) => (
      <>
        {tab === "dashboard" && <DashboardPanel />}
        {tab === "stats" && <StatsPanel />}
        {tab === "paiements" && <PaiementsPanel />}
        {tab === "demandes" && <DemandesPanel />}
        {tab === "page_accueil" && <PageAccueilPanel />}
        {tab === "page_artiste" && <PageArtistePanel />}
        {tab === "page_entreprise" && <PageEntreprisePanel />}
        {tab === "identite" && <IdentitePanel />}
        {tab === "equipe" && <EquipePanel />}
        {tab === "settings" && <SettingsPanel />}
      </>
    )}
  </AdminLayout>
);

export default Admin;
