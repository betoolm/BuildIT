import Navbar from "@/components/Navbar";
import { ProjectProvider } from "@/lib/project-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProjectProvider>
      <Navbar />
      <main className="pt-16">{children}</main>
    </ProjectProvider>
  );
}
