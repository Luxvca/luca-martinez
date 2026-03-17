import Contact from "@/components/Contact";
import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Contact | Luca Martinez"
};

export default function ContactPage() {
  return (
    <PageLayout
      currentPath="/contact"
      eyebrow="Contact"
      title="Contact"
      description="Direct contact information and social links for production, development, and collaboration."
    >
      <Contact compact />
    </PageLayout>
  );
}
