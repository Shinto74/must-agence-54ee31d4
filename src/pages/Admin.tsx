import AdminLayout from "@/components/admin/AdminLayout";
import DashboardPanel from "@/components/admin/panels/DashboardPanel";
import VisualEditorPanel from "@/components/admin/panels/VisualEditorPanel";
import ContentSectionsPanel from "@/components/admin/panels/ContentSectionsPanel";
import PaiementsPanel from "@/components/admin/panels/PaiementsPanel";
import DemandesPanel from "@/components/admin/panels/DemandesPanel";
import EquipePanel from "@/components/admin/panels/EquipePanel";
import ArtistesPanel from "@/components/admin/panels/ArtistesPanel";
import ClientsPanel from "@/components/admin/panels/ClientsPanel";
import PacksPanel from "@/components/admin/panels/PacksPanel";
import StatsPanel from "@/components/admin/panels/StatsPanel";
import ServicesPanel from "@/components/admin/panels/ServicesPanel";
import SettingsPanel from "@/components/admin/panels/SettingsPanel";

const Admin = () => (
  <AdminLayout>
    {(tab) => (
      <>
        {tab === "dashboard" && <DashboardPanel />}
        {tab === "editeur" && <VisualEditorPanel />}
        {tab === "contenu" && <ContentSectionsPanel />}
        {tab === "paiements" && <PaiementsPanel />}
        {tab === "demandes" && <DemandesPanel />}
        {tab === "equipe" && <EquipePanel />}
        {tab === "artistes" && <ArtistesPanel />}
        {tab === "clients" && <ClientsPanel />}
        {tab === "packs" && <PacksPanel />}
        {tab === "stats" && <StatsPanel />}
        {tab === "services" && <ServicesPanel />}
        {tab === "settings" && <SettingsPanel />}
      </>
    )}
  </AdminLayout>
);

export default Admin;
