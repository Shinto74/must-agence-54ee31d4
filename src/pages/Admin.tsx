import AdminLayout from "@/components/admin/AdminLayout";
import DashboardPanel from "@/components/admin/panels/DashboardPanel";
import PaiementsPanel from "@/components/admin/panels/PaiementsPanel";
import DemandesPanel from "@/components/admin/panels/DemandesPanel";
import SettingsPanel from "@/components/admin/panels/SettingsPanel";
import PageAccueilPanel from "@/components/admin/panels/PageAccueilPanel";
import PageArtistePanel from "@/components/admin/panels/PageArtistePanel";
import PageEntreprisePanel from "@/components/admin/panels/PageEntreprisePanel";
import PartagePanel from "@/components/admin/panels/PartagePanel";
import IdentitePanel from "@/components/admin/panels/IdentitePanel";

const Admin = () => (
  <AdminLayout>
    {(tab) => (
      <>
        {tab === "dashboard" && <DashboardPanel />}
        {tab === "paiements" && <PaiementsPanel />}
        {tab === "demandes" && <DemandesPanel />}
        {tab === "page_accueil" && <PageAccueilPanel />}
        {tab === "page_artiste" && <PageArtistePanel />}
        {tab === "page_entreprise" && <PageEntreprisePanel />}
        {tab === "partage" && <PartagePanel />}
        {tab === "identite" && <IdentitePanel />}
        {tab === "settings" && <SettingsPanel />}
      </>
    )}
  </AdminLayout>
);

export default Admin;
