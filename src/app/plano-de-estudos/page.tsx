import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { getStudyPlan } from "./actions";
import { StudyPlanView } from "./study-plan-view";

export default async function PlanoDeEstudosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [plan, { data: subjects }, { data: themes }] = await Promise.all([
    getStudyPlan(),
    supabase.from("subjects").select("id, name").order("name"),
    supabase.from("themes").select("id, name, subject_id").order("name"),
  ]);

  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Breadcrumb
          segments={[
            { label: "Home", href: "/" },
            { label: "Plano de Estudos" },
          ]}
        />

        <StudyPlanView
          plan={plan}
          subjects={subjects ?? []}
          themes={themes ?? []}
        />
      </div>
    </main>
  );
}
