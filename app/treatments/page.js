import PageLayout from "@/components/PageLayout";
import Treatments from "@/components/Treatments";
import { treatments } from "@/data/treatments";

export const metadata = {
  title: "Treatments | Luca Martinez"
};

export default function TreatmentsPage() {
  return (
    <PageLayout
      currentPath="/treatments"
      eyebrow="Development"
      title="Treatments"
      description="Treatment PDFs live in a simple data file and open directly in a new tab for easy review and replacement."
    >
      <Treatments items={treatments} compact />
    </PageLayout>
  );
}
